import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music } from 'lucide-react';
import type { User } from '../App';

interface MainPageProps {
  user: User;
  onNext: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ user, onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden touch-manipulation">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff69b4' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🎂</div>
        </motion.div>

        <motion.h1
          className="text-3xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent px-4 text-center"
          style={{ fontFamily: 'Dancing Script, cursive' }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Welcome {user.name}!
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-700 mb-8 md:mb-12 font-medium px-4 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Are you ready for your birthday surprise?
        </motion.p>

        <motion.div
          className="flex items-center justify-center mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Music className="text-pink-500 mr-2" size={20} />
          <span className="text-pink-600 font-medium text-sm md:text-base">Soft music playing...</span>
        </motion.div>

        <motion.button
          onClick={onNext}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 md:px-12 py-4 md:py-6 rounded-3xl text-lg md:text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto touch-manipulation"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="mr-2 md:mr-3" size={20} />
          Start Memories 🎉
        </motion.button>
      </div>
    </div>
  );
};

export default MainPage;