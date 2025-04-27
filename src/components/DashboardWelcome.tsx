
import React from 'react';

interface DashboardWelcomeProps {
  userName?: string;
}

const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({ userName }) => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {greeting()}, {userName || 'Doctor'}!
        </span>
      </h1>
      <p className="text-muted-foreground mt-2">
        Here's an overview of your medical records data.
      </p>
    </div>
  );
};

export default DashboardWelcome;
