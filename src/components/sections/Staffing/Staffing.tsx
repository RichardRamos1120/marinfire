import React from 'react';

const Staffing: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4 pb-2 border-b-2 border-gray-100">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
          👥
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Daily Staffing & Scheduling</h2>
      </div>
      <p className="text-gray-600">Staffing section - Tabs and content to be implemented</p>
    </section>
  );
};

export default Staffing;