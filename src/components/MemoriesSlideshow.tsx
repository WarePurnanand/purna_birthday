import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Memory {
  id: number;
  image: string;
  caption: string;
}

interface MemoriesSlideshowProps {
  onComplete: () => void;
}

const memories: Memory[] = [
  {
    id: 1,
    image: '/images/memories1/1.jpg',
    caption: 'Every year brings new adventures and beautiful moments to cherish forever! 🌟'
  },
  {
    id: 2,
    image: '/images/memories1/2.jpg',
    caption: 'Surrounded by love, laughter, and the warmth of friendship. These are the golden days! ✨'
  },
  {
    id: 3,
    image: '/images/memories1/3.jpg',
    caption: 'Celebrating life\'s precious gifts - family, joy, and endless possibilities ahead! 🎈'
  },
  {
    id: 4,
    image: '/images/memories1/4.jpg',
    caption: 'Making wishes come true, one birthday candle at a time. Dream big, shine bright! 🕯️'
  },
  {
    id: 5,
    image: '/images/memories1/5.jpg',
    caption: 'Here\'s to another year of creating magical memories and spreading happiness everywhere! 🎂'
  }
];

const MemoriesSlideshow: React.FC<MemoriesSlideshowProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Start playing memories music
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Audio autoplay blocked, will play on user interaction');
      });
    }

    return () => {
      // Cleanup audio when component unmounts
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      if (currentSlide < memories.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setAutoPlay(false);
        // Stop audio when slideshow completes
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [currentSlide, autoPlay]);

  const nextSlide = () => {
    setAutoPlay(false);
    if (currentSlide < memories.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    setAutoPlay(false);
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-peach-100 to-pink-100 flex items-center justify-center p-4 touch-manipulation">
      {/* Memories Music */}
      <audio ref={audioRef} src="/audio/memories.mp3" preload="auto" loop />

      <div className="w-full max-w-4xl">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent px-4"
          style={{ fontFamily: 'Dancing Script, cursive' }}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Beautiful Memories 📸
        </motion.h2>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 md:p-8 shadow-2xl border border-white/50 transform rotate-1 hover:rotate-0 transition-transform mx-2"
              style={{
                background: 'linear-gradient(135deg, #fff9c4 0%, #fff5f5 50%, #f0f9ff 100%)',
              }}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
                <motion.div
                  className="order-2 md:order-1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="relative w-full h-48 md:h-80 overflow-hidden rounded-2xl shadow-lg bg-gray-100">
                    <img
                      src={memories[currentSlide].image}
                      alt={`Memory ${currentSlide + 1}`}
                      className="w-full h-full object-contain rounded-2xl shadow-lg transition-opacity duration-300"
                      style={{
                        backgroundColor: 'rgba(255, 248, 240, 0.9)',
                        objectPosition: '50% 30%' // Focus on the upper part of the image where faces typically are
                      }}
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=500';
                        console.log(`Failed to load image: ${memories[currentSlide].image}`);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
                    
                    {/* Image controls overlay */}
                    <div className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-sm rounded-full p-1 flex space-x-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const img = e.currentTarget.parentElement?.previousElementSibling as HTMLImageElement;
                          if (img) {
                            img.style.objectFit = img.style.objectFit === 'contain' ? 'cover' : 'contain';
                          }
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-pink-600 rounded-full"
                        title="Toggle fit mode"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const img = e.currentTarget.parentElement?.previousElementSibling as HTMLImageElement;
                          if (img) {
                            // Move objectPosition up
                            const currentPos = img.style.objectPosition.split(' ');
                            const verticalPos = parseInt(currentPos[1]) || 30;
                            img.style.objectPosition = `50% ${Math.max(verticalPos - 10, 0)}%`;
                          }
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-pink-600 rounded-full"
                        title="Focus higher"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const img = e.currentTarget.parentElement?.previousElementSibling as HTMLImageElement;
                          if (img) {
                            // Move objectPosition down
                            const currentPos = img.style.objectPosition.split(' ');
                            const verticalPos = parseInt(currentPos[1]) || 30;
                            img.style.objectPosition = `50% ${Math.min(verticalPos + 10, 100)}%`;
                          }
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-pink-600 rounded-full"
                        title="Focus lower"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="order-1 md:order-2 text-center md:text-left"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md">
                    <p className="text-base md:text-2xl text-gray-700 leading-relaxed font-medium text-center md:text-left" 
                       style={{ fontFamily: 'Dancing Script, cursive' }}>
                      {memories[currentSlide].caption}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 text-center md:text-right">
                      Memory {currentSlide + 1}/{memories.length}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentSlide === memories.length - 1}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 md:p-3 rounded-full shadow-lg hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6 text-gray-700" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center mt-6 md:mt-8 space-x-2">
          {memories.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setAutoPlay(false);
              }}
              className={`w-3 h-3 rounded-full transition-all touch-manipulation ${
                index === currentSlide 
                  ? 'bg-pink-500 w-8' 
                  : 'bg-pink-200 hover:bg-pink-300'
              }`}
            />
          ))}
        </div>

        {/* Complete Button */}
        {currentSlide === memories.length - 1 && (
          <motion.div
            className="text-center mt-8 md:mt-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <button
              onClick={handleComplete}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-3xl text-lg md:text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ready for Fireworks! 🚀
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemoriesSlideshow;