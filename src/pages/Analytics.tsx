
import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import DataVisualization from '@/components/DataVisualization';
import AnimatedPage from '@/components/AnimatedPage';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="space-y-6 w-full max-w-7xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Analytics
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              View insights and trends from your medical records
            </p>
          </div>

          <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-border/40">
            <DataVisualization 
              records={[]} 
              timeRange={timeRange} 
              onTimeRangeChange={handleTimeRangeChange} 
            />
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default Analytics;
