
import { useState, useEffect } from 'react';

const DRAFT_KEY_PREFIX = 'medicalForm_draft_';

export function useFormDraft<T>(formId: string, initialData: T) {
  // Create a unique key for this form
  const draftKey = `${DRAFT_KEY_PREFIX}${formId}`;
  
  // Try to load draft from localStorage
  const loadDraft = (): T => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        return JSON.parse(savedDraft);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
    return initialData;
  };
  
  // Initialize state with draft or initial data
  const [data, setData] = useState<T>(loadDraft);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [data, draftKey]);
  
  // Function to clear the draft
  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey);
      setData(initialData);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  };
  
  // Return the state and management functions
  return {
    data,
    setData,
    clearDraft,
    hasDraft: localStorage.getItem(draftKey) !== null,
  };
}

export default useFormDraft;
