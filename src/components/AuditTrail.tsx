
import React from 'react';
import { MedicalRecord } from '@/types/recordTypes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

interface AuditTrailProps {
  record: MedicalRecord;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ record }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">Audit Trail</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Created</TableCell>
              <TableCell>{record.createdBy || 'Unknown'}</TableCell>
              <TableCell>{formatDate(record.createdAt)}</TableCell>
            </TableRow>
            {record.lastUpdated && record.lastUpdated !== record.createdAt && (
              <TableRow>
                <TableCell>Last Updated</TableCell>
                <TableCell>{record.updatedBy || 'Unknown'}</TableCell>
                <TableCell>{formatDate(record.lastUpdated)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
