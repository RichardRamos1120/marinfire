import React from 'react';

const AlertsWarnings: React.FC = () => {
  return (
    <div>
      <h4 className="text-xl font-semibold text-slate-800 mb-6">NWS Alerts for Marin County</h4>
      
      <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-600 mb-6">
        <div className="font-bold text-red-800 mb-2">Fire Weather Watch</div>
        <div className="text-sm text-gray-600 mb-2">
          Issued: 6:00 AM | Effective through 6:00 PM Tuesday
        </div>
        <div className="text-gray-700">
          Critical fire weather conditions possible due to low humidity and gusty winds
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
          <h4 className="font-semibold text-slate-800 mb-1">Weather Alerts Map Northern CA</h4>
          <p className="text-sm text-gray-600">Regional weather alert mapping</p>
        </a>
        <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors">
          <h4 className="font-semibold text-slate-800 mb-1">NWS Alerts - Marin Zone</h4>
          <p className="text-sm text-gray-600">Direct link to CAC041 alerts</p>
        </a>
      </div>
    </div>
  );
};

export default AlertsWarnings;