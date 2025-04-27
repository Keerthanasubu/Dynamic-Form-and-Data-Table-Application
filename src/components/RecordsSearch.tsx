
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordsSearchProps {
  onSearch: (query: string) => void;
  className?: string; // Added className prop as optional
}

const RecordsSearch: React.FC<RecordsSearchProps> = ({ onSearch, className }) => {
  return (
    <div className={cn("relative mb-4 w-full md:w-96", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="text"
        placeholder="Search records..."
        className="pl-10"
        onChange={(e) => onSearch(e.target.value)}
        aria-label="Search medical records"
      />
    </div>
  );
};

export default RecordsSearch;
