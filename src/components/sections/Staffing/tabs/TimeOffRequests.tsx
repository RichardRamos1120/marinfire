import React from 'react';

const TimeOffRequests: React.FC = () => {
  return (
    <div className="py-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Time Off Requests</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Manage vacation requests, sick leave, and other time-off submissions from personnel.
        </p>
        <p className="text-sm text-gray-400 mt-4">Coming soon</p>
      </div>
    </div>
  );
};

export default TimeOffRequests;