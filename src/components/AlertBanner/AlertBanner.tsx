import React from 'react';

interface AlertBannerProps {
  title: string;
  message: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ title, message }) => {
  return (
    <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse-subtle">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        🚨 {title}
      </h3>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default AlertBanner;