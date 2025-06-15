import React, { useState, useEffect } from 'react';
import { 
  getWeatherFromFirebase,
  subscribeToWeatherUpdates,
  getLastUpdateTime,
  getFormattedLastUpdateTime,
  celsiusToFahrenheit,
  msToMph,
  degreesToCardinal,
  getCloudCondition
} from '../../services/firebaseWeatherService';
import { formatRelativeTimePST } from '../../utils/timezone';

interface WeatherData {
  location: string;
  temp: string;
  humidity: string;
  wind: string;
  visibility: string;
  condition: string;
}

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string>('Never');

  const updateRelativeTime = async () => {
    const formatted = await getFormattedLastUpdateTime();
    setRelativeTime(formatted);
  };

  const formatWeatherData = (results: any[]): WeatherData[] => {
    return results.map(result => {
      if (!result.data) {
        return {
          location: result.location,
          temp: 'N/A',
          humidity: 'N/A',
          wind: 'N/A',
          visibility: 'N/A',
          condition: 'No Data'
        };
      }
      
      const { data } = result;
      return {
        location: result.location,
        temp: `${celsiusToFahrenheit(data.airTemperature.noaa)}°F`,
        humidity: `${Math.round(data.humidity.noaa)}%`,
        wind: `${msToMph(data.windSpeed.noaa)}mph ${degreesToCardinal(data.windDirection.noaa)}`,
        visibility: `${Math.round(data.visibility.noaa * 0.621371)} mi`,
        condition: getCloudCondition(data.cloudCover.noaa)
      };
    });
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const results = await getWeatherFromFirebase();
      
      if (results && results.length > 0) {
        setWeatherData(formatWeatherData(results));
        
        // Get the actual last update time from Firebase
        const lastUpdate = await getLastUpdateTime();
        if (lastUpdate) {
          setLastUpdated(lastUpdate);
        }
        updateRelativeTime();
      }
    } catch (error) {
      console.error('Weather widget fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToWeatherUpdates((results: any[]) => {
      console.log('🔥 Sidebar real-time weather update received');
      if (results && results.length > 0) {
        setWeatherData(formatWeatherData(results));
        
        // Update timestamp when we receive real-time data
        getLastUpdateTime().then((lastUpdate: Date | null) => {
          if (lastUpdate) {
            setLastUpdated(lastUpdate);
          }
        });
        updateRelativeTime();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const nextLocation = () => {
    setCurrentIndex((prev) => (prev + 1) % weatherData.length);
  };

  const getFireDanger = (temp: string, humidity: string, wind: string) => {
    const tempNum = parseInt(temp);
    const humidityNum = parseInt(humidity);
    const windNum = parseInt(wind);
    
    if (tempNum > 80 && humidityNum < 30 && windNum > 15) {
      return { level: 'EXTREME', color: 'text-red-700' };
    } else if (tempNum > 75 && humidityNum < 40 && windNum > 10) {
      return { level: 'HIGH', color: 'text-red-600' };
    } else if (tempNum > 70 && humidityNum < 50) {
      return { level: 'MODERATE', color: 'text-yellow-600' };
    } else {
      return { level: 'LOW', color: 'text-green-600' };
    }
  };

  if (loading || weatherData.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold text-slate-800 mb-4">Current Weather</h3>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
          <div className="text-gray-500 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  const currentWeather = weatherData[currentIndex];
  const fireDanger = getFireDanger(currentWeather.temp, currentWeather.humidity, currentWeather.wind);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">Current Weather</h3>
        <button
          onClick={nextLocation}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Next location"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-lg font-bold text-blue-600 mb-1">{currentWeather.location}</div>
        <div className="text-4xl font-bold text-slate-800 mb-2">{currentWeather.temp}</div>
        <div className="text-gray-600 mb-4">{currentWeather.condition}</div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-gray-500">Humidity</div>
            <div className="font-semibold">{currentWeather.humidity}</div>
          </div>
          <div>
            <div className="text-gray-500">Wind</div>
            <div className="font-semibold">{currentWeather.wind}</div>
          </div>
          <div>
            <div className="text-gray-500">Fire Danger</div>
            <div className={`font-semibold ${fireDanger.color}`}>{fireDanger.level}</div>
          </div>
          <div>
            <div className="text-gray-500">Visibility</div>
            <div className="font-semibold">{currentWeather.visibility}</div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-center items-center space-x-2">
          {weatherData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          Updated {relativeTime}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;