import React from 'react';

const NorthBayIMT: React.FC = () => {
  const teamContacts = [
    { role: 'Team Leader', name: 'Chief Mike Patterson', phone: '(707) 555-0123' },
    { role: 'Operations', name: 'Div Chief Rodriguez', phone: '(415) 555-0124' },
    { role: 'Planning', name: 'Captain Thompson', phone: '(707) 555-0125' },
    { role: 'Logistics', name: 'Chief Anderson', phone: '(415) 555-0126' }
  ];

  return (
    <div>
      <h4 className="text-xl font-semibold text-slate-800 mb-6">North Bay Incident Management Team</h4>
      
      <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-800 font-medium">Available - Not Currently Activated</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {teamContacts.map((contact, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold text-slate-800 mb-1">{contact.role}</h5>
            <p className="text-gray-700">{contact.name}</p>
            <p className="text-sm text-gray-600">{contact.phone}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
          <h4 className="font-semibold text-slate-800 mb-1">NBIMT Resource List</h4>
          <p className="text-sm text-gray-600">Available team members and resources</p>
        </a>
        <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
          <h4 className="font-semibold text-slate-800 mb-1">Activation Procedures</h4>
          <p className="text-sm text-gray-600">How to request team activation</p>
        </a>
      </div>
    </div>
  );
};

export default NorthBayIMT;