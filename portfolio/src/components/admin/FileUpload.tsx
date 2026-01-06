'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
}

export function FileUpload({ value, onChange, onRemove }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      onChange(data.secure_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {value ? (
        <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden border">
           <div className="absolute top-2 right-2 z-10">
             <Button
               type="button"
               onClick={onRemove}
               variant="destructive"
               size="icon"
             >
                <X className="h-4 w-4" />
             </Button>
           </div>
           <img
             src={value}
             alt="Upload"
             className="object-cover w-full h-full"
           />
        </div>
      ) : (
          <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                 {isUploading ? (
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                 ) : (
                     <Upload className="h-4 w-4 mr-2" />
                 )}
                 Upload Image
              </Button>
              <input
                title="File Upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
          </div>
      )}
    </div>
  );
}
