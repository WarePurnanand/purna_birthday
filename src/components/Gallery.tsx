import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ArrowLeft, X } from 'lucide-react';

interface GalleryProps {
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<'folders' | 'images' | 'videos'>('folders');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Actual media files from memories2 and videomemo folders
  const images = [
    'IMG-20250906-WA0030.jpg', 'IMG-20250906-WA0031.jpg', 'IMG-20250906-WA0032.jpg',
    'IMG-20250906-WA0033.jpg', 'IMG-20250906-WA0034.jpg', 'IMG-20250906-WA0035.jpg',
    'IMG-20250906-WA0036.jpg', 'IMG-20250906-WA0037.jpg', 'IMG-20250906-WA0038.jpg',
    'IMG-20250906-WA0039.jpg', 'IMG-20250906-WA0040.jpg', 'IMG-20250906-WA0041.jpg',
    'IMG-20250906-WA0042.jpg', 'IMG-20250906-WA0043.jpg', 'IMG-20250906-WA0044.jpg',
    'IMG-20250906-WA0045.jpg', 'IMG-20250906-WA0046.jpg', 'IMG-20250906-WA0047.jpg',
    'IMG-20250906-WA0048.jpg', 'IMG-20250906-WA0049.jpg', 'IMG-20250906-WA0050.jpg',
    'IMG-20250906-WA0051.jpg', 'IMG-20250906-WA0052.jpg', 'IMG-20250906-WA0053.jpg',
    'IMG-20250906-WA0054.jpg', 'IMG-20250906-WA0055.jpg', 'IMG-20250906-WA0056.jpg',
    'IMG-20250906-WA0057.jpg', 'IMG-20250906-WA0058.jpg', 'IMG-20250906-WA0059.jpg',
    'IMG-20250906-WA0060.jpg', 'IMG-20250906-WA0061.jpg', 'IMG-20250906-WA0062.jpg',
    'IMG-20250906-WA0063.jpg'
  ];
  const videos = [
    'VID-20250904-WA0006.mp4', 'VID-20250904-WA0008.mp4', 'VID-20250904-WA0009.mp4',
    'VID-20250904-WA0010.mp4', 'VID-20250904-WA0011.mp4', 'VID-20250904-WA0012.mp4',
    'VID-20250904-WA0013.mp4', 'VID-20250904-WA0014.mp4', 'VID-20250904-WA0015.mp4',
    'VID-20250904-WA0016.mp4'
  ];

  const handleFolderClick = (folder: 'images' | 'videos') => {
    setCurrentView(folder);
  };

  const handleMediaClick = (media: string) => {
    setSelectedMedia(media);
  };

  const handleBack = () => {
    if (currentView !== 'folders') {
      setCurrentView('folders');
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {currentView === 'folders' ? 'Your Birthday Gallery' : currentView === 'images' ? 'Beautiful Memories' : 'Special Moments'}
          </h1>
          <div></div> {/* Spacer */}
        </motion.div>

        <AnimatePresence mode="wait">
          {currentView === 'folders' && (
            <motion.div
              key="folders"
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Images Folder */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center cursor-pointer shadow-xl border border-white/50 hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFolderClick('images')}
              >
                <div className="text-8xl mb-4">📸</div>
                <Folder size={64} className="mx-auto mb-4 text-pink-500" />
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Images</h3>
                <p className="text-gray-600">{images.length} beautiful birthday photos</p>
              </motion.div>

              {/* Videos Folder */}
              <motion.div
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center cursor-pointer shadow-xl border border-white/50 hover:shadow-2xl transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFolderClick('videos')}
              >
                <div className="text-8xl mb-4">🎥</div>
                <Folder size={64} className="mx-auto mb-4 text-purple-500" />
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Videos</h3>
                <p className="text-gray-600">{videos.length} special birthday videos</p>
              </motion.div>
            </motion.div>
          )}

          {currentView === 'images' && (
            <motion.div
              key="images"
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {images.map((image, index) => (
                <motion.div
                  key={image}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 cursor-pointer shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMediaClick(image)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl flex items-center justify-center mb-2 overflow-hidden">
                    <img src={`/public/images/memories2/${image}`} alt={image} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-center text-gray-700 truncate">{image}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {currentView === 'videos' && (
            <motion.div
              key="videos"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 cursor-pointer shadow-md hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMediaClick(video)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-200 to-blue-200 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                    <video src={`/public/videos/videomemo/${video}`} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-sm text-center text-gray-700">{video}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Media Viewer Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{selectedMedia}</h3>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                  {selectedMedia.includes('.jpg') ? (
                    <img 
                      src={`/public/images/memories2/${selectedMedia}`}
                      alt={selectedMedia}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <video
                      src={`/public/videos/videomemo/${selectedMedia}`}
                      controls
                      className="max-w-full max-h-full"
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;