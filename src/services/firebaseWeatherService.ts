import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  isDataStalePST, 
  createPSTTimestamp,
  timestampToPST,
  formatRelativeTimePST,
  formatPSTTime 
} from '../utils/timezone';

// Stormglass API configuration
const STORMGLASS_API_BASE = 'https://api.stormglass.io/v2';
const STORMGLASS_API_KEY = process.env.REACT_APP_STORMGLASS_API_KEY;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Validate API key exists
if (!STORMGLASS_API_KEY) {
  console.error('❌ REACT_APP_STORMGLASS_API_KEY is not defined in environment variables');
}

// Weather station locations
export const WEATHER_LOCATIONS = [
  { name: 'San Rafael', lat: 37.9735, lng: -122.5311 },
  { name: 'Novato', lat: 38.1074, lng: -122.5697 },
  { name: 'Pt. Reyes', lat: 38.0689, lng: -122.8997 },
  { name: 'Mt. Tam', lat: 37.9235, lng: -122.5965 }
];

interface WeatherData {
  time: string;
  airTemperature: { noaa: number };
  humidity: { noaa: number };
  windSpeed: { noaa: number };
  windDirection: { noaa: number };
  visibility: { noaa: number };
  cloudCover: { noaa: number };
}

interface FirebaseWeatherDoc {
  location: string;
  weatherData: WeatherData | null;
  lastUpdated: Timestamp;
  lastFetch: Timestamp;
}

interface AllLocationsWeatherDoc {
  locations: {
    [locationName: string]: {
      weatherData: WeatherData | null;
      lastUpdated: Timestamp;
    }
  };
  lastFetch: Timestamp;
}

// Collection reference
const WEATHER_COLLECTION = 'weather_data';
const ALL_LOCATIONS_DOC = 'all_locations';

// Note: isDataStale is now handled by isDataStalePST in timezone utils

// Fetch weather from Stormglass API
const fetchWeatherFromAPI = async (lat: number, lng: number): Promise<WeatherData | null> => {
  if (!STORMGLASS_API_KEY) {
    console.error('❌ Stormglass API key is not configured');
    return null;
  }

  const params = 'airTemperature,humidity,windSpeed,windDirection,visibility,cloudCover';
  const now = new Date().toISOString();
  const url = `${STORMGLASS_API_BASE}/weather/point?lat=${lat}&lng=${lng}&params=${params}&start=${now}&end=${now}`;

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': STORMGLASS_API_KEY }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.hours && data.hours.length > 0) {
      return data.hours[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching weather from API:', error);
    return null;
  }
};

// Update weather data in Firebase (this would be called by Firebase Functions)
export const updateWeatherInFirebase = async (): Promise<void> => {
  console.log('🌤️ Updating weather data in Firebase...');
  
  try {
    const weatherPromises = WEATHER_LOCATIONS.map(async (location) => {
      const weatherData = await fetchWeatherFromAPI(location.lat, location.lng);
      return {
        locationName: location.name,
        weatherData
      };
    });

    const results = await Promise.all(weatherPromises);
    
    // Prepare the document structure with PST timestamps
    const pstTimestamp = createPSTTimestamp();
    const allLocationsData: AllLocationsWeatherDoc = {
      locations: {},
      lastFetch: pstTimestamp
    };

    results.forEach(result => {
      allLocationsData.locations[result.locationName] = {
        weatherData: result.weatherData,
        lastUpdated: pstTimestamp
      };
    });

    // Save to Firebase
    const docRef = doc(db, WEATHER_COLLECTION, ALL_LOCATIONS_DOC);
    await setDoc(docRef, allLocationsData);
    
    console.log('✅ Weather data updated in Firebase successfully');
  } catch (error) {
    console.error('❌ Error updating weather in Firebase:', error);
  }
};

// Get weather data from Firebase
export const getWeatherFromFirebase = async (): Promise<any[]> => {
  try {
    const docRef = doc(db, WEATHER_COLLECTION, ALL_LOCATIONS_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as AllLocationsWeatherDoc;
      
      // Check if data is stale using PST timezone
      if (isDataStalePST(data.lastFetch)) {
        console.log('🔄 Firebase data is stale (PST), fetching fresh data...');
        await updateWeatherInFirebase();
        
        // Fetch the updated data
        const updatedDocSnap = await getDoc(docRef);
        if (updatedDocSnap.exists()) {
          const updatedData = updatedDocSnap.data() as AllLocationsWeatherDoc;
          return formatFirebaseData(updatedData);
        }
      }
      
      return formatFirebaseData(data);
    } else {
      console.log('📄 No weather data found in Firebase, creating initial data...');
      await updateWeatherInFirebase();
      
      // Fetch the newly created data
      const newDocSnap = await getDoc(docRef);
      if (newDocSnap.exists()) {
        const newData = newDocSnap.data() as AllLocationsWeatherDoc;
        return formatFirebaseData(newData);
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error getting weather from Firebase:', error);
    return [];
  }
};

// Format Firebase data to match expected format
const formatFirebaseData = (data: AllLocationsWeatherDoc): any[] => {
  return Object.entries(data.locations).map(([locationName, locationData]) => ({
    location: locationName,
    data: locationData.weatherData
  }));
};

// Subscribe to real-time weather updates
export const subscribeToWeatherUpdates = (callback: (data: any[]) => void): (() => void) => {
  const docRef = doc(db, WEATHER_COLLECTION, ALL_LOCATIONS_DOC);
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data() as AllLocationsWeatherDoc;
      const formattedData = formatFirebaseData(data);
      callback(formattedData);
    }
  }, (error) => {
    console.error('Error in weather subscription:', error);
  });
};

// Get last update timestamp from Firebase (in PST)
export const getLastUpdateTime = async (): Promise<Date | null> => {
  try {
    const docRef = doc(db, WEATHER_COLLECTION, ALL_LOCATIONS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as AllLocationsWeatherDoc;
      return timestampToPST(data.lastFetch);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting last update time:', error);
    return null;
  }
};

// Get formatted relative time for UI display
export const getFormattedLastUpdateTime = async (): Promise<string> => {
  try {
    const docRef = doc(db, WEATHER_COLLECTION, ALL_LOCATIONS_DOC);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as AllLocationsWeatherDoc;
      return formatRelativeTimePST(data.lastFetch);
    }
    
    return 'Never';
  } catch (error) {
    console.error('Error getting formatted update time:', error);
    return 'Unknown';
  }
};

// Helper functions for formatting (same as before)
export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9/5) + 32);
};

export const msToMph = (ms: number): number => {
  return Math.round(ms * 2.237);
};

export const degreesToCardinal = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

export const getCloudCondition = (cloudCover: number): string => {
  if (cloudCover <= 10) return 'Clear';
  if (cloudCover <= 30) return 'Mostly Clear';
  if (cloudCover <= 60) return 'Partly Cloudy';
  if (cloudCover <= 90) return 'Mostly Cloudy';
  return 'Overcast';
};