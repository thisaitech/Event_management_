/**
 * Local event recommendation service (works offline for demo)
 * Provides simple keyword-based event recommendations
 */
import { formatPriceInRupees } from '../utils/currency';

export const getEventRecommendations = async (userPrompt: string, availableEvents: any[]): Promise<string> => {
  // For demo purposes, provide simple recommendations without external API
  // This avoids API key requirements and network issues
  if (!availableEvents || availableEvents.length === 0) {
    return "I don't see any events available right now. Please check back later!";
  }

  try {
    // Simple keyword matching for demo
    const lowerPrompt = userPrompt.toLowerCase();
    const matchedEvents = availableEvents
      .filter(event => {
        const searchText = `${event.title} ${event.description} ${event.category} ${event.location}`.toLowerCase();
        return searchText.includes(lowerPrompt) || 
               event.category.toLowerCase().includes(lowerPrompt) ||
               event.location.toLowerCase().includes(lowerPrompt);
      })
      .slice(0, 3);

    if (matchedEvents.length > 0) {
      const recommendations = matchedEvents.map((event, idx) => {
        const { formatPriceInRupees } = require('../utils/currency');
        return `${idx + 1}. **${event.title}** - ${event.description.substring(0, 100)}... Located in ${event.location}. Price: ${formatPriceInRupees(event.price)}`;
      }).join('\n\n');
      
      return `Based on your search, I found ${matchedEvents.length} great event(s) for you:\n\n${recommendations}\n\nWould you like to book one of these events?`;
    }

    // If no direct matches, suggest featured events or all events
    const suggestions = availableEvents.slice(0, 3).map((event, idx) => 
      `${idx + 1}. **${event.title}** - ${event.description.substring(0, 100)}... Located in ${event.location}. Price: ${formatPriceInRupees(event.price)}`
    ).join('\n\n');

    return `I couldn't find exact matches for "${userPrompt}", but here are some great events you might enjoy:\n\n${suggestions}\n\nFeel free to browse all our events!`;
  } catch (error) {
    console.error("Event recommendation error:", error);
    return "Sorry, I'm having trouble right now. Please browse our events manually!";
  }
};
