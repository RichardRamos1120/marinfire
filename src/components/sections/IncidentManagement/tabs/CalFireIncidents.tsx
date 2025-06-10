import React from 'react';

const CalFireIncidents: React.FC = () => {
  const regions = [
    {
      name: 'Sonoma County (LNU)',
      incidents: [
        {
          name: 'Geysers Fire',
          size: '125 acres, 60% contained',
          resources: '8 engines, 2 hand crews, 1 dozer'
        }
      ]
    },
    {
      name: 'Napa County (LNU)',
      incidents: [
        {
          name: 'Silverado Fire',
          size: '45 acres, 90% contained',
          resources: '4 engines, 1 hand crew'
        }
      ]
    }
  ];

  return (
    <div>
      <h4 className="text-xl font-semibold text-slate-800 mb-6">Regional Cal Fire Incidents</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {regions.map((region, index) => (
          <div key={index}>
            <h5 className="text-lg font-medium text-blue-600 mb-4 pb-2 border-b-2 border-gray-200">
              {region.name}
            </h5>
            {region.incidents.map((incident, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                <div className="font-bold text-slate-800 mb-1">{incident.name}</div>
                <div className="text-red-600 font-bold mb-1">{incident.size}</div>
                <div className="text-sm text-gray-600">{incident.resources}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
          <h4 className="font-semibold text-slate-800 mb-1">Cal Fire Incidents Map</h4>
          <p className="text-sm text-gray-600">Statewide incident tracking</p>
        </a>
        <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
          <h4 className="font-semibold text-slate-800 mb-1">InciWeb Fire Information</h4>
          <p className="text-sm text-gray-600">Detailed incident reports</p>
        </a>
      </div>
    </div>
  );
};

export default CalFireIncidents;