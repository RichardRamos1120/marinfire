import React from 'react';

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Dispatch Unit
        </button>
        <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Resource Request
        </button>
        <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Update Status
        </button>
        <button className="bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          View Map
        </button>
      </div>
    </div>
  );
};

export default QuickActions;