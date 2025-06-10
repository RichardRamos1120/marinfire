import React from 'react';

const RecentIncidents: React.FC = () => {
  const incidents = [
    {
      title: 'Structure Fire',
      location: 'Novato',
      time: '14:25'
    },
    {
      title: 'Vegetation Fire',
      location: 'Lucas Valley',
      time: '13:45'
    },
    {
      title: 'Medical Aid',
      location: 'Mill Valley',
      time: '12:30'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-slate-800 mb-4">Recent Incidents</h3>
      <div className="space-y-3 max-h-52 overflow-y-auto">
        {incidents.map((incident, index) => (
          <div key={index} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-600">
            <div className="font-semibold text-slate-800 text-sm">{incident.title}</div>
            <div className="text-xs text-gray-600 mt-1">
              {incident.location} • {incident.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentIncidents;