import React, { useState, useEffect, useRef } from 'react';
import { Send, HelpCircle, ArrowLeft, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { createChat, sendMessage } from '@/services/gemini';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  initialImage: File;
  onReset: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export function ChatInterface({ initialImage, onReset }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize chat and send the first message with the image
  useEffect(() => {
    const initChat = async () => {
      setIsLoading(true);
      try {
        const chat = await createChat();
        setChatInstance(chat);

        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          const mimeType = initialImage.type;
          
          const imagePart = {
            inlineData: {
              data: base64Data,
              mimeType
            }
          };

          // Add user message with image to UI
          const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: "Help me solve this problem step-by-step.",
            image: URL.createObjectURL(initialImage)
          };
          setMessages([userMsg]);

          // Send to Gemini
          try {
            const responseText = await sendMessage(chat, "", imagePart);
            
            const aiMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: responseText
            };
            setMessages(prev => [...prev, aiMsg]);
          } catch (error) {
            console.error("Error sending initial message:", error);
            const errorMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'model',
              text: "I'm sorry, I encountered an error analyzing the image. Please try again."
            };
            setMessages(prev => [...prev, errorMsg]);
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(initialImage);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setIsLoading(false);
      }
    };

    initChat();
  }, [initialImage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() && !isLoading) return;
    
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(chatInstance, text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
       const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error. Please try again."
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhyClick = () => {
    handleSendMessage("Why did we do that? Can you explain the concept?");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 max-w-5xl mx-auto shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            title="Start Over"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-slate-800">Socratic Math Tutor</h1>
            <p className="text-xs text-slate-500">Step-by-step guidance</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            role={msg.role} 
            text={msg.text} 
            image={msg.image} 
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 relative z-20">
        {/* Suggestion Chips */}
        <AnimatePresence>
          {!isLoading && messages.length > 0 && messages[messages.length - 1].role === 'model' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-14 left-0 w-full px-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar"
            >
              <button
                onClick={handleWhyClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200 shadow-sm transition-colors whitespace-nowrap"
              >
                <HelpCircle size={14} />
                Why did we do that?
              </button>
              <button
                onClick={() => handleSendMessage("I'm stuck. Can you give me a hint?")}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200 shadow-sm transition-colors whitespace-nowrap"
              >
                <Lightbulb size={14} />
                I'm stuck
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex-1 bg-slate-100 rounded-2xl border border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question..."
              className="w-full bg-transparent border-none focus:ring-0 p-3 max-h-32 min-h-[48px] resize-none text-slate-800 placeholder:text-slate-400"
              rows={1}
            />
          </div>
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className={cn(
              "p-3 rounded-full flex-shrink-0 transition-all duration-200 shadow-sm",
              inputValue.trim() && !isLoading
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
