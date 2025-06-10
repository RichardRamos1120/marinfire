import React from 'react';

const CurrentWeather: React.FC = () => {
  const stations = [
    { name: 'San Rafael', temp: '72°F', humidity: '45%', wind: '12mph NW' },
    { name: 'Novato', temp: '75°F', humidity: '42%', wind: '8mph W' },
    { name: 'Pt. Reyes', temp: '68°F', humidity: '65%', wind: '15mph NW' },
    { name: 'Mt. Tam', temp: '66°F', humidity: '55%', wind: '18mph NW' }
  ];

  return (
    <div>
      <h4 className="text-xl font-semibold text-slate-800 mb-6">Bay Area RAWS Stations - Current Temps</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stations.map((station, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 text-center">
            <div className="font-bold text-slate-800 mb-2">{station.name}</div>
            <div className="text-3xl font-bold text-orange-600 mb-2">{station.temp}</div>
            <div className="text-sm text-gray-600">
              Humidity: {station.humidity} | Wind: {station.wind}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
        <div className="text-red-800">
          <strong className="block mb-2 text-lg">Fire Danger: HIGH</strong>
          <p>Low humidity and moderate winds creating elevated fire conditions</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;