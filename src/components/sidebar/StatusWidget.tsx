import React from 'react';

const StatusWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold text-slate-800">System Status</h3>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Dispatch System</span>
          <span className="text-green-600">Online</span>
        </div>
        <div className="flex justify-between">
          <span>Radio Network</span>
          <span className="text-green-600">Operational</span>
        </div>
        <div className="flex justify-between">
          <span>CAD System</span>
          <span className="text-green-600">Active</span>
        </div>
      </div>
    </div>
  );
};

export default StatusWidget;