
import React from 'react';
import { Event } from '../types';
import { formatPriceInRupees } from '@/utils/currency';

interface EventCardProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
      onClick={() => onClick(event)}
      className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {event.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">{event.date}</p>
          <p className="text-lg font-bold text-gray-900">{formatPriceInRupees(event.price)}</p>
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
          {event.description}
        </p>
        
        <div className="flex items-center text-sm text-gray-400 mt-auto">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
