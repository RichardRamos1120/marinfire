import React from 'react';

const IncidentHistory: React.FC = () => {
  const history = [
    {
      time: '12:30',
      type: 'Medical Aid',
      location: 'Mill Valley - 456 Oak St',
      duration: 'Duration: 25 min',
      units: 'E451, M96'
    },
    {
      time: '11:15',
      type: 'MVA',
      location: 'Hwy 101 @ Sir Francis Drake',
      duration: 'Duration: 45 min',
      units: 'E452, T451, BC4'
    },
    {
      time: '09:45',
      type: 'Vegetation Fire',
      location: 'Mt. Tam State Park',
      duration: 'Duration: 2hr 15min',
      units: 'E454, E455, BC4, WT459'
    }
  ];

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option>All Types</option>
          <option>Structure Fires</option>
          <option>Vegetation Fires</option>
          <option>Medical Aids</option>
          <option>MVAs</option>
        </select>
      </div>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg grid grid-cols-5 gap-4 items-center text-sm">
            <div className="font-bold text-slate-700">{item.time}</div>
            <div className="bg-gray-200 px-2 py-1 rounded text-xs font-medium text-center">{item.type}</div>
            <div>{item.location}</div>
            <div className="text-gray-600">{item.duration}</div>
            <div className="text-gray-600">{item.units}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentHistory;