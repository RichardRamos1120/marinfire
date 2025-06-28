import React from 'react';
import Tabs from '../../common/Tabs';
import ShiftSchedule from './tabs/ShiftSchedule';
import PersonnelRoster from './tabs/PersonnelRoster';
import TimeOffRequests from './tabs/TimeOffRequests';

const Staffing: React.FC = () => {
  const tabs = [
    {
      id: 'shift-schedule',
      label: 'Shift Schedule',
      content: <ShiftSchedule />
    },
    {
      id: 'personnel-roster',
      label: 'Personnel Roster',
      content: <PersonnelRoster />
    },
    {
      id: 'time-off',
      label: 'Time Off Requests',
      content: <TimeOffRequests />
    }
  ];

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4 pb-2 border-b-2 border-gray-100">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
          👥
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Daily Staffing & Scheduling</h2>
      </div>
      <Tabs tabs={tabs} defaultActiveTab="shift-schedule" />
    </section>
  );
};

export default Staffing;