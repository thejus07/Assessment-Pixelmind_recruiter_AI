"use client";

import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '@/services/geminiService';
import { ChatMessage } from '@/types';
import { useToast } from '@/context/ToastContext';
import { 
  Sparkles, Send, Loader2, RefreshCw, 
  HelpCircle, User2, Bot
} from 'lucide-react';

export const CoachPanel: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message from AI Coach
  useEffect(() => {
    const stored = localStorage.getItem('recruitai_coach_chat');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const initial: ChatMessage = {
        id: 'welcome',
        sender: 'ai',
        text: "Hi! I am your PixelMind Career Coach. I can help you review credentials, prepare Cloud/Fullstack interviews, select technical certifications, or suggest standout portfolio projects. Ask me anything!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initial]);
      localStorage.setItem('recruitai_coach_chat', JSON.stringify([initial]));
    }
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    localStorage.setItem('recruitai_coach_chat', JSON.stringify(updated));
    setInputText('');
    setLoading(true);

    try {
      // API context takes last 6 messages to stay lightweight
      const contextHistory = updated.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const replyText = await GeminiService.chatWithCoach(text, contextHistory);
      
      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const final = [...updated, aiMsg];
      setMessages(final);
      localStorage.setItem('recruitai_coach_chat', JSON.stringify(final));
    } catch (err) {
      toast("Chat Error", "Could not send message to Gemini coach.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const initial: ChatMessage = {
      id: 'welcome',
      sender: 'ai',
      text: "Chat history cleared. Let me know what career topics you'd like to dive into next!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initial]);
    localStorage.setItem('recruitai_coach_chat', JSON.stringify([initial]));
    toast("Chat Cleared", "Local career coach history deleted.", "info");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px] max-w-4xl mx-auto rounded-2xl glass-panel bg-card/65 border border-border shadow relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI Career Coach</h3>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Online & Ready
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          Clear Chat
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div className={`p-1.5 rounded-lg shrink-0 ${
              m.sender === 'user' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10'
            }`}>
              {m.sender === 'user' ? <User2 className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div>
              <div className={`p-3 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'border-indigo-500 bg-indigo-600/15 text-foreground'
                  : 'border-border/60 bg-background/55 text-muted-foreground'
              }`}>
                {m.text}
              </div>
              <span className="block text-[8px] text-muted-foreground mt-1 px-1">
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3 max-w-[85%]">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-xl border border-border bg-background/30 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
              <span className="text-[10px] text-muted-foreground">Drafting career roadmap...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts footer */}
      <div className="px-4 py-2 border-t border-border bg-background/25 flex flex-wrap gap-2">
        {[
          { text: "Optimize my resume?", query: "How do I improve my resume?" },
          { text: "Prepare AWS Developers?", query: "How do I prepare for AWS Developer interviews?" },
          { text: "Recommended Certifications?", query: "What technical certifications do you recommend?" },
          { text: "Standout Projects?", query: "Recommend some projects to make my portfolio stand out." }
        ].map((pill, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => handleSend(pill.query)}
            className="px-2.5 py-1 text-[9px] font-bold rounded-full border border-indigo-500/10 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10 cursor-pointer disabled:opacity-50"
          >
            {pill.text}
          </button>
        ))}
      </div>

      {/* Send Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="p-3 border-t border-border bg-background/40 flex items-center gap-2"
      >
        <input
          type="text"
          disabled={loading}
          placeholder="Ask about resume updates, AWS prep, coding questions..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer disabled:opacity-50 transition-colors shadow"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
export default CoachPanel;
