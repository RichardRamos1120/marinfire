import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import AlertBanner from './components/AlertBanner/AlertBanner';
import IncidentManagement from './components/sections/IncidentManagement/IncidentManagement';
import Weather from './components/sections/Weather/Weather';
import Resources from './components/sections/Resources/Resources';
import Staffing from './components/sections/Staffing/Staffing';
import Command from './components/sections/Command/Command';
import StatusWidget from './components/sidebar/StatusWidget';
import WeatherWidget from './components/sidebar/WeatherWidget';
import QuickActions from './components/sidebar/QuickActions';
import RecentIncidents from './components/sidebar/RecentIncidents';
import moment from 'moment-timezone';

function App() {
  const [activeSection, setActiveSection] = useState('incidents');

  useEffect(() => {
    const updateTime = () => {
      const element = document.getElementById('lastUpdated');
      if (element) {
        const pstTime = moment().tz('America/Los_Angeles');
        const timeString = pstTime.format('h:mm:ss A z');
        element.textContent = timeString;
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'incidents':
        return <IncidentManagement />;
      case 'weather':
        return <Weather />;
      case 'resources':
        return <Resources />;
      case 'staffing':
        return <Staffing />;
      case 'command':
        return <Command />;
      default:
        return <IncidentManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AlertBanner
              title="Fire Weather Warning"
              message="Red Flag Warning in effect through 6 PM Tuesday. High winds and low humidity create critical fire weather conditions."
            />
            {renderSection()}
          </div>
          
          <div className="space-y-6">
            <StatusWidget />
            <WeatherWidget />
            <QuickActions />
            <RecentIncidents />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
