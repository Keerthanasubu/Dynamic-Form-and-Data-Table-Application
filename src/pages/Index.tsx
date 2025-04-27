import { useState, useEffect, useRef } from 'react';
import RecordForm from '@/components/RecordForm';
import RecordsTable from '@/components/RecordsTable';
import RecordsSearch from '@/components/RecordsSearch';
import RecordStats from '@/components/RecordStats';
import SecurityCheck from '@/components/SecurityCheck';
import DataVisualization from '@/components/DataVisualization';
import ImageModal from '@/components/ImageModal';
import UserProfile from '@/components/UserProfile';
import { DarkModeSwitch } from '@/components/DarkModeSwitch';
import { MedicalRecord, EditableField } from '@/types/recordTypes';
import { TableConfig } from '@/types/tableTypes';
import { exportToJSON, exportToCSV, importFromJSON, importFromCSV } from '@/utils/exportImport';
import { showUndoToast } from '@/components/UndoToast';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  FileJson, 
  FileText, 
  Upload, 
  Save,
  ShieldAlert
} from "lucide-react";

const LOCAL_STORAGE_KEY = 'medicalRecords';

const Index = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableConfig, setTableConfig] = useState<TableConfig>({ page: 1, pageSize: 10 });
  const [imageModal, setImageModal] = useState<{isOpen: boolean, imageUrl: string, patientName: string}>({
    isOpen: false, 
    imageUrl: '', 
    patientName: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [lastDeletedRecord, setLastDeletedRecord] = useState<MedicalRecord | null>(null);
  
  const { theme } = useTheme();
  
  const { authState, logout, hasPermission } = useAuth();
  const { isAuthenticated, user } = authState;

  useEffect(() => {
    const savedRecords = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (error) {
        console.error('Failed to parse saved records', error);
        toast.error('Failed to load saved records');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = records.filter(record => 
      record.name.toLowerCase().includes(query.toLowerCase()) ||
      record.uid.includes(query) ||
      record.phone.includes(query)
    );
    setFilteredRecords(filtered);
  };

  const handleAddRecord = (newRecord: MedicalRecord) => {
    if (!hasPermission('records', 'create')) {
      toast.error('You do not have permission to add records');
      return;
    }
    
    if (records.some(record => record.uid === newRecord.uid)) {
      toast.error('UID already exists');
      return;
    }
    
    const recordWithMeta = {
      ...newRecord,
      lastUpdated: new Date().toISOString(),
      createdBy: user?.name || 'Unknown',
    };
    
    setRecords((prevRecords) => [recordWithMeta, ...prevRecords]);
    handleSearch(searchQuery);
    toast.success('Record added successfully');
  };

  const handleUpdateRecord = (id: string, field: EditableField, value: string) => {
    if (!hasPermission('records', 'update')) {
      toast.error('You do not have permission to update records');
      return;
    }
    
    if (field === 'uid' && records.some(record => record.uid === value && record.id !== id)) {
      toast.error('UID already exists');
      return;
    }
    
    setRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.id === id ? { 
          ...record, 
          [field]: value,
          lastUpdated: new Date().toISOString(),
          updatedBy: user?.name || 'Unknown',
        } : record
      )
    );
    handleSearch(searchQuery);
    toast.success('Record updated successfully');
  };

  const handleDeleteRecord = (id: string) => {
    if (!hasPermission('records', 'delete')) {
      toast.error('You do not have permission to delete records');
      return;
    }
    
    const recordToDelete = records.find(record => record.id === id);
    if (recordToDelete) {
      setLastDeletedRecord(recordToDelete);
    }
    
    setRecords((prevRecords) => prevRecords.filter((record) => record.id !== id));
    handleSearch(searchQuery);
    
    showUndoToast('Record deleted', handleUndoDelete);
  };
  
  const handleUndoDelete = () => {
    if (lastDeletedRecord) {
      setRecords(prev => [lastDeletedRecord, ...prev]);
      setLastDeletedRecord(null);
      toast.success('Deletion undone');
    }
  };

  const handleExportWithAnimation = (action: () => void) => {
    const button = document.activeElement as HTMLButtonElement;
    button?.classList.add('animate-button-pop');
    action();
    setTimeout(() => {
      button?.classList.remove('animate-button-pop');
    }, 300);
  };

  const handleExportPDF = () => {
    window.print();
    toast.success('Preparing PDF export...');
  };
  
  const handleExportJSON = () => {
    const dataToExport = searchQuery ? filteredRecords : records;
    exportToJSON(dataToExport);
  };
  
  const handleExportCSV = () => {
    const dataToExport = searchQuery ? filteredRecords : records;
    exportToCSV(dataToExport);
  };
  
  const handleImportClick = () => {
    if (!hasPermission('records', 'create')) {
      toast.error('You do not have permission to import records');
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      let importedRecords: MedicalRecord[] = [];
      
      if (file.name.endsWith('.json')) {
        importedRecords = await importFromJSON(file);
      } else if (file.name.endsWith('.csv')) {
        importedRecords = await importFromCSV(file);
      } else {
        toast.error('Unsupported file format. Please use .json or .csv');
        return;
      }
      
      importedRecords = importedRecords.map(record => ({
        ...record,
        createdBy: user?.name || 'Unknown',
        lastUpdated: new Date().toISOString()
      }));
      
      const existingUIDs = new Set(records.map(r => r.uid));
      const validRecords = importedRecords.filter(r => {
        const isDuplicate = existingUIDs.has(r.uid);
        if (isDuplicate) {
          toast.error(`Skipped record with duplicate UID: ${r.uid}`);
        }
        return !isDuplicate;
      });
      
      if (validRecords.length > 0) {
        setRecords(prev => [...validRecords, ...prev]);
        toast.success(`Imported ${validRecords.length} records successfully`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleOpenImageModal = (imageUrl: string, patientName: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      patientName
    });
  };

  if (!isAuthenticated) {
    return <SecurityCheck />;
  }

  if (!hasPermission('records', 'read')) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8 pb-24 flex items-center justify-center`}>
        <div className="text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You do not have permission to view medical records.</p>
          <p className="text-muted-foreground">Please contact an administrator for assistance.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => logout()}
          >
            Log Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} py-8 px-4 sm:px-6 lg:px-8 pb-24`}>
      <div className="medical-form-container">
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <DarkModeSwitch />
            <UserProfile />
          </div>
          <h1 className={`text-3xl font-bold text-primary`}>Medical Records Manager</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create and manage patient medical records
          </p>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportWithAnimation(handleExportJSON)}
              className="transition-transform hover:scale-105"
            >
              <Save className="h-4 w-4 mr-2" /> Export JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportWithAnimation(handleExportCSV)}
              className="transition-transform hover:scale-105"
            >
              <Save className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleImportClick} 
              disabled={!hasPermission('records', 'create')}
              className="transition-transform hover:scale-105"
            >
              <Upload className="h-4 w-4 mr-2" /> Import
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileImport}
                accept=".json,.csv"
                className="hidden"
              />
            </Button>
          </div>
        </header>

        <RecordStats records={records} />
        
        <DataVisualization 
          records={records} 
          timeRange="month" 
          onTimeRangeChange={(range) => console.log(`Time range changed to ${range}`)} 
        />
        
        <TooltipProvider>
          {hasPermission('records', 'create') && (
            <RecordForm 
              onAddRecord={handleAddRecord}
              onExportPDF={handleExportPDF}
            />
          )}
          
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Patient Records</h2>
            <RecordsSearch onSearch={handleSearch} />
            {hasPermission('records', 'update') && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 cursor-help">
                    Double-click on any cell to edit its content directly
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Changes are saved automatically</p>
                </TooltipContent>
              </Tooltip>
            )}
            <RecordsTable
              records={records}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onViewImage={handleOpenImageModal}
              tableConfig={tableConfig}
              onTableConfigChange={setTableConfig}
            />
            
            <ImageModal 
              isOpen={imageModal.isOpen} 
              onClose={() => setImageModal({...imageModal, isOpen: false})}
              imageUrl={imageModal.imageUrl}
              patientName={imageModal.patientName}
            />
          </div>
        </TooltipProvider>
        
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Medical Records Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
