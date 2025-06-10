import React from 'react';

const WeatherWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-slate-800 mb-4">Current Weather</h3>
      <div className="text-center">
        <div className="text-4xl font-bold text-slate-800 mb-2">72°F</div>
        <div className="text-gray-600 mb-4">Partly Cloudy</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-gray-500">Humidity</div>
            <div className="font-semibold">45%</div>
          </div>
          <div>
            <div className="text-gray-500">Wind</div>
            <div className="font-semibold">12 mph NW</div>
          </div>
          <div>
            <div className="text-gray-500">Fire Danger</div>
            <div className="font-semibold text-red-600">HIGH</div>
          </div>
          <div>
            <div className="text-gray-500">Visibility</div>
            <div className="font-semibold">10 mi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;