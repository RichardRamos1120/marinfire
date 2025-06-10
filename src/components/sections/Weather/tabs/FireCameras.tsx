import React from 'react';

const FireCameras: React.FC = () => {
  const cameraLinks = [
    {
      title: 'Nevada Seismological Lab Cameras',
      description: 'Live fire detection cameras'
    },
    {
      title: 'ALERTWildfire Camera Network',
      description: 'Regional wildfire camera system'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cameraLinks.map((link, index) => (
        <a
          key={index}
          href="#"
          className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500 hover:bg-gray-100 transition-colors"
        >
          <h4 className="font-semibold text-slate-800 mb-2">{link.title}</h4>
          <p className="text-sm text-gray-600">{link.description}</p>
        </a>
      ))}
    </div>
  );
};

export default FireCameras;