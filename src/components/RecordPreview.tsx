
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MedicalRecord } from '@/types/recordTypes';

interface RecordPreviewProps {
  record: MedicalRecord;
}

const RecordPreview: React.FC<RecordPreviewProps> = ({ record }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="personal">
        <AccordionTrigger>Personal Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {record.name}</p>
            <p><strong>UID:</strong> {record.uid}</p>
            <p><strong>Phone:</strong> {record.phone}</p>
            <p><strong>Address:</strong> {record.address}</p>
            <p><strong>Emergency Contact:</strong> {record.emergencyContact}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="medical">
        <AccordionTrigger>Medical Information</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p><strong>Height:</strong> {record.height}</p>
            <p><strong>Weight:</strong> {record.weight}</p>
            <p><strong>Blood Group:</strong> {record.bloodGroup}</p>
            <p><strong>Medical History:</strong> {record.medicalHistory}</p>
            <p><strong>Notes:</strong> {record.notes}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RecordPreview;
