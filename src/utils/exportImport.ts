
import { MedicalRecord } from "@/types/recordTypes";
import { toast } from "sonner";

// Export functions
export const exportToJSON = (records: MedicalRecord[]): void => {
  const jsonString = JSON.stringify(records, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `patient_records_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.success("Records exported as JSON");
};

export const exportToCSV = (records: MedicalRecord[]): void => {
  // Create CSV header
  const headers = Object.keys(records[0]).join(",");
  
  // Create CSV rows
  const rows = records.map(record => {
    return Object.values(record)
      .map(value => {
        // Wrap values in quotes and escape quotes inside values
        if (typeof value === "string") {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",");
  });
  
  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `patient_records_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  toast.success("Records exported as CSV");
};

// Import functions
export const importFromJSON = (file: File): Promise<MedicalRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event?.target?.result as string);
        
        // Simple validation - check if it's an array with expected properties
        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error("Invalid JSON format: no records found");
        }
        
        // Check if the first record has required fields
        const requiredFields = ["name", "uid", "bloodGroup"];
        const firstRecord = jsonData[0];
        for (const field of requiredFields) {
          if (!(field in firstRecord)) {
            throw new Error(`Invalid record format: missing ${field} field`);
          }
        }
        
        // Add timestamp if missing
        const records = jsonData.map((record: MedicalRecord) => ({
          ...record,
          createdAt: record.createdAt || new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }));
        
        toast.success(`Successfully imported ${records.length} records`);
        resolve(records);
      } catch (error) {
        toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the file");
      reject(new Error("File reading failed"));
    };
    
    reader.readAsText(file);
  });
};

export const importFromCSV = (file: File): Promise<MedicalRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event?.target?.result as string;
        const lines = csvData.split("\n");
        
        if (lines.length < 2) {
          throw new Error("CSV file is empty or invalid");
        }
        
        // Parse header to get field names
        const headers = lines[0].split(",").map(header => header.trim());
        
        // Parse rows to get record data
        const records = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = parseCSVLine(line);
          if (values.length !== headers.length) {
            throw new Error("CSV format error: mismatch between headers and values");
          }
          
          const record: Record<string, string> = {};
          headers.forEach((header, index) => {
            record[header] = values[index];
          });
          
          return {
            ...record,
            createdAt: record.createdAt || new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          } as unknown as MedicalRecord;
        });
        
        toast.success(`Successfully imported ${records.length} records`);
        resolve(records);
      } catch (error) {
        toast.error(`CSV import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the CSV file");
      reject(new Error("File reading failed"));
    };
    
    reader.readAsText(file);
  });
};

// Helper function to parse CSV lines properly (handles quoted values with commas inside)
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = "";
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Check if it's an escaped quote
      if (i + 1 < line.length && line[i + 1] === '"') {
        currentValue += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of value
      values.push(currentValue);
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue);
  
  return values;
}
