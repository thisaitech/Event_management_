/**
 * Enhanced AI Chat Service with intelligent response functions
 * Provides conversational AI capabilities for event recommendations
 */
import { formatPriceInRupees } from '../utils/currency';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  price: number;
  imageUrl?: string;
}

interface ChatContext {
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  lastQuery?: string;
  suggestedEvents?: Event[];
}

/**
 * Detects the intent of user's message
 */
const detectIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i.test(lowerMessage)) {
    return 'greeting';
  }
  
  // Questions about the service
  if (/\b(what|how|who|when|where|why|can you|tell me|explain|help)\b/i.test(lowerMessage)) {
    return 'question';
  }
  
  // Event search queries
  if (/\b(show|find|search|look|event|festival|concert|wedding|corporate|conference|party|gala|meeting)\b/i.test(lowerMessage)) {
    return 'search';
  }
  
  // Booking related
  if (/\b(book|booking|reserve|ticket|buy|purchase|register)\b/i.test(lowerMessage)) {
    return 'booking';
  }
  
  // Location specific
  if (/\b(in|at|near|around|location|place|city|chennai|coimbatore|madurai|tamil nadu)\b/i.test(lowerMessage)) {
    return 'location';
  }
  
  // Price related
  if (/\b(price|cost|expensive|cheap|affordable|budget|free|paid)\b/i.test(lowerMessage)) {
    return 'price';
  }
  
  // Date/Time related
  if (/\b(when|date|time|today|tomorrow|week|month|year|soon|upcoming)\b/i.test(lowerMessage)) {
    return 'date';
  }
  
  return 'search'; // Default to search
};

/**
 * Generates greeting response
 */
const generateGreeting = (): string => {
  const greetings = [
    "Hello! 👋 I'm your AI Event Concierge. I can help you find the perfect events. What are you looking for?",
    "Hi there! I'm here to help you discover amazing events. What type of event interests you?",
    "Welcome! I can help you find events, answer questions, and make recommendations. How can I assist you today?",
    "Greetings! Ready to explore some fantastic events? Just tell me what you're interested in!"
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};

/**
 * Generates response for general questions
 */
const generateQuestionResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (/\b(what can you|what do you|help|assist)\b/i.test(message)) {
    return "I can help you:\n\n🔍 Find events based on your preferences\n📍 Search by location\n💰 Filter by price range\n📅 Find events by date\n💡 Get personalized recommendations\n\nJust tell me what you're looking for!";
  }
  
  if (/\b(how|process|work|system)\b/i.test(lowerMessage)) {
    return "Here's how I work:\n\n1️⃣ You describe what you're looking for\n2️⃣ I search through available events\n3️⃣ I provide personalized recommendations\n4️⃣ You can book directly through the platform\n\nWhat kind of event are you interested in?";
  }
  
  if (/\b(who|about|tell me about)\b/i.test(lowerMessage)) {
    return "I'm an AI-powered event concierge designed to help you discover and book premium events. I use intelligent matching to find events that match your preferences. What would you like to know more about?";
  }
  
  return "I'm here to help you find the perfect events! Could you be more specific about what you're looking for? For example, you could ask about events in a specific city, type of event, or date range.";
};

/**
 * Advanced event matching with multiple criteria
 */
const matchEvents = (message: string, events: Event[]): Event[] => {
  if (!events || events.length === 0) return [];
  
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(/\s+/).filter(w => w.length > 2);
  
  // Score events based on relevance
  const scoredEvents = events.map(event => {
    let score = 0;
    const eventText = `${event.title} ${event.description} ${event.category} ${event.location}`.toLowerCase();
    
    // Exact matches get higher scores
    words.forEach(word => {
      if (event.title.toLowerCase().includes(word)) score += 5;
      if (event.category.toLowerCase().includes(word)) score += 4;
      if (event.description.toLowerCase().includes(word)) score += 3;
      if (event.location.toLowerCase().includes(word)) score += 2;
    });
    
    // Category matching
    const categoryKeywords: { [key: string]: string[] } = {
      wedding: ['wedding', 'marriage', 'bridal', 'reception'],
      corporate: ['corporate', 'business', 'conference', 'meeting', 'seminar'],
      festival: ['festival', 'celebration', 'carnival', 'fair'],
      concert: ['concert', 'music', 'live', 'performance', 'show'],
      conference: ['conference', 'summit', 'convention', 'workshop'],
      gala: ['gala', 'dinner', 'charity', 'fundraiser']
    };
    
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (event.category.toLowerCase().includes(category)) score += 3;
      }
    });
    
    // Location matching
    const tamilNaduCities = ['chennai', 'coimbatore', 'madurai', 'tiruchirappalli', 'salem', 
                            'tirunelveli', 'erode', 'vellore', 'thoothukudi', 'dindigul'];
    tamilNaduCities.forEach(city => {
      if (lowerMessage.includes(city) && event.location.toLowerCase().includes(city)) {
        score += 4;
      }
    });
    
    // Price mentions
    if (/\b(free|no cost|complimentary)\b/i.test(message)) {
      if (event.price === 0) score += 2;
    }
    if (/\b(budget|affordable|cheap|low cost)\b/i.test(message)) {
      if (event.price < 1000) score += 2;
    }
    
    return { event, score };
  });
  
  // Sort by score and return top matches
  return scoredEvents
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.event);
};

