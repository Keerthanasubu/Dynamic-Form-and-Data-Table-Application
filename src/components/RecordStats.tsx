
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MedicalRecord } from '@/types/recordTypes';
import { LoadingSkeleton } from './LoadingSkeleton';
import { FileText, Activity, Droplet } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface RecordStatsProps {
  records: MedicalRecord[];
}

interface StatsData {
  totalRecords: number;
  commonBloodGroup: string;
  avgBMI: number | string; 
}

const RecordStats: React.FC<RecordStatsProps> = ({ records }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({ totalRecords: 0, commonBloodGroup: 'N/A', avgBMI: 0 });

  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    const timer = setTimeout(() => {
      setStats(calculateStats());
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [records]);

  const calculateStats = (): StatsData => {
    if (records.length === 0) return { totalRecords: 0, commonBloodGroup: 'N/A', avgBMI: 0 };

    // Calculate most common blood group
    const bloodGroups = records.reduce((acc, record) => {
      acc[record.bloodGroup] = (acc[record.bloodGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonBloodGroup = Object.entries(bloodGroups).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Calculate average BMI
    let validBMICount = 0;
    const totalBMI = records.reduce((sum, record) => {
      const height = parseFloat(record.height);
      const weight = parseFloat(record.weight);
      
      if (height && weight && height > 0) {
        validBMICount++;
        const heightInMeters = height / 100; // Convert cm to meters
        return sum + (weight / (heightInMeters * heightInMeters));
      }
      return sum;
    }, 0);

    const avgBMI = validBMICount > 0 ? totalBMI / validBMICount : 0;

    return {
      totalRecords: records.length,
      commonBloodGroup,
      avgBMI: avgBMI.toFixed(1) // This returns a string
    };
  };

  // Define badge colors based on values
  const getBadgeVariant = (key: keyof StatsData) => {
    if (key === 'totalRecords') {
      return stats.totalRecords > 10 ? 'default' : 'secondary';
    }
    if (key === 'avgBMI') {
      const bmi = parseFloat(stats.avgBMI.toString());
      if (bmi === 0) return 'secondary';
      if (bmi < 18.5) return 'destructive';  // Underweight
      if (bmi > 25) return 'destructive';    // Overweight
      return 'default';                      // Normal
    }
    return 'default';
  };

  const statCards = [
    {
      title: 'Total Records',
      value: stats.totalRecords,
      icon: <FileText className="h-5 w-5" />,
      badgeText: stats.totalRecords > 0 ? 'Active' : 'No Records',
      key: 'totalRecords' as keyof StatsData
    },
    {
      title: 'Most Common Blood Group',
      value: stats.commonBloodGroup,
      icon: <Droplet className="h-5 w-5 text-red-500" />,
      badgeText: stats.commonBloodGroup !== 'N/A' ? 'Common' : 'No Data',
      key: 'commonBloodGroup' as keyof StatsData
    },
    {
      title: 'Average BMI',
      value: stats.avgBMI,
      icon: <Activity className="h-5 w-5 text-green-500" />,
      badgeText: parseFloat(stats.avgBMI.toString()) > 0 ? 'Calculated' : 'No Data',
      key: 'avgBMI' as keyof StatsData
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statCards.map((card) => (
        <motion.div
          key={card.title}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          className="h-full"
        >
          <Card className="h-full transition-shadow hover:shadow-lg border-opacity-60 hover:border-primary/40 dark:hover:border-primary/40">
            <CardContent className="pt-6 flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {card.icon}
                </div>
                <Badge variant={getBadgeVariant(card.key)}>
                  {card.badgeText}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4">{card.title}</h3>
              {loading ? (
                <LoadingSkeleton className="h-10 w-24 mt-2" />
              ) : (
                <p className="text-3xl font-bold text-primary mt-2 mb-auto">
                  {card.value}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default RecordStats;
