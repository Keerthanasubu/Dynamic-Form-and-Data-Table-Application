import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, currentImage }) => {
  const [preview, setPreview] = useState<string>(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, JPG, or PNG file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageUpload(result);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: false
  });

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer rounded-lg border-2 border-dashed p-6
          transition-colors duration-200 hover:border-primary/50
          flex flex-col items-center justify-center min-h-[200px]
          ${isDragActive ? 'border-primary bg-accent' : 'border-border bg-transparent'}
        `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-w-[200px] h-auto rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <p className="text-white text-sm">Click or drag to replace</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Drag and drop or click to upload</p>
            <p className="text-xs text-muted-foreground">JPEG, JPG, or PNG (max. 800x400px)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
