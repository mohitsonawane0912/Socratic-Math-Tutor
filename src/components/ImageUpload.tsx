import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-800 mb-2 font-display">
          Socratic Math Tutor
        </h1>
        <p className="text-slate-600 text-lg max-w-md mx-auto">
          Upload a photo of your math problem. I'll help you solve it step-by-step, like a patient teacher.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div
          {...getRootProps()}
          className={cn(
            "w-full p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-4 group bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md",
            isDragActive ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50"
          )}
        >
          <input {...getInputProps()} />
          <div className={cn(
            "p-4 rounded-full bg-indigo-100 text-indigo-600 transition-transform duration-300 group-hover:scale-110",
            isDragActive && "scale-110 bg-indigo-200"
          )}>
            {isDragActive ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
          </div>
          <div className="text-center space-y-1">
            <p className="text-lg font-medium text-slate-700">
              {isDragActive ? "Drop the image here" : "Click or drag to upload"}
            </p>
            <p className="text-sm text-slate-500">
              Supports JPG, PNG, WebP
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
