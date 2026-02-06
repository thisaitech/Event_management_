import React from 'react';
import { FadeIn } from '../react-bits/FadeIn';
import { StaggerContainer } from '../react-bits/StaggerContainer';
import { StaggerItem } from '../react-bits/StaggerItem';
import { AnimatedText } from '../react-bits/AnimatedText';
import { PulseRing } from '../react-bits/PulseRing';

const steps = [
  {
    number: '01',
    title: 'Post Your Event',
    description: 'Create your event listing and specify the type of helpers or services you need. Set your requirements, budget, and timeline.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Choose Event Management',
    description: 'Select from our premium event management services. View detailed packages, professional teams, pricing, and availability for your celebration.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Book Your Event',
    description: 'Secure your premium event management package with instant confirmation. Reserve your date, guest count, and customize every detail of your celebration.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Celebrate in Style',
    description: 'Experience your flawlessly executed event with premium management services. Enjoy world-class coordination and create unforgettable memories with your guests.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-10 md:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn delay={0.2} duration={0.8}>
          <div className="text-center mb-8 md:mb-10">
            <AnimatedText delay={0.2} duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                How It <span className="text-purple-600">Works</span>
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Book your premium event management in four simple steps
              </p>
            </AnimatedText>
          </div>
        </FadeIn>

        <StaggerContainer delay={0.6} staggerDelay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <div className="relative">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 h-full">
                    <PulseRing ringColor="rgba(147, 51, 234, 0.3)" size={70}>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4 relative z-10">
                        {step.icon}
                      </div>
                    </PulseRing>
                    <div className="absolute top-3 right-3 text-5xl font-bold text-gray-100 -z-0">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 relative z-10">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HowItWorks;

