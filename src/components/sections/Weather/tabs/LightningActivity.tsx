import React from 'react';

const LightningActivity: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold text-slate-800">Lightning Detection - Marin County Area</h4>
          <div className="text-sm text-gray-600">
            Last Update: 3.7s ago | No recent strikes detected
          </div>
        </div>
        
        <div className="bg-gray-50 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <p className="mb-2">⚡ Real-time lightning detection</p>
            <p className="mb-2">📍 Centered on Marin County</p>
            <p>✅ No strikes in last 30 minutes</p>
          </div>
        </div>
      </div>

      <a href="#" className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors block">
        <h4 className="font-semibold text-slate-800 mb-1">Full Lightning Map (Blitzortung.org)</h4>
        <p className="text-sm text-gray-600">Interactive real-time lightning detection</p>
      </a>
    </div>
  );
};

export default LightningActivity;