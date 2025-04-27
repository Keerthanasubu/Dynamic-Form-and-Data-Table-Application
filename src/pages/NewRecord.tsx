import React from 'react';
import RecordForm from '@/components/RecordForm';
import { AppLayout } from '@/components/AppLayout';
import AnimatedPage from '@/components/AnimatedPage';
import { useRecords } from '@/hooks/useRecords';
import { MedicalRecord } from '@/types/recordTypes';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const NewRecord = () => {
  const { addRecord } = useRecords();
  
  const handleAddRecord = (record: MedicalRecord) => {
    addRecord(record);
  };
  
  const handleExportPDF = () => {
    const element = document.getElementById('record-form');
    if (!element) return;
    
    toast.loading('Generating PDF...');
    
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save('medical-record.pdf');
      
      toast.dismiss();
      toast.success('PDF generated successfully');
    });
  };
  
  return (
    <AppLayout>
      <AnimatedPage>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-6">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              New Medical Record
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Fill in the patient's information to create a new medical record
            </p>
          </div>
          
          <div id="record-form" className="bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-border/40">
            <RecordForm 
              onAddRecord={handleAddRecord} 
              onExportPDF={handleExportPDF} 
            />
          </div>
        </div>
      </AnimatedPage>
    </AppLayout>
  );
};

export default NewRecord;
