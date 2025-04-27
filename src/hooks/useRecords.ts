
import { useState } from 'react';
import { MedicalRecord } from '@/types/recordTypes';

export const useRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const addRecord = (record: MedicalRecord) => {
    setRecords(prev => [...prev, record]);
  };

  return {
    records,
    addRecord
  };
};
