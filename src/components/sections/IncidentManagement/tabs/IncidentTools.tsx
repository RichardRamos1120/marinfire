import React from 'react';

const IncidentTools: React.FC = () => {
  const toolCategories = [
    {
      title: 'ICS Forms & Documentation',
      items: [
        'ICS 201 - Incident Briefing',
        'ICS 202 - Incident Objectives',
        'ICS 203 - Organization Assignment',
        'ICS 204 - Assignment List',
        'ICS 205 - Communications Plan'
      ]
    },
    {
      title: 'Resource Ordering',
      items: [
        'Strike Team Request',
        'Single Resource Order',
        'Mutual Aid Request',
        'Equipment Request'
      ]
    },
    {
      title: 'Communications',
      items: [
        'Radio Frequency Plan',
        'Tactical Channels',
        'Command Frequencies',
        'Interagency Channels'
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {toolCategories.map((category, index) => (
        <div key={index}>
          <h5 className="text-lg font-medium text-blue-600 mb-4 pb-2 border-b-2 border-gray-200">
            {category.title}
          </h5>
          <div className="space-y-2">
            {category.items.map((item, idx) => (
              <a
                key={idx}
                href="#"
                className="block bg-gray-50 p-3 rounded text-sm text-gray-700 border-l-4 border-blue-500 hover:bg-gray-100 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncidentTools;