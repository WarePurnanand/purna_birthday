import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Gift, Sparkles } from 'lucide-react';
import type { User } from '../App';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('Pooja');
  const [birthdate, setBirthdate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && birthdate) {
      onLogin({ name: name.trim(), birthdate });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-yellow-200 flex items-center justify-center p-4 relative overflow-hidden touch-manipulation">
      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 left-4 md:left-10 text-pink-400"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Heart size={30} className="md:w-10 md:h-10" fill="currentColor" />
      </motion.div>
      <motion.div
        className="absolute top-20 right-4 md:right-20 text-purple-400"
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        <Gift size={25} className="md:w-9 md:h-9" fill="currentColor" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-4 md:left-20 text-yellow-400"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <Sparkles size={20} className="md:w-8 md:h-8" fill="currentColor" />
      </motion.div>

      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 w-full max-w-md mx-4 shadow-2xl border border-white/50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-8 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
          style={{ fontFamily: 'Dancing Script, cursive' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Birthday Magic ✨
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Your Beautiful Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 md:py-4 rounded-2xl border-0 focus:outline-none transition-colors text-3xl md:text-4xl text-center touch-manipulation"
              placeholder="Enter your name..."
              required
            />
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">
              Your Special Day
            </label>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-3 md:py-4 rounded-2xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors text-base md:text-lg touch-manipulation"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 md:py-5 rounded-2xl font-semibold text-base md:text-lg hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 touch-manipulation"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Celebrate! 🎉
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;