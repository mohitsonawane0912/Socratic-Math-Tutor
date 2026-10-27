import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import { motion } from 'motion/react';

interface MessageBubbleProps {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export function MessageBubble({ role, text, image }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%] gap-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
          isUser ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div className={cn(
          "flex flex-col gap-2 p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden",
          isUser 
            ? "bg-indigo-600 text-white rounded-tr-none" 
            : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
        )}>
          {image && (
            <img 
              src={image} 
              alt="Uploaded problem" 
              className="rounded-lg max-h-64 object-contain bg-black/5 mb-2" 
            />
          )}
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({children}) => <span className="font-bold text-indigo-600 dark:text-indigo-400">{children}</span>,
                ul: ({children}) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                code: ({children}) => <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">{children}</code>,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
