import React from 'react';
import { Event } from '../types';
import { FadeIn } from './react-bits/FadeIn';
import { BlurFade } from './react-bits/BlurFade';
import { formatPriceInRupees } from '@/utils/currency';

interface EventDetailModalProps {
  event: Event | null;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <FadeIn delay={0.1} duration={0.3}>
        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-sm p-2 rounded-full text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="grid md:grid-cols-2">
            {/* Event Image */}
            <div className="relative h-64 md:h-auto">
              <img 
                src={event.imageUrl || 'https://picsum.photos/800/600'} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="bg-purple-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 inline-block">
                  {event.category}
                </span>
                <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-8">
              <BlurFade delay={0.2} duration={0.6}>
                <div className="space-y-6">
                  {/* Price */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <p className="text-3xl font-bold text-gray-900">{formatPriceInRupees(event.price)}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-lg font-semibold text-gray-900">{event.date}</p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </p>
                  </div>

                  {/* Organizer */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Organizer</p>
                    <p className="text-lg font-semibold text-gray-900">{event.organizer}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-base text-gray-700 leading-relaxed">{event.description || 'No description available.'}</p>
                  </div>

                  {/* Close Button */}
                  <div className="pt-4">
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-100 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default EventDetailModal;

