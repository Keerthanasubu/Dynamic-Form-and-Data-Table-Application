
import React from 'react';
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Label } from "./label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Check, AlertCircle } from "lucide-react";

interface InputWrapperProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  tooltip?: string;
  isValid?: boolean;
}

export const InputWrapper = React.forwardRef<HTMLInputElement, InputWrapperProps>(
  ({ label, error, icon, tooltip, isValid, className, ...props }, ref) => {
    return (
      <div className="relative space-y-2">
        <Label 
          htmlFor={props.id}
          className="text-sm font-medium transition-all duration-200"
        >
          {label}
        </Label>
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <Input
            ref={ref}
            className={cn(
              "transition-all duration-200",
              icon && "pl-10",
              isValid !== undefined && "pr-10",
              error && "border-destructive focus:border-destructive",
              className
            )}
            {...props}
          />
          
          {isValid !== undefined && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isValid ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute right-0 top-0">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
);

InputWrapper.displayName = "InputWrapper";
