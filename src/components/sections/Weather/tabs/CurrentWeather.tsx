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
} from '../../../../services/firebaseWeatherService';
import { formatPSTTime } from '../../../../utils/timezone';

interface WeatherStation {
  name: string;
  temp: string;
  humidity: string;
  wind: string;
  visibility: string;
  condition: string;
}

const CurrentWeather: React.FC = () => {
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const formatWeatherData = (results: any[]): WeatherStation[] => {
    return results.map(result => {
      if (!result.data) {
        return {
          name: result.location,
          temp: 'N/A',
          humidity: 'N/A',
          wind: 'N/A',
          visibility: 'N/A',
          condition: 'No Data'
        };
      }
      
      const { data } = result;
      return {
        name: result.location,
        temp: `${celsiusToFahrenheit(data.airTemperature.noaa)}°F`,
        humidity: `${Math.round(data.humidity.noaa)}%`,
        wind: `${msToMph(data.windSpeed.noaa)}mph ${degreesToCardinal(data.windDirection.noaa)}`,
        visibility: `${Math.round(data.visibility.noaa * 0.621371)} mi`, // Convert km to miles
        condition: getCloudCondition(data.cloudCover.noaa)
      };
    });
  };

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await getWeatherFromFirebase();
      
      if (results && results.length > 0) {
        setStations(formatWeatherData(results));
        
        // Get the actual last update time from Firebase
        const lastUpdate = await getLastUpdateTime();
        if (lastUpdate) {
          setLastUpdated(lastUpdate);
        }
        updateRelativeTime();
      } else {
        setError('No weather data available for any locations');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWeatherData();

    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToWeatherUpdates((results: any[]) => {
      console.log('🔥 Real-time weather update received from Firebase');
      if (results && results.length > 0) {
        setStations(formatWeatherData(results));
        
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

  const getFireDangerLevel = () => {
    if (stations.length === 0) return { level: 'UNKNOWN', description: 'Weather data loading...', color: 'gray' };
    
    // Simple fire danger calculation based on temperature, humidity, and wind
    const avgTemp = stations.reduce((sum, station) => sum + parseInt(station.temp), 0) / stations.length;
    const avgHumidity = stations.reduce((sum, station) => sum + parseInt(station.humidity), 0) / stations.length;
    const avgWind = stations.reduce((sum, station) => sum + parseInt(station.wind), 0) / stations.length;
    
    if (avgTemp > 80 && avgHumidity < 30 && avgWind > 15) {
      return { level: 'EXTREME', description: 'High temperature, low humidity, and strong winds create extreme fire conditions', color: 'red' };
    } else if (avgTemp > 75 && avgHumidity < 40 && avgWind > 10) {
      return { level: 'HIGH', description: 'Low humidity and moderate winds creating elevated fire conditions', color: 'red' };
    } else if (avgTemp > 70 && avgHumidity < 50) {
      return { level: 'MODERATE', description: 'Moderate fire conditions - use caution', color: 'yellow' };
    } else {
      return { level: 'LOW', description: 'Current conditions pose low fire risk', color: 'green' };
    }
  };

  const [relativeTime, setRelativeTime] = useState<string>('Never');

  const updateRelativeTime = async () => {
    const formatted = await getFormattedLastUpdateTime();
    setRelativeTime(formatted);
  };

  const fireDanger = getFireDangerLevel();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
        <div className="text-red-800">
          <strong className="block mb-2">Error Loading Weather Data</strong>
          <p>{error}</p>
          <button 
            onClick={fetchWeatherData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-slate-800">Marin County Weather - Current Conditions</h4>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Last updated: {relativeTime}
          {lastUpdated && (
            <span className="text-xs">({formatPSTTime(lastUpdated)})</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stations.map((station, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 text-center">
            <div className="font-bold text-slate-800 mb-2">{station.name}</div>
            <div className="text-3xl font-bold text-orange-600 mb-2">{station.temp}</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Humidity: {station.humidity}</div>
              <div>Wind: {station.wind}</div>
              <div>Visibility: {station.visibility}</div>
              <div className="font-medium text-blue-600">{station.condition}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-lg border-l-4 ${
        fireDanger.color === 'red' ? 'bg-red-50 border-red-600' :
        fireDanger.color === 'yellow' ? 'bg-yellow-50 border-yellow-600' :
        fireDanger.color === 'green' ? 'bg-green-50 border-green-600' :
        'bg-gray-50 border-gray-600'
      }`}>
        <div className={`${
          fireDanger.color === 'red' ? 'text-red-800' :
          fireDanger.color === 'yellow' ? 'text-yellow-800' :
          fireDanger.color === 'green' ? 'text-green-800' :
          'text-gray-800'
        }`}>
          <strong className="block mb-2 text-lg">Fire Danger: {fireDanger.level}</strong>
          <p>{fireDanger.description}</p>
          {lastUpdated && (
            <p className="text-xs mt-2 opacity-75">
              Based on weather conditions as of {formatPSTTime(lastUpdated)}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Weather data updates automatically every hour • Data source: Stormglass API
      </div>
    </div>
  );
};

export default CurrentWeather;