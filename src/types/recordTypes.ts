
export interface MedicalRecord {
  id: string;
  name: string;
  uid: string;
  phone: string;
  address: string;
  height: string;
  weight: string;
  pictureUrl: string;
  bloodGroup: BloodGroupType;
  emergencyContact: string;
  medicalHistory: string;
  notes: string;
  createdAt: string;
  dateOfBirth?: string;
  lastUpdated?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type BloodGroupType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type EditableField = keyof Omit<MedicalRecord, 'id' | 'createdAt' | 'pictureUrl' | 'lastUpdated' | 'createdBy' | 'updatedBy'>;
