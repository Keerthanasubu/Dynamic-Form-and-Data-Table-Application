
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MedicalRecord, EditableField } from '@/types/recordTypes';
import { TableConfig } from '@/types/tableTypes';
import EditableCell from './EditableCell';
import { toast } from 'sonner';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface RecordsTableProps {
  records: MedicalRecord[];
  onUpdateRecord: (id: string, field: EditableField, value: string) => void;
  onDeleteRecord: (id: string) => void;
  tableConfig: TableConfig;
  onTableConfigChange: (config: TableConfig) => void;
  onViewImage?: (imageUrl: string, patientName: string) => void;
}

const RecordsTable: React.FC<RecordsTableProps> = ({ 
  records, 
  onUpdateRecord,
  onDeleteRecord,
  tableConfig,
  onTableConfigChange,
  onViewImage
}) => {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s record?`)) {
      onDeleteRecord(id);
      toast.success('Record deleted successfully');
    }
  };

  const handleSort = (key: string) => {
    onTableConfigChange({
      ...tableConfig,
      sort: {
        key,
        direction: tableConfig.sort?.key === key && tableConfig.sort.direction === 'asc' ? 'desc' : 'asc'
      }
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    onTableConfigChange({ ...tableConfig, page: 1 }); // Reset to first page when filtering
  };

  // Apply filters
  const filteredRecords = records.filter(record => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value) return true;
      const recordValue = String(record[field as keyof MedicalRecord]).toLowerCase();
      return recordValue.includes(value.toLowerCase());
    });
  });

  // Apply sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!tableConfig.sort) return 0;
    const { key, direction } = tableConfig.sort;
    const aValue = String(a[key as keyof MedicalRecord]).toLowerCase();
    const bValue = String(b[key as keyof MedicalRecord]).toLowerCase();
    return direction === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  // Apply pagination
  const startIndex = (tableConfig.page - 1) * tableConfig.pageSize;
  const endIndex = startIndex + tableConfig.pageSize;
  const paginatedRecords = sortedRecords.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedRecords.length / tableConfig.pageSize);

  const SortIndicator = ({ field }: { field: string }) => {
    if (tableConfig.sort?.key !== field) return null;
    return tableConfig.sort.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 inline-block ml-1" />
      : <ArrowDown className="w-4 h-4 inline-block ml-1" />;
  };

  if (records.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No records found. Add a record to get started.</p>
      </Card>
    );
  }

  return (
    <Card className="table-container">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Filter by name..."
            value={filters.name || ''}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Filter by blood group..."
            value={filters.bloodGroup || ''}
            onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Filter by UID..."
            value={filters.uid || ''}
            onChange={(e) => handleFilterChange('uid', e.target.value)}
            className="w-full"
          />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer hover:text-primary">
                Name <SortIndicator field="name" />
              </TableHead>
              <TableHead onClick={() => handleSort('uid')} className="cursor-pointer hover:text-primary">
                UID <SortIndicator field="uid" />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Physical Info</TableHead>
              <TableHead onClick={() => handleSort('bloodGroup')} className="cursor-pointer hover:text-primary">
                Blood Group <SortIndicator field="bloodGroup" />
              </TableHead>
              <TableHead>Medical Info</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <Avatar className="h-12 w-12 cursor-pointer" onClick={() => onViewImage && onViewImage(record.pictureUrl, record.name)}>
                    <AvatarImage src={record.pictureUrl} alt={record.name} />
                    <AvatarFallback>{record.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>
                  <EditableCell 
                    record={record} 
                    field="name" 
                    value={record.name} 
                    onSave={onUpdateRecord}
                  />
                </TableCell>
                <TableCell>
                  <EditableCell 
                    record={record} 
                    field="uid" 
                    value={record.uid} 
                    onSave={onUpdateRecord}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <EditableCell 
                      record={record} 
                      field="phone" 
                      value={record.phone} 
                      onSave={onUpdateRecord}
                    />
                    <EditableCell 
                      record={record} 
                      field="address" 
                      value={record.address} 
                      onSave={onUpdateRecord}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <EditableCell 
                      record={record} 
                      field="height" 
                      value={record.height} 
                      onSave={onUpdateRecord}
                    />
                    <EditableCell 
                      record={record} 
                      field="weight" 
                      value={record.weight} 
                      onSave={onUpdateRecord}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <EditableCell 
                    record={record} 
                    field="bloodGroup" 
                    value={record.bloodGroup} 
                    onSave={onUpdateRecord}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <EditableCell 
                      record={record} 
                      field="medicalHistory" 
                      value={record.medicalHistory} 
                      onSave={onUpdateRecord}
                      multiline
                    />
                    <EditableCell 
                      record={record} 
                      field="notes" 
                      value={record.notes} 
                      onSave={onUpdateRecord}
                      multiline
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(record.id, record.name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedRecords.length)} of {sortedRecords.length} records
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onTableConfigChange({ ...tableConfig, page: Math.max(1, tableConfig.page - 1) })}
                  className={tableConfig.page === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onTableConfigChange({ ...tableConfig, page })}
                    isActive={page === tableConfig.page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onTableConfigChange({ ...tableConfig, page: Math.min(totalPages, tableConfig.page + 1) })}
                  className={tableConfig.page === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </Card>
  );
};

export default RecordsTable;
