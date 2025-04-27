
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MedicalRecord, EditableField } from '@/types/recordTypes';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditableCellProps {
  record: MedicalRecord;
  field: EditableField;
  value: string;
  onSave: (id: string, field: EditableField, value: string) => void;
  multiline?: boolean;
}

const getTooltipContent = (field: EditableField) => {
  switch (field) {
    case 'uid':
      return '11-digit Unique Identifier Number';
    case 'bloodGroup':
      return 'ABO and Rh blood type';
    case 'medicalHistory':
      return 'Past medical conditions, surgeries, and allergies';
    default:
      return null;
  }
};

const EditableCell: React.FC<EditableCellProps> = ({ 
  record, 
  field, 
  value, 
  onSave,
  multiline = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const tooltipContent = getTooltipContent(field);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (editValue !== value) {
      onSave(record.id, field, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const content = (
    <div 
      className={cn("px-2 py-1 editable-cell cursor-pointer min-h-[24px]", !value && "text-gray-400")} 
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
    >
      {value || "Click to edit"}
    </div>
  );

  if (isEditing) {
    return multiline ? (
      <Textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[80px]"
      />
    ) : (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full"
      />
    );
  }

  return tooltipContent ? (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    content
  );
};

export default EditableCell;
