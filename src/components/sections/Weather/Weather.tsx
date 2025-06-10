import React from 'react';
import Tabs from '../../common/Tabs';
import CurrentWeather from './tabs/CurrentWeather';
import AlertsWarnings from './tabs/AlertsWarnings';
import LightningActivity from './tabs/LightningActivity';
import FireCameras from './tabs/FireCameras';

const Weather: React.FC = () => {
  const tabs = [
    {
      id: 'current-weather',
      label: 'Current Conditions',
      content: <CurrentWeather />
    },
    {
      id: 'alerts',
      label: 'Alerts & Warnings',
      content: <AlertsWarnings />
    },
    {
      id: 'lightning',
      label: 'Lightning Activity',
      content: <LightningActivity />
    },
    {
      id: 'cameras',
      label: 'Fire Cameras',
      content: <FireCameras />
    }
  ];

  return (
    <section className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4 pb-2 border-b-2 border-gray-100">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
          🌤️
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">Weather & Environmental</h2>
      </div>
      <Tabs tabs={tabs} defaultActiveTab="current-weather" />
    </section>
  );
};

export default Weather;