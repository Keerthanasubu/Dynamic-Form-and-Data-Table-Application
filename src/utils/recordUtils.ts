
import { MedicalRecord } from "../types/recordTypes";

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

// Validate phone number
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Validate UID (11 digits)
export const isValidUID = (uid: string): boolean => {
  return /^\d{11}$/.test(uid);
};

// Create a new medical record
export const createRecord = (recordData: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord => {
  return {
    ...recordData,
    id: generateId(),
    createdAt: getCurrentDate(),
  };
};

// Get initial empty record form data
export const getEmptyRecordData = (): Omit<MedicalRecord, 'id' | 'createdAt'> => {
  return {
    name: '',
    uid: '',
    phone: '',
    address: '',
    height: '',
    weight: '',
    pictureUrl: '',
    bloodGroup: 'A+',
    emergencyContact: '',
    medicalHistory: '',
    notes: '',
  };
};

