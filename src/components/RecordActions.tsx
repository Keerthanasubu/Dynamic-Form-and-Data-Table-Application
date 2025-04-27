
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Printer, Save } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface RecordActionsProps {
  onSave: () => void;
  onReset: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
}

const RecordActions: React.FC<RecordActionsProps> = ({
  onSave,
  onReset,
  onExportPDF,
  onPrint
}) => {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 md:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 no-print"
      role="toolbar"
      aria-label="Record actions"
    >
      <div className="flex gap-3 w-full sm:w-auto">
        <Button 
          onClick={onSave} 
          variant="default"
          aria-label="Save medical record"
          className="flex-1 sm:flex-initial"
        >
          <Save className="w-4 h-4 mr-2" />
          <span>Save Record</span>
        </Button>
        <Button 
          onClick={onReset} 
          variant="outline"
          aria-label="Reset form"
          className="flex-1 sm:flex-initial"
        >
          Reset Form
        </Button>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <ThemeToggle />
        <Button 
          onClick={onExportPDF} 
          variant="outline"
          aria-label="Export record as PDF"
          className="flex-1 sm:flex-initial"
        >
          <FileText className="w-4 h-4 mr-2" />
          <span>Export PDF</span>
        </Button>
        <Button 
          onClick={onPrint} 
          variant="outline"
          aria-label="Print record"
          className="flex-1 sm:flex-initial"
        >
          <Printer className="w-4 h-4 mr-2" />
          <span>Print</span>
        </Button>
      </div>
    </div>
  );
};

export default RecordActions;
