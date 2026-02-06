import React from 'react';
import { Event } from '@/types';
import { FadeIn } from '../react-bits/FadeIn';
import { StaggerContainer } from '../react-bits/StaggerContainer';
import { StaggerItem } from '../react-bits/StaggerItem';
import { AnimatedText } from '../react-bits/AnimatedText';
import { MagneticButton } from '../react-bits/MagneticButton';
import { Rotate3D } from '../react-bits/Rotate3D';
import { formatPriceInRupees } from '@/utils/currency';

interface FeaturedEventsProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events, onEventClick }) => {
  const featuredEvents = events.slice(0, 6);

  return (
    <section className="py-10 md:py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn delay={0.2} duration={0.8}>
          <div className="text-center mb-8 md:mb-10">
            <AnimatedText delay={0.2} duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Featured <span className="text-purple-600">Events</span>
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Discover handpicked events curated just for you
              </p>
            </AnimatedText>
          </div>
        </FadeIn>

        {/* Events Grid */}
        <StaggerContainer delay={0.6} staggerDelay={0.08}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {featuredEvents.map((event, index) => (
              <StaggerItem key={event.id}>
                <Rotate3D rotateX={5} rotateY={5}>
                  <MagneticButton strength={0.1}>
                    <div 
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 h-full"
                      onClick={() => onEventClick?.(event)}
                      style={{ cursor: onEventClick ? 'pointer' : 'default' }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {event.category}
                          </span>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-medium">{event.organizer}</p>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">{event.date}</p>
                          <p className="text-lg font-bold text-gray-900">{formatPriceInRupees(event.price)}</p>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-2 line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </MagneticButton>
                </Rotate3D>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturedEvents;

