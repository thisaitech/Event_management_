
import React, { useState, useRef, useEffect } from 'react';
import { processChatMessage } from '@/services/aiChatService';
import { getEvents, Event } from '@/utils/storage';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ 
        role: 'assistant', 
        content: "Hello! 👋 I'm your AI Event Concierge. I can help you find the perfect events. What are you looking for?" 
      }]);
    }
  }, [isOpen]);

  // Fetch events from API when component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        // Convert to Event format
        const convertedEvents: Event[] = fetchedEvents.map(e => ({
          id: e.id,
          title: e.title,
          description: e.description || '',
          date: e.date,
          location: e.location,
          category: e.category as any,
          price: e.price || 0,
          imageUrl: e.imageUrl || 'https://picsum.photos/800/600',
          organizer: e.organizer
        }));
        setEvents(convertedEvents);
      } catch (error) {
        console.error('Error loading events for AI assistant:', error);
      }
    };
    loadEvents();
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: prompt.trim() };
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt.trim();
    setPrompt('');
    setIsLoading(true);

    try {
      // Process chat message with enhanced AI service
      const result = await processChatMessage(currentPrompt, events);
      
      setMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: result.response 
      }]);
    } catch (error) {
      console.error('Error processing chat message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant' as const, 
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuickAction = async (action: string) => {
    if (isLoading) return;
    
    const quickActions: { [key: string]: string } = {
      'events in chennai': 'Show me events in Chennai',
      'upcoming events': 'Find upcoming events',
      'affordable events': 'Show affordable events',
      'wedding events': 'Find wedding events'
    };
    
    const query = quickActions[action];
    if (query) {
      const userMessage = { role: 'user' as const, content: query };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      try {
        const result = await processChatMessage(query, events);
        setMessages(prev => [...prev, { 
          role: 'assistant' as const, 
          content: result.response 
        }]);
      } catch (error) {
        console.error('Error processing quick action:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant' as const, 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-[95vw] sm:w-[90vw] md:w-[420px] h-[600px] md:h-[550px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">AI Event Concierge</h3>
              <p className="text-xs text-indigo-100">Ask for personal recommendations</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-indigo-500 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 md:p-4 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-none'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    {msg.content.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line.match(/\*\*(.*?)\*\*/g) 
                          ? line.split(/(\*\*.*?\*\*)/g).map((part, pIdx) => 
                              part.startsWith('**') && part.endsWith('**') 
                                ? <strong key={pIdx}>{part.replace(/\*\*/g, '')}</strong>
                                : <span key={pIdx}>{part}</span>
                            )
                          : line
                        }
                        {idx < msg.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
            {/* Quick action buttons */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleQuickAction('events in chennai')}
                  className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-all"
                >
                  📍 Chennai Events
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('upcoming events')}
                  className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-all"
                >
                  📅 Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction('affordable events')}
                  className="px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-all"
                >
                  💰 Affordable
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Ask me anything about events..."
                className="flex-1 bg-gray-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-600 transition-all"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all active:scale-95 group relative"
        >
          <div className="absolute -top-2 -right-1 bg-pink-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">AI</div>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