/**
 * Formats event recommendations as a conversational response
 */
const formatEventResponse = (events: Event[], query: string): string => {
  if (events.length === 0) {
    return `I couldn't find any events matching "${query}". However, I'd be happy to help you browse our available events. Could you try a different search term or tell me more about what you're looking for?`;
  }
  
  let response = `Great! I found ${events.length} event${events.length > 1 ? 's' : ''} that might interest you:\n\n`;
  
  events.forEach((event, index) => {
    const date = new Date(event.date).toLocaleDateString('en-IN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    
    response += `${index + 1}. **${event.title}**\n`;
    response += `   📍 ${event.location}\n`;
    response += `   📅 ${date}\n`;
    response += `   💰 ${formatPriceInRupees(event.price)}\n`;
    if (event.description) {
      response += `   📝 ${event.description.substring(0, 80)}${event.description.length > 80 ? '...' : ''}\n`;
    }
    response += `   🏷️ ${event.category}\n\n`;
  });
  
  response += "Would you like more details about any of these events, or should I search for something else?";
  
  return response;
};

/**
 * Main chat function with context-aware responses
 */
export const processChatMessage = async (
  message: string, 
  events: Event[],
  context?: ChatContext
): Promise<{ response: string; suggestedEvents?: Event[] }> => {
  const intent = detectIntent(message);
  
  // Handle greetings
  if (intent === 'greeting') {
    return { 
      response: generateGreeting() 
    };
  }
  
  // Handle questions
  if (intent === 'question') {
    return { 
      response: generateQuestionResponse(message) 
    };
  }
  
  // Handle event search (default)
  if (intent === 'search' || intent === 'location' || intent === 'date' || intent === 'price') {
    const matchedEvents = matchEvents(message, events);
    
    if (matchedEvents.length > 0) {
      return {
        response: formatEventResponse(matchedEvents, message),
        suggestedEvents: matchedEvents
      };
    }
    
    // If no matches, suggest popular events
    const popularEvents = events
      .sort((a, b) => (b.price || 0) - (a.price || 0))
      .slice(0, 3);
    
    if (popularEvents.length > 0) {
      return {
        response: `I couldn't find exact matches for "${message}", but here are some popular events you might enjoy:\n\n${formatEventResponse(popularEvents, message)}`,
        suggestedEvents: popularEvents
      };
    }
    
    return {
      response: "I don't have any events available right now. Please check back later or contact our support team for assistance."
    };
  }
  
  // Handle booking queries
  if (intent === 'booking') {
    return {
      response: "To book an event, you can:\n\n1️⃣ Use the search form on the homepage\n2️⃣ Click on any event card to view details\n3️⃣ Fill out the booking form\n4️⃣ Submit your request for admin approval\n\nWould you like me to help you find a specific event to book?"
    };
  }
  
  // Default response
  return {
    response: "I'm here to help you find amazing events! You can ask me about:\n\n• Events in specific cities\n• Types of events (weddings, concerts, conferences, etc.)\n• Events by date or price range\n• General questions about our services\n\nWhat would you like to know?"
  };
};

/**
 * Legacy function for backward compatibility
 */
export const getEventRecommendations = async (userPrompt: string, availableEvents: Event[]): Promise<string> => {
  const result = await processChatMessage(userPrompt, availableEvents);
  return result.response;
};


