import React from 'react';

interface Incident {
  id: string;
  title: string;
  status: 'contained' | 'controlled' | 'active';
  priority: 'high' | 'medium' | 'low';
  dispatched: string;
  type: string;
  units: string;
  ic: string;
  details: { label: string; value: string }[];
}

const ActiveIncidents: React.FC = () => {
  const incidents: Incident[] = [
    {
      id: '1',
      title: 'Structure Fire - 123 Main St, Novato',
      status: 'contained',
      priority: 'high',
      dispatched: '14:25 (42 min ago)',
      type: 'Residential Structure',
      units: 'E451, T451, E452, BC4',
      ic: 'BC4 - Captain Rodriguez',
      details: [
        { label: 'Occupancy', value: 'Single Family Dwelling' },
        { label: 'Exposures', value: 'B - Single Family (Protected)' }
      ]
    },
    {
      id: '2',
      title: 'Vegetation Fire - Lucas Valley Rd',
      status: 'controlled',
      priority: 'medium',
      dispatched: '13:45 (1hr 22min ago)',
      type: '2.5 acres, 85% contained',
      units: 'E454, BC4, WT459, Hand Crew',
      ic: 'BC4 - Captain Martinez',
      details: [
        { label: 'Threat', value: '3 structures threatened, now protected' },
        { label: 'Cause', value: 'Under investigation' }
      ]
    }
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'contained':
        return 'bg-green-100 text-green-800';
      case 'controlled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityBorderClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-600';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">2</div>
            <div className="text-sm text-gray-600">Active Incidents</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">5</div>
            <div className="text-sm text-gray-600">Units Committed</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">12</div>
            <div className="text-sm text-gray-600">Personnel Deployed</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`bg-white rounded-lg p-6 shadow-md border-l-4 ${getPriorityBorderClass(incident.priority)}`}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h4 className="text-lg font-semibold text-slate-800">{incident.title}</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusClass(incident.status)}`}>
                {incident.status}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div>
                <strong className="text-slate-700">Dispatched:</strong> {incident.dispatched}
              </div>
              <div>
                <strong className="text-slate-700">Type:</strong> {incident.type}
              </div>
              <div>
                <strong className="text-slate-700">Units:</strong> {incident.units}
              </div>
              <div>
                <strong className="text-slate-700">IC:</strong> {incident.ic}
              </div>
              {incident.details.map((detail, index) => (
                <div key={index}>
                  <strong className="text-slate-700">{detail.label}:</strong> {detail.value}
                </div>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                Update Status
              </button>
              <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                Request Resources
              </button>
              <button className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-600 transition-colors">
                ICS Forms
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveIncidents;