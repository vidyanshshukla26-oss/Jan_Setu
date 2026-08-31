import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  HelpCircle,
  Lightbulb,
  Award,
  Compass,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { UserRole } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface CivicAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  activeChallengeTitle?: string;
}

const INITIAL_PROMPT_PILLS = [
  'How do I format an IoT sensor proposal for the Jal Jeevan grant?',
  'Find critical water & agriculture challenges needing TRL 6 prototypes',
  'What are the evaluation criteria for SIH26043 societal pilot funding?',
  'How can CSR foundations sponsor high-impact fluoride remediation?',
];

export const CivicAssistantDrawer: React.FC<CivicAssistantDrawerProps> = ({
  isOpen,
  onClose,
  userRole,
  activeChallengeTitle,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Namaste! I am the **JanSetu AI Civic Copilot** powered by Gemini 3.7 Flash. 
      
I can assist you with:
- Finding impactful societal challenges matching your STEM skills
- Drafting technical grant proposals & milestone escrow budgets
- Translating citizen complaints in 12+ Indian languages into engineering briefs
- Guiding CSR foundations on Section 135 impact allocation.

How may I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build conversation history format for API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const res = await fetch('/api/ai/civic-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          conversationHistory: history,
          userRole,
          currentChallengeContext: activeChallengeTitle,
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.reply) {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: data.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('No reply returned');
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'I apologize, but I encountered a momentary connection hiccup. Please try asking again!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        id="civic-assistant-drawer"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-emerald-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-snug">JanSetu AI Civic Copilot</h3>
              <p className="text-[11px] text-emerald-300 font-medium">
                Gemini 3.7 Flash • Grounded in SIH26043 Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: 'welcome',
                    sender: 'assistant',
                    text: 'Chat history reset. How can I assist with societal challenges or grant proposals?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Context Bar if present */}
        {activeChallengeTitle && (
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2 text-xs text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">
              <strong>Inspecting:</strong> {activeChallengeTitle}
            </span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-1.5 ${
                    msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>JanSetu AI is formulating technical recommendations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Pills */}
        <div className="p-3 bg-white border-t border-slate-100 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {INITIAL_PROMPT_PILLS.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill)}
                disabled={isLoading}
                className="text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-transparent rounded-lg px-2.5 py-1 text-left transition-all"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about grants, technical methodologies, SDGs..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50 transition-colors shadow-xs"
              id="send-civic-chat-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
