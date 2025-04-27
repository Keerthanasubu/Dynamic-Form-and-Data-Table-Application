
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";

interface UndoToastProps {
  message: string;
  onUndo: () => void;
}

export const showUndoToast = (message: string, onUndo: () => void) => {
  toast(
    <div className="flex justify-between items-center w-full">
      <span>{message}</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => {
          onUndo();
          toast.dismiss();
        }}
        className="ml-2"
      >
        <Undo className="h-4 w-4 mr-1" />
        Undo
      </Button>
    </div>,
    {
      duration: 5000,
      position: "top-center",
    }
  );
};
