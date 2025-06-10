import React from 'react';
import Tabs from '../../common/Tabs';
import ActiveIncidents from './tabs/ActiveIncidents';
import IncidentHistory from './tabs/IncidentHistory';
import CalFireIncidents from './tabs/CalFireIncidents';
import NorthBayIMT from './tabs/NorthBayIMT';
import IncidentTools from './tabs/IncidentTools';

const IncidentManagement: React.FC = () => {
  const tabs = [
    {
      id: 'active-incidents',
      label: 'Active Incidents',
      content: <ActiveIncidents />
    },
    {
      id: 'incident-history',
      label: 'Recent History',
      content: <IncidentHistory />
    },
    {
      id: 'calfire-incidents',
      label: 'Cal Fire Network',
      content: <CalFireIncidents />
    },
    {
      id: 'nbimt',
      label: 'North Bay IMT',
      content: <NorthBayIMT />
    },
    {
      id: 'incident-tools',
      label: 'Tools & Resources',
      content: <IncidentTools />
    }
  ];

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4 pb-2 border-b-2 border-gray-100">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
          🔥
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Incident Management</h2>
      </div>
      <Tabs tabs={tabs} defaultActiveTab="active-incidents" />
    </section>
  );
};

export default IncidentManagement;