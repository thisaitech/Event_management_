import React from 'react';
import { FadeIn } from '../react-bits/FadeIn';
import { StaggerContainer } from '../react-bits/StaggerContainer';
import { StaggerItem } from '../react-bits/StaggerItem';
import { AnimatedText } from '../react-bits/AnimatedText';
import { BlurFade } from '../react-bits/BlurFade';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Organizer',
    image: 'https://i.pravatar.cc/150?img=1',
    text: 'Eventic made selling tickets so easy. The platform is intuitive and our attendees love the booking experience.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Concert Goer',
    image: 'https://i.pravatar.cc/150?img=2',
    text: 'I\'ve booked over 20 events through Eventic. The instant confirmation and secure payment give me peace of mind.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Festival Attendee',
    image: 'https://i.pravatar.cc/150?img=3',
    text: 'The search feature is amazing! Found the perfect festival in minutes. Highly recommend this platform.',
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn delay={0.2} duration={0.8}>
          <div className="text-center mb-8 md:mb-10">
            <AnimatedText delay={0.2} duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                What People <span className="text-purple-600">Say</span>
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Trusted by thousands of event organizers and attendees
              </p>
            </AnimatedText>
          </div>
        </FadeIn>

        <StaggerContainer delay={0.6} staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <StaggerItem key={index}>
                <BlurFade delay={0.1 * index} duration={0.8} blurAmount={5}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-5 leading-relaxed text-sm">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </BlurFade>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Testimonials;

