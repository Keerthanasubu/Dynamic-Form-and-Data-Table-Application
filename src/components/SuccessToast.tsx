
import { Check } from "lucide-react";

interface SuccessToastProps {
  message: string;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ message }) => {
  return (
    <div className="flex items-center gap-2 animate-success-fade">
      <Check className="h-5 w-5 text-green-500" />
      <span>{message}</span>
    </div>
  );
};
