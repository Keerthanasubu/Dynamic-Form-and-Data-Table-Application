
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicalRecord, BloodGroupType } from '@/types/recordTypes';
import { ChartPie, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSkeleton } from './LoadingSkeleton';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface DataVisualizationProps {
  records: MedicalRecord[];
  timeRange: 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'week' | 'month' | 'year') => void;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ 
  records, 
  timeRange, 
  onTimeRangeChange 
}) => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleRefreshData = () => {
    setLoading(true);
    // Simulate data refresh
    toast({
      title: "Refreshing data",
      description: "Fetching the latest information...",
    });

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Data refreshed",
        description: "Charts have been updated with latest data",
      });
    }, 1500);
  };

  // Data for blood group distribution
  const bloodGroups: BloodGroupType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const bloodGroupCounts = bloodGroups.map(group => {
    const count = records.filter(record => record.bloodGroup === group).length;
    return { 
      name: group, 
      value: count || Math.floor(Math.random() * 5), // Random data for empty state
      // Only show in legend if there's at least one record
      show: count > 0 || records.length === 0
    };
  }).filter(item => item.show);

  // COLORS for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d'];

  // Get records by month for time-based graph
  const getRecordsByTimePeriod = () => {
    if (records.length === 0) {
      // Generate placeholder data if no records
      const currentDate = new Date();
      const labels = [];
      
      if (timeRange === 'week') {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(currentDate.getDate() - i);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        return labels.map(day => ({ month: day, count: Math.floor(Math.random() * 5) }));
      }
      
      if (timeRange === 'month') {
        // Last 4 weeks
        for (let i = 3; i >= 0; i--) {
          const weekNum = 4 - i;
          labels.push(`Week ${weekNum}`);
        }
        return labels.map(week => ({ month: week, count: Math.floor(Math.random() * 10) }));
      }
      
      // Year - last 12 months
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonth = currentDate.getMonth();
      
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(monthNames[monthIndex]);
      }
      
      return labels.map(month => ({ month, count: Math.floor(Math.random() * 15) }));
    }
    
    // Use actual data if available
    const months: Record<string, number> = {};
    
    records.forEach(record => {
      const date = new Date(record.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (months[monthYear]) {
        months[monthYear]++;
      } else {
        months[monthYear] = 1;
      }
    });
    
    // Convert to array format for chart
    return Object.entries(months).map(([month, count]) => ({
      month,
      count
    }));
  };

  const EmptyChartPlaceholder = ({ icon, message }: { icon: React.ReactNode, message: string }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
      {icon}
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>Data Visualization</span>
        </h2>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: 'week' | 'month' | 'year') => onTimeRangeChange(value)}>
            <SelectTrigger className="w-[140px]">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={handleRefreshData} aria-label="Refresh data">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Blood Group Distribution */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ChartPie className="h-5 w-5 text-primary" />
                <CardTitle>Blood Group Distribution</CardTitle>
              </div>
              <CardDescription>Breakdown of patient blood groups</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <LoadingSkeleton className="h-40 w-40 rounded-full" />
                  <LoadingSkeleton className="h-6 w-3/4" />
                </div>
              ) : records.length === 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodGroupCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {bloodGroupCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bloodGroupCounts}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {bloodGroupCounts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Records Over Time */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Records Over Time</CardTitle>
              </div>
              <CardDescription>
                Patient records by {timeRange === 'week' ? 'day' : timeRange === 'month' ? 'week' : 'month'}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="flex flex-col justify-end h-full gap-2 pt-10">
                  <div className="flex items-end justify-around h-40 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((item) => {
                      const randomHeight = Math.max(20, Math.floor(Math.random() * 100));
                      return (
                        <LoadingSkeleton 
                          key={item} 
                          className={`w-8 h-[${randomHeight}px]`} 
                        />
                      );
                    })}
                  </div>
                  <LoadingSkeleton className="h-6 w-full mt-4" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getRecordsByTimePeriod()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Records" fill="#1EAEDB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DataVisualization;
