import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { DarkModeSwitch } from '@/components/DarkModeSwitch';
import Login from './Login';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from "@/components/ui/toaster";
import { Building, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SecurityCheck: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const shapes = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 400 + 300,
    x: Math.random() * 120 - 60,
    y: Math.random() * 120 - 60,
    delay: i * 0.3,
  }));

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-background">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 10 + shape.id,
            repeat: Infinity,
            repeatType: "reverse",
            delay: shape.delay,
          }}
        />
      ))}
      
      <div className="absolute top-4 right-4 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DarkModeSwitch />
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle dark mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        <motion.div 
          className="w-full lg:w-5/12 flex flex-col items-start space-y-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Building className="h-16 w-16 text-primary" />
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Medical Records Manager
            </h1>
            <p className="text-left text-muted-foreground text-lg">
              Securely manage and access your medical records with our HIPAA-compliant platform.
              Your health data is protected with industry-leading encryption.
            </p>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Info className="h-4 w-4" />
                Learn about data protection
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Your medical records are encrypted and stored securely following HIPAA guidelines. Only authorized personnel can access your information.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>

        <AnimatePresence>
          {isVisible && (
            <motion.div 
              className="w-full lg:w-5/12"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1 
              }}
            >
              <Login />
              
              <motion.p 
                className="mt-6 text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                © {new Date().getFullYear()} Medical Records Manager
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <Toaster />
    </div>
  );
};

export default SecurityCheck;
