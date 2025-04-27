
import { AppLayout } from '@/components/AppLayout';
import SecurityCheck from '@/components/SecurityCheck';
import RecordStats from '@/components/RecordStats';
import DataVisualization from '@/components/DataVisualization';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedPage from '@/components/AnimatedPage';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import DashboardWelcome from '@/components/DashboardWelcome';
import { useState } from 'react';

const Dashboard = () => {
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  if (!isAuthenticated) {
    return <SecurityCheck />;
  }

  const mockRecords = []; // Empty for now, would be fetched from API in real app

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="w-full space-y-6">
          <DashboardWelcome userName={user?.name} />

          {mockRecords.length === 0 && (
            <Alert variant="default" className="bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertTitle>No records found</AlertTitle>
              <AlertDescription>
                You haven't added any medical records yet. Add your first record to see analytics and insights.
              </AlertDescription>
            </Alert>
          )}

          <RecordStats records={mockRecords} />
          <DataVisualization 
            records={mockRecords} 
            timeRange={timeRange} 
            onTimeRangeChange={handleTimeRangeChange} 
          />
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default Dashboard;
