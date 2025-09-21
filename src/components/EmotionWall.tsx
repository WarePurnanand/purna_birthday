import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart } from 'lucide-react';
import type { Message } from '../App';

interface EmotionWallProps {
  messages: Message[];
  onAddMessage: (text: string) => void;
  onNavigateToGallery: () => void;
}

const EmotionWall: React.FC<EmotionWallProps> = ({ messages, onAddMessage, onNavigateToGallery }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showGiftBox, setShowGiftBox] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('birthdayMessages');
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      // Only load if we don't already have messages (to avoid duplicates)
      if (messages.length === 0) {
        parsedMessages.forEach((msg: Message) => {
          onAddMessage(msg.text);
        });
      }
    }
  }, [messages.length, onAddMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onAddMessage(newMessage.trim());
      setNewMessage('');
      setShowGiftBox(true);

      // Save to localStorage
      const updatedMessages = [...messages, {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
      }];
      localStorage.setItem('birthdayMessages', JSON.stringify(updatedMessages));
    }
  };

  const stickyColors = [
    'bg-yellow-200 border-yellow-300',
    'bg-pink-200 border-pink-300',
    'bg-purple-200 border-purple-300',
    'bg-blue-200 border-blue-300',
    'bg-green-200 border-green-300',
    'bg-orange-200 border-orange-300',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-100 via-pink-50 to-cream-100 p-4 touch-manipulation">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className="text-3xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent px-4"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Write Your Feelings Here 💌
          </h2>
          <p className="text-base md:text-xl text-gray-700 px-4">
            Share your birthday wishes and happy thoughts!
          </p>
        </motion.div>

        {/* Message Input Form */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 md:p-8 mb-8 md:mb-12 shadow-lg border border-white/50 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your beautiful thoughts, wishes, or birthday memories..."
              className="w-full h-24 md:h-32 px-4 py-3 border-2 border-pink-200 rounded-2xl resize-none focus:border-pink-400 focus:outline-none transition-colors text-base md:text-lg touch-manipulation"
              maxLength={280}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-500">
                {280 - newMessage.length} characters remaining
              </span>
              
              <motion.button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-2xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-95 touch-manipulation text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={16} className="md:w-5 md:h-5" />
                <span>Send Message</span>
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Messages Wall */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                className={`${stickyColors[index % stickyColors.length]} p-3 md:p-4 rounded-2xl shadow-md border-2 transform rotate-1 hover:rotate-0 hover:scale-105 transition-all cursor-pointer relative touch-manipulation`}
                initial={{ opacity: 0, scale: 0, rotate: Math.random() * 10 - 5 }}
                animate={{ opacity: 1, scale: 1, rotate: Math.random() * 6 - 3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
              >
                {/* Sticky note pin */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full shadow-sm"></div>
                
                <p className="text-gray-800 font-medium leading-relaxed mb-2 md:mb-3 text-sm md:text-base">
                  "{message.text}"
                </p>
                
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
                  <span>{message.timestamp.toLocaleDateString()}</span>
                  <Heart size={14} className="md:w-4 md:h-4 text-pink-500" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Sample messages for demonstration */}
          {messages.length === 0 && (
            <>
              <motion.div
                className="bg-yellow-200 border-yellow-300 p-3 md:p-4 rounded-2xl shadow-md border-2 transform -rotate-1 relative touch-manipulation"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full shadow-sm"></div>
                <p className="text-gray-800 font-medium leading-relaxed mb-2 md:mb-3 text-sm md:text-base">
                  "Hope your birthday is as amazing as you are! 🎉"
                </p>
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
                  <span>Today</span>
                  <Heart size={14} className="md:w-4 md:h-4 text-pink-500" />
                </div>
              </motion.div>
              
              <motion.div
                className="bg-pink-200 border-pink-300 p-3 md:p-4 rounded-2xl shadow-md border-2 transform rotate-2 relative touch-manipulation"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full shadow-sm"></div>
                <p className="text-gray-800 font-medium leading-relaxed mb-2 md:mb-3 text-sm md:text-base">
                  "Wishing you joy, laughter, and endless happiness! ✨"
                </p>
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-600">
                  <span>Today</span>
                  <Heart size={14} className="md:w-4 md:h-4 text-pink-500" />
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Final Message */}
        <motion.div
          className="text-center mt-12 md:mt-16 bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/50 mx-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3
            className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Thank you for celebrating! 🎂
          </h3>
          <p className="text-base md:text-lg text-gray-700">
            Your birthday memories have been created with love and joy. 
            Keep spreading happiness wherever you go! ✨
          </p>
        </motion.div>

        {/* Gift Box Popup */}
        <AnimatePresence>
          {showGiftBox && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 text-center max-w-md mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Surprise Gift!</h3>
                <p className="text-gray-600 mb-6">Click to open your special birthday gift!</p>
                <motion.button
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowGiftBox(false);
                    onNavigateToGallery();
                  }}
                >
                  Open Gift 🎉
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmotionWall;