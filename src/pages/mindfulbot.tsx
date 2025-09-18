// src/pages/mindfulbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Send, Mic, Paperclip, Wind, Music, Phone, PenTool, User,
  ChevronLeft, ChevronRight, MessageCircle, Plus, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import chatsLogo from '@/assets/chats.svg';
import mindfulLogo from '@/assets/mindfulbot.svg';
import whitemindfulLogo from '@/assets/whitemindfulbot.svg';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  resourceKey?: string | null;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

/* ---------------- Resources ---------------- */
const RESOURCE_MAP: Record<string, { title: string; desc: string; section?: string }> = {
  anxiety: { title: "Anxiety Disorders", desc: "Excessive worry or fear affecting daily life.", section: "anxiety" },
  depression: { title: "Depression", desc: "Persistent sadness or loss of interest.", section: "depression" },
  panic: { title: "Panic Disorder", desc: "Sudden episodes of intense fear with physical symptoms.", section: "panic" },
  stress: { title: "Stress Management", desc: "Healthy ways to manage stress and pressure.", section: "stress" },
  bipolar: { title: "Bipolar Disorder", desc: "Mood swings between highs and lows.", section: "bipolar" },
  ptsd: { title: "PTSD & Trauma", desc: "Support for trauma and its effects.", section: "ptsd" },
  breathing: { title: "Breathing Exercises", desc: "Guided exercises to calm and relax your body.", section: "breathing" },
  music: { title: "Calming Music & Sounds", desc: "Playlists and sounds to ease stress.", section: "music" },
  crisis: { title: "Crisis Support Hotlines", desc: "24/7 hotlines to get immediate support.", section: "crisis" },
  resources: { title: "Mental Health Resources Hub", desc: "Explore all our mental health resources.", section: "resources" },
};


/* ---------------- Safeguards ---------------- */
const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al|ally)?\b/i,
  /\bkill+\b/i,                  // catches "kill", "killing", and "kil" (typo, short form)
  /\bkil+\b/i,                  // explicitly catch "kil" common misspelling/short
  /\bkms\b/i,
  /\b(end|ending)\s+(my|your|his|her|their)?\s*life\b/i,
  /\bself[-\s]?(harm|hurt)(ing)?\b/i,
  /\bcut(ting)?\b/i,
  /\bhurt( myself| someone| him| her| them)?\b/i,
  /\boverdose(ing)?\b/i,
  /\bod\b/i,
  /\bjump( off| from)?\b/i,
  /\bhang( myself)?\b/i,
  /\bslit\b/i,                   // catch "slit" on its own
  /\bslit( my| your)? (wrists|throat)\b/i,
  /\b(shoot|gun|knife|stab|murder|attack|bomb|explode)\b/i,
  /\bdeath\b/i,
  /\bdie(ing)?\b/i,
  /\bdying\b/i,
  /\bdanger\b/i,
  /\bkillme\b/i,
  /\bcrisis\b/i,
];


const DISCLAIMER =
  "This conversation is for support and guidance only, not a medical diagnosis. Please consider discussing these feelings with a qualified professional.";

/* ---------------- Utilities ---------------- */
function sanitizeBotText(text: string): string {
  let sanitized = text;
  for (const pattern of CRISIS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[sensitive content]');
  }
  return sanitized;
}

function isCrisisMessage(userMessage: string): boolean {
  return CRISIS_PATTERNS.some((pattern) => pattern.test(userMessage.toLowerCase()));
}


/* Deterministic keyword → resource mapping */
function matchResource(userMessage: string): string | null {
  const msg = userMessage.toLowerCase();
  if (/\banxious|worry|panic\b/.test(msg)) return "anxiety";
  if (/\bdepress|sad|hopeless\b/.test(msg)) return "depression";
  if (/\bstress|overwhelm|burnout\b/.test(msg)) return "stress";
  if (/\bmusic|sound|playlist|song\b/.test(msg)) return "music";
  if (/\bbreath|breathing\b/.test(msg)) return "breathing";
  if (/\bptsd|flashbacks\b/.test(msg)) return "ptsd";
  if (/\bpanic(king| attack| attacks)\b/.test(msg)) return "panic";
  if (/\bbipolar|multiple+()\b/.test(msg)) return "bipolar";
  if (isCrisisMessage(msg)) return "crisis";
  return null;
}

/* ---------------- Navigation Helper ---------------- */
function goToResourceSection(
  navigate: ReturnType<typeof useNavigate>,
  resourceKey: string
) {
  const resource = RESOURCE_MAP[resourceKey];

  if (!resource) return;

  // If it's a condition → navigate to its page
  if (
    ["anxiety", "depression", "panic", "stress", "bipolar", "ptsd"].includes(resourceKey)
  ) {
    navigate(`/${resourceKey}`);
    return;
  }

  // Else → go to resources page + scroll to section
  navigate("/resources");
  if (resource.section) {
    setTimeout(() => {
      const el = document.getElementById(resource.section!);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }
}


/* ---------------- Main Component ---------------- */
const STORAGE_KEY = 'mindfulbot_chat_sessions_v2';

const MindfulBot: React.FC = () => {
  const navigate = useNavigate(); 
  const [currentSession, setCurrentSession] = useState<string>('default');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatSession[];
        return parsed.map((s) => ({
          ...s,
          timestamp: new Date(s.timestamp),
          messages: s.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
        }));
      }
    } catch {}
    return [
      {
        id: 'default',
        title: 'New Chat',
        timestamp: new Date(),
        messages: [
          {
            id: '1',
            content:
              "Hi, how are you feeling today? I'm here to help you with mindfulness, breathing exercises, or just to listen. What would you like to talk about?",
            sender: 'bot',
            timestamp: new Date(),
          },
        ],
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // auto-save
  useEffect(() => {
    const serializable = chatSessions.map((s) => ({
      ...s,
      timestamp: s.timestamp.toISOString(),
      messages: s.messages.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      })),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  }, [chatSessions]);

  const currentMessages = chatSessions.find((s) => s.id === currentSession)?.messages || [];

  const quickActions = [
    { label: 'Breathing Exercises', icon: Wind, action: () => handleSendMessage('I need help with breathing exercises') },
    { label: 'Calming Music', icon: Music, action: () => handleSendMessage('Please suggest some calming music or sounds') },
    { label: 'Crisis Support', icon: Phone, action: () => handleCrisisQuickAction() },
    { label: 'Anxiety Relief', icon: PenTool, action: () => handleSendMessage("I'm feeling anxious") },
  ];

  useEffect(() => {
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  }, [currentMessages]);

  const updateCurrentSession = (messages: Message[]) => {
    setChatSessions((prev) => prev.map((s) => s.id === currentSession ? { ...s, messages, timestamp: new Date() } : s));
  };

  const createNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      timestamp: new Date(),
      messages: [
        {
          id: '1',
          content: "Hi, how are you feeling today? I'm here to help with mindfulness, breathing exercises, or just to listen.",
          sender: 'bot',
          timestamp: new Date(),
          resourceKey: null,
        },
      ],
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSession(newSessionId);
  };

  const renameChat = (sessionId: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, title: newTitle } : s
      )
    );
  };

  const deleteChat = (sessionId: string) => {
    if (chatSessions.length === 1) return;
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSession === sessionId) {
      const remaining = chatSessions.filter((s) => s.id !== sessionId);
      setCurrentSession(remaining[0]?.id || 'default');
    }
  };

  /* ---------------- Chat API + Safety ---------------- */
  const sendToChatAPI = async (message: string, history: Message[]) => {
    // 1. Crisis override
    if (isCrisisMessage(message)) {
      return {
        text:
          "I'm really concerned by what you've shared. You're not alone. Please reach out immediately to the support hotlines here.\n\n",
        resourceKey: "crisis",
      };
    }

    // 1b. "Help" override → show guidance message
    if (/^\s*help\s*$/i.test(message)) {
      return {
        text: `Here are a few things I can do:
  - Share breathing exercises to calm your body
  - Suggest calming music to ease your mind
  - Provide resources for anxiety, depression, or stress
  - Show support hotlines if you're in immediate distress\n\n`,
        resourceKey: "resources",
      };
    }

    // 2. Deterministic resource mapping
    let resourceKey = matchResource(message) || "resources";

    try {
      // 3. System prompt
      const systemMessage = {
        role: "system",
        content: `You are MindfulBot, a safe, compassionate mental health support companion.

  STRICT RULES:
  - Always warm, calm, soothing, and non-judgmental but professional.
  - NEVER give diagnosis, medical advice, or treatment.
  - NEVER echo or agree with harmful, violent, or unsafe statements.
  - Responses should be short (2–3 sentences) + empathetic.
  - Try phrasing it differently
  - NEVER add follow-up questions
  - NEVER provide links or references
  - End with "Here are some resources you may find helpful."`,
      };

      // 4. Format conversation history
      let conversationHistory = history.slice(-8).map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      // ✅ Ensure alternation: never end with assistant before appending user
      if (conversationHistory.length > 0) {
        const last = conversationHistory[conversationHistory.length - 1];
        if (last.role === "assistant") {
          conversationHistory = conversationHistory.slice(0, -1);
        }
      }

      const messages = [
        systemMessage,
        ...conversationHistory,
        { role: "user", content: message },
      ];

      // 5. Call SEA-LION
      const response = await fetch("https://api.sea-lion.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk-TSbEBjqQN9HKMcutANxL5A`,
        },
        body: JSON.stringify({
          model: "aisingapore/Gemma-SEA-LION-v4-27B-IT",
          messages,
          max_tokens: 200,
          temperature: 0.7, // more varied responses
          top_p: 0.9,
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();

      let text = data?.choices?.[0]?.message?.content || "I'm here with you.";

      // Clean up: remove model-added disclaimers (keep only our own)
      text = text.replace(/\*\*Disclaimer:[\s\S]*/gi, "").trim();

      // Deduplication vs last bot message
      const lastBot = history.filter((m) => m.sender === "bot").slice(-1)[0];
      if (lastBot && text.trim() === lastBot.content.trim()) {
        text =
          "I hear you. That sounds difficult. Remember, you’re not alone — take a deep breath, and know support is available.\n\n";
      }

      return { text: sanitizeBotText(text), resourceKey };
    } catch (err) {
      console.error("sendToChatAPI failed:", err);
      // 7. Fallback deterministic
      return {
        text: `I hear you. Thank you for sharing that. You may find our ${RESOURCE_MAP[resourceKey].title} section helpful.\n\n`,
        resourceKey,
      };
    }
  };

  /* ---------------- Send / Receive ---------------- */
  const handleSendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), content: message, sender: 'user', timestamp: new Date() };
    const updated = [...currentMessages, userMessage];
    updateCurrentSession(updated);
    setInputMessage('');
    setIsLoading(true);

    // Auto-generate session title from first user message
    if (
      currentMessages.length === 0 || 
      (currentMessages.length === 1 && currentMessages[0].sender === 'bot')
    ) {
      const shortTitle = message.length > 20 ? message.slice(0, 20) + "..." : message;
      setChatSessions((prev) =>
        prev.map((s) =>
          s.id === currentSession ? { ...s, title: shortTitle } : s
        )
      );
    }

    try {
      const botReply = await sendToChatAPI(message, currentMessages);
      const safeText = sanitizeBotText(botReply.text || '');

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: safeText,
        sender: 'bot',
        timestamp: new Date(),
        resourceKey: botReply.resourceKey ?? 'resources',
      };

      updateCurrentSession([...updated, botMessage]);
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ---------------- "Show me another resource" ---------------- */
  const RESOURCE_KEYS = Object.keys(RESOURCE_MAP);
  function showAnotherResource(currentKey: string | null) {
    const idx = currentKey ? RESOURCE_KEYS.indexOf(currentKey) : -1;
    let next = RESOURCE_KEYS[(idx + 1) % RESOURCE_KEYS.length];
    if (next === currentKey) next = RESOURCE_KEYS[(idx + 2) % RESOURCE_KEYS.length];

    const botText = `Here’s another resource that might help: ${RESOURCE_MAP[next].title}.\n\n`;
    const botMessage: Message = {
      id: (Date.now() + 2).toString(),
      content: sanitizeBotText(botText),
      sender: 'bot',
      timestamp: new Date(),
      resourceKey: next,
    };
    updateCurrentSession([...currentMessages, botMessage]);
  }

  const handleCrisisQuickAction = () => {
    const timestamp = new Date();

    // user’s message (for chat history)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "I need crisis support",
      sender: "user",
      timestamp,
    };

    // bot’s crisis override reply
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "I'm really concerned by what you've shared. You're not alone. Please reach out immediately to the support hotlines here.\n\n",
      sender: "bot",
      timestamp: new Date(),
      resourceKey: "crisis",
    };

    updateCurrentSession([...currentMessages, userMessage, botMessage]);
  };


  /* ---------------- Render UI (unchanged) ---------------- */
  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-r border-white/20 dark:border-slate-700/50 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/20 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
              <img src={chatsLogo} alt="Chats" className="w-12 h-12 object-contain" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {sidebarOpen && (
            <>
              <div className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">Chats</div>
              <Button
                onClick={createNewChat}
                className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" /> New Chat
              </Button>
            </>
          )}
        </div>

        {/* Chat Sessions */}
        {sidebarOpen && (
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <div key={session.id} className="group relative">
                  <Button
                    variant={currentSession === session.id ? 'secondary' : 'ghost'}
                    className={`w-full justify-start text-left p-3 h-auto ${
                      currentSession === session.id
                        ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                    onClick={() => setCurrentSession(session.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {/* Editable title */}
                        <input
                          type="text"
                          value={session.title}
                          onChange={(e) => renameChat(session.id, e.target.value)}
                          className="bg-transparent font-medium text-sm truncate focus:outline-none w-full"
                        />
                        <div className="text-xs text-muted-foreground">
                          {session.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Button>

                  {chatSessions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); deleteChat(session.id); }}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex min-h-0 flex-col">
        {/* Chat Header */}
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-white/20 dark:border-slate-700/50 p-4">
          <div className="flex items-center gap-3">
            <img src={mindfulLogo} alt="Mindful Bot" className="w-11 h-11 object-contain" />
            <div>
              <h2 className="font-semibold text-foreground">Mindful Bot</h2>
              <p className="text-sm text-muted-foreground">Always here to help you find peace</p>
            </div>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="p-4 border-b border-white/20 dark:border-slate-700/50">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-200 hover:from-orange-200 hover:to-pink-200 dark:hover:from-orange-800/50 dark:hover:to-pink-800/50"
              >
                <action.icon className="w-4 h-4 mr-2" /> {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {currentMessages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[80%] ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Avatar */}
                  {m.sender === 'user' ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-purple-900 to-purple-500 flex items-center justify-center shrink-0">
                      <img src={whitemindfulLogo} alt="Mindful Bot" className="w-6 h-6 object-contain" />
                    </div>
                  )}

                  {/* Bubble + resource */}
                  <div className="flex-1">
                    <Card
                      className={`p-4 ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-none'
                          : 'bg-white/70 dark:bg-slate-800/70'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                      {/* Disclaimer only for bot messages */}
                      {m.sender === "bot" && (
                        <p className="mt-2 text-xs font-bold text-red-600">
                          {DISCLAIMER}
                        </p>
                      )}
                    </Card>

                    {m.resourceKey && RESOURCE_MAP[m.resourceKey] && (
                      <Card className="mt-2 p-3 border border-blue-300 bg-blue-50 dark:bg-slate-800">
                        <span className="text-xs font-semibold text-blue-600">Resource Suggestion</span>
                        <h4 className="font-semibold">{RESOURCE_MAP[m.resourceKey].title}</h4>
                        <p className="text-sm mb-2">{RESOURCE_MAP[m.resourceKey].desc}</p>


                        <Button
                          className="bg-blue-600 text-white"
                          onClick={() => goToResourceSection(navigate, RESOURCE_MAP[m.resourceKey].section)}
                        >
                          Go to {RESOURCE_MAP[m.resourceKey].title}
                        </Button>

                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => showAnotherResource(m.resourceKey || null)}
                          >
                            Show me another resource
                          </Button>
                        </div>
                      </Card>
                    )}

                    <div className={`text-xs mt-2 ${m.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="sticky bottom-0 z-10 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-t border-white/20 dark:border-slate-700/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="pr-20 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm border-gray/30 dark:border-slate-600/50 text-base py-3"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-white/50 dark:hover:bg-slate-600/50">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-white/50 dark:hover:bg-slate-600/50">
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindfulBot;
