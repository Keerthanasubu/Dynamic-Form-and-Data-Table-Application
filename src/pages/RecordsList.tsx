
import { AppLayout } from '@/components/AppLayout';
import RecordsTable from '@/components/RecordsTable';
import RecordsSearch from '@/components/RecordsSearch';
import { useState } from 'react';
import { TableConfig } from '@/types/tableTypes';
import AnimatedPage from '@/components/AnimatedPage';

const RecordsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableConfig, setTableConfig] = useState<TableConfig>({ page: 1, pageSize: 10 });

  return (
    <AppLayout>
      <AnimatedPage>
        <div className="space-y-6 w-full max-w-7xl mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Medical Records
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              View and manage patient medical records
            </p>
          </div>
          
          <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-border/40">
            <RecordsSearch 
              onSearch={setSearchQuery}
              className="max-w-2xl mx-auto mb-6"
            />
            <RecordsTable
              records={[]}
              onUpdateRecord={() => {}}
              onDeleteRecord={() => {}}
              onViewImage={() => {}}
              tableConfig={tableConfig}
              onTableConfigChange={setTableConfig}
            />
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default RecordsList;
