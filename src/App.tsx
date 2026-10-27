import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<'upload' | 'chat'>('upload');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    setCurrentView('chat');
  };

  const handleReset = () => {
    setUploadedImage(null);
    setCurrentView('upload');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 font-sans text-slate-900">
      <AnimatePresence mode="wait">
        {currentView === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="container mx-auto px-4 py-8 h-screen flex flex-col"
          >
            <header className="flex justify-between items-center py-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-800">Socratic</span>
              </div>
            </header>
            <main className="flex-1 flex flex-col justify-center">
              <ImageUpload onImageUpload={handleImageUpload} />
            </main>
            <footer className="py-6 text-center text-slate-400 text-sm">
              Powered by Gemini 3.1 Pro Preview
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="h-screen"
          >
            {uploadedImage && (
              <ChatInterface 
                initialImage={uploadedImage} 
                onReset={handleReset} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
