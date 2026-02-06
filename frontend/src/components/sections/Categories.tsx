import React from 'react';
import { FadeIn } from '../react-bits/FadeIn';
import { StaggerContainer } from '../react-bits/StaggerContainer';
import { StaggerItem } from '../react-bits/StaggerItem';
import { AnimatedText } from '../react-bits/AnimatedText';
import { FloatingBadge } from '../react-bits/FloatingBadge';
import { MagneticButton } from '../react-bits/MagneticButton';

const categories = [
  { 
    name: 'Concerts', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ), 
    color: 'from-purple-500 to-pink-500', 
    count: 124 
  },
  { 
    name: 'Conferences', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ), 
    color: 'from-blue-500 to-cyan-500', 
    count: 89 
  },
  { 
    name: 'Festivals', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2v13m-2-13a2 2 0 10-2 2v13m2-13a2 2 0 012 2v13m2-13a2 2 0 112 2v13" />
      </svg>
    ), 
    color: 'from-orange-500 to-red-500', 
    count: 156 
  },
  { 
    name: 'Workshops', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ), 
    color: 'from-green-500 to-emerald-500', 
    count: 67 
  },
  { 
    name: 'Sports', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ), 
    color: 'from-indigo-500 to-purple-500', 
    count: 203 
  },
  { 
    name: 'Arts', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ), 
    color: 'from-pink-500 to-rose-500', 
    count: 98 
  },
];

const Categories: React.FC = () => {
  return (
    <section className="py-10 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn delay={0.2} duration={0.8}>
          <div className="text-center mb-8 md:mb-10">
            <AnimatedText delay={0.2} duration={0.8}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Browse by <span className="text-purple-600">Category</span>
              </h2>
            </AnimatedText>
            <AnimatedText delay={0.4} duration={0.8}>
              <p className="text-base text-gray-600 max-w-xl mx-auto">
                Find events that match your interests
              </p>
            </AnimatedText>
          </div>
        </FadeIn>

        <StaggerContainer delay={0.6} staggerDelay={0.08}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 justify-items-center max-w-6xl mx-auto">
            {categories.map((category, index) => (
              <StaggerItem key={category.name}>
                <FloatingBadge floatDistance={4} duration={3 + index * 0.3}>
                  <MagneticButton strength={0.1}>
                    <div className="group bg-white rounded-xl p-4 md:p-5 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer text-center h-full flex flex-col items-center justify-center w-full max-w-[160px]">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        {category.icon}
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">{category.count} events</p>
                    </div>
                  </MagneticButton>
                </FloatingBadge>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Categories;

