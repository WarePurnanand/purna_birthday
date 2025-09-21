import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface CakeCuttingSectionProps {
  onNext: () => void;
}

const CakeCuttingSection: React.FC<CakeCuttingSectionProps> = ({ onNext }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [knifePosition, setKnifePosition] = useState({ x: 0, y: 0 });
  const [blast, setBlast] = useState(false);
  const [cutProgress, setCutProgress] = useState(0);
  const [isCut, setIsCut] = useState(false);

  const cakeRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Play birthday song on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {
        console.log('Audio autoplay blocked');
      });
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Blast effect
  const triggerBlast = useCallback(() => {
    setBlast(true);
    // Stop birthday song when gift box appears
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setTimeout(() => {
      setBlast(false);
      onNext();
    }, 5000); // Longer delay to show the cutting animation
  }, [onNext]);

  // Dragging effect
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const clientX =
        "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : e.clientY;
      setKnifePosition({ x: clientX, y: clientY });

      // Calculate diagonal progress with more sensitivity
      const startX = dragStartRef.current.x;
      const startY = dragStartRef.current.y;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const diagonalDistance = Math.sqrt(300 * 300 + 300 * 300); // Larger detection area

      const progress = Math.min(distance / diagonalDistance, 1);
      setCutProgress(progress);

      // If cut is complete (diagonal drag), trigger realistic cut
      if (progress >= 0.7 && !isCut) {
        setIsCut(true);
        // Add a small delay before showing celebration for more realistic feel
        setTimeout(() => {
          triggerBlast();
        }, 800);
      }
    };

    const handleEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        dragStartRef.current = null;
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("touchmove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, isCut, triggerBlast]);

  // Start cutting
  const startDragging = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setKnifePosition({ x: clientX, y: clientY });
    dragStartRef.current = { x: clientX, y: clientY };

    // Play song on first cut
    const audio = audioRef.current;
    if (audio) {
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-yellow-100 relative overflow-hidden">
      {/* Birthday Song */}
      <audio ref={audioRef} src="/audio/birthday.mp3" preload="auto" />

      {/* Knife */}
      {isDragging && (
        <motion.div
          className="fixed pointer-events-none z-20"
          style={{ left: knifePosition.x - 25, top: knifePosition.y - 50 }}
          animate={{ scale: 1.2, rotate: 45 }}
          transition={{ duration: 0.1 }}
        >
          <div className="text-5xl">🔪</div>
        </motion.div>
      )}

      <div className="text-center w-full max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg py-2 px-4 border-b-4 border-pink-300 rounded-lg">
          Cut Your Birthday Cake 🎂
        </h2>

        {/* Beautiful 4-Tier Birthday Cake matching the image */}
        <div
          ref={cakeRef}
          className="relative mx-auto w-96 h-[500px] md:w-[450px] md:h-[550px] mb-8 cursor-crosshair"
          onMouseDown={startDragging}
          onTouchStart={startDragging}
          style={{ perspective: '2000px' }}
        >
          {!blast ? (
            <div className="relative w-full h-full flex flex-col items-center justify-end" style={{ transformStyle: 'preserve-3d' }}>

              {/* Top Tier - Smallest */}
              <motion.div
                className="absolute -left-12 top-32 text-3xl"
                animate={{ 
                  rotate: [0, 8, -8, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ transform: 'translateZ(150px)' }}
              >
                �
              </motion.div>
              <motion.div
                className="absolute -right-12 top-36 text-3xl"
                animate={{ 
                  rotate: [0, -8, 8, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                style={{ transform: 'translateZ(150px)' }}
              >
                �
              </motion.div>

              {/* Top Tier - Smallest (was bottom) */}
              <motion.div
                className="relative w-32 h-16 mb-1"
                style={{
                  transform: isCut ? `translateX(${cutProgress * -50}px) translateY(${cutProgress * 10}px) rotateY(${cutProgress * -25}deg) rotateX(${cutProgress * -12}deg) rotateZ(${cutProgress * -6}deg)` : 'translateZ(90px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease',
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl relative shadow-md"
                  style={{
                    background: 'linear-gradient(to bottom, #FFF8DC 0%, #F5DEB3 30%, #F5DEB3 70%, #DEB887 100%)',
                    boxShadow: '0 8px 15px rgba(0,0,0,0.15), inset 0 -3px 6px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-20" style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23deb887' fill-opacity='0.15'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3Ccircle cx='13' cy='13' r='1'/%3E%3C/g%3E%3C/svg%3E\")"
                  }}></div>
                </div>
                
                {/* Top tier decorations */}
                <div className="absolute top-1 left-2 right-2 flex justify-around items-center">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={`top-flower-${i}`}
                      className="w-3 h-2 relative"
                      style={{
                        background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E8E 50%, #FFB1B1 100%)',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
                      }}
                    >
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full"
                        style={{ background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)' }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* Piping borders */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)' }}
                ></div>
              </motion.div>

              {/* Second Tier (was third) */}
              <motion.div
                className="relative w-48 h-20 mb-2"
                style={{
                  transform: isCut ? `translateX(${cutProgress * 70}px) translateY(${cutProgress * 20}px) rotateY(${cutProgress * 30}deg) rotateX(${cutProgress * -10}deg) rotateZ(${cutProgress * 8}deg)` : 'translateZ(60px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease',
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl relative shadow-lg"
                  style={{
                    background: 'linear-gradient(to bottom, #FFF8DC 0%, #F5DEB3 30%, #F5DEB3 70%, #DEB887 100%)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2), inset 0 -4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-25" style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23deb887' fill-opacity='0.2'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3C/g%3E%3C/svg%3E\")"
                  }}></div>
                </div>
                
                {/* Second tier decorations */}
                <div className="absolute top-1.5 left-4 right-4 flex justify-around items-center">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={`second-flower-${i}`}
                      className="w-4 h-3 relative"
                      style={{
                        background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E8E 50%, #FFB1B1 100%)',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
                        style={{ background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)' }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* Piping borders */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)' }}
                ></div>
              </motion.div>

              {/* Third Tier (was second) */}
              <motion.div
                className="relative w-64 h-24 mb-2"
                style={{
                  transform: isCut ? `translateX(${cutProgress * -60}px) translateY(${cutProgress * 30}px) rotateY(${cutProgress * -20}deg) rotateX(${cutProgress * -5}deg) rotateZ(${cutProgress * -3}deg)` : 'translateZ(30px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease',
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl relative shadow-xl"
                  style={{
                    background: 'linear-gradient(to bottom, #FFF8DC 0%, #F5DEB3 30%, #F5DEB3 70%, #DEB887 100%)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.25), inset 0 -6px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-30" style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23deb887' fill-opacity='0.25'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3Ccircle cx='25' cy='25' r='2'/%3E%3C/g%3E%3C/svg%3E\")"
                  }}></div>
                </div>
                
                {/* Third tier coral decorations */}
                <div className="absolute top-2 left-6 right-6 flex justify-around items-center">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={`third-flower-${i}`}
                      className="w-5 h-3 relative"
                      style={{
                        background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E8E 50%, #FFB1B1 100%)',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)' }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* Piping borders */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1.5 rounded-b-2xl"
                  style={{ background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 50%, #FF6B6B 100%)' }}
                ></div>
              </motion.div>

              {/* Bottom Tier - Largest (was top) */}
              <motion.div
                className="relative w-80 h-28 mb-2"
                style={{
                  transform: isCut ? `translateX(${cutProgress * 80}px) translateY(${cutProgress * 40}px) rotateY(${cutProgress * 25}deg) rotateX(${cutProgress * 8}deg) rotateZ(${cutProgress * 5}deg)` : 'translateZ(0px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease',
                }}
              >
                {/* Cake base */}
                <div 
                  className="w-full h-full rounded-2xl relative shadow-2xl"
                  style={{
                    background: 'linear-gradient(to bottom, #FFF8DC 0%, #F5DEB3 30%, #F5DEB3 70%, #DEB887 100%)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.3), inset 0 -8px 15px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Cake texture */}
                  <div className="absolute inset-0 rounded-2xl opacity-30" style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23deb887' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41z'/%3E%3C/g%3E%3C/svg%3E\")"
                  }}></div>
                </div>
                
                {/* Bottom tier coral decorations */}
                <div className="absolute top-2 left-8 right-8 flex justify-around items-center">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={`bottom-flower-${i}`}
                      className="w-6 h-4 relative"
                      style={{
                        background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E8E 50%, #FFB1B1 100%)',
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.3)'
                      }}
                    >
                      {/* Flower center */}
                      <div 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                        style={{
                          background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* Coral piping border */}
                <div 
                  className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
                  style={{
                    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 25%, #FF6B6B 50%, #FF8E8E 75%, #FF6B6B 100%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-2 rounded-b-2xl"
                  style={{
                    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 25%, #FF6B6B 50%, #FF8E8E 75%, #FF6B6B 100%)',
                    boxShadow: '0 -2px 4px rgba(0,0,0,0.15)'
                  }}
                ></div>
              </motion.div>

              {/* Rich Photorealistic Top Frosting with 3D Decorations */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-8 rounded-t-2xl overflow-hidden"
                style={{
                  transform: isCut ? `translateX(${cutProgress * 55}px) translateY(${cutProgress * -40}px) rotateY(${cutProgress * 28}deg) rotateX(${cutProgress * -8}deg) translateZ(100px)` : 'translateZ(100px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,253,250,1) 60%, rgba(245,245,245,1) 100%)',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.12), inset 0 2px 3px rgba(255,255,255,0.9)'
                }}
              >
                {/* Frosting texture */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14.56.41 1.012.18 1.68.18.145 0 .336.106.545.116.21.01.38.126.59.226.544.212.91.116 1.2.326.08.058.23.156.33.256.1.1.22.19.28.29.06.1.17.256.17.256.08.12.23.21.43.32.35.207.7.44 1.13.536.16.037.29.135.32.234.03.1.16.245.25.292.15.075.4.173.5.263.1.09.15.196.23.297.09.123.15.26.28.347.12.076.3.15.38.195.26.167.52.298.62.416.1.117.17.21.35.312.17.91.49.151.6.193.1.042.27.152.31.173.04.02.26.152.3.173.04.02.09.075.12.093.03.018.24.127.25.13.01.003.17.077.25.107.08.03.28.108.3.11.02.002.46.202.56.242.1.04.36.156.45.196.09.04.49.196.67.225.18.03.91.115 1.11.135.2.02.52.07.62.08.1.01.19.021.64.031.45.01.49.071.63.07.14 0 .63.04.75.04.12 0 1.2.057 1.4.076.2.019.62.018.8.028.18.01.5.02 1 .02.5 0 .86-.08.94-.088.08-.008.33-.008.4-.008.07 0 .46.039.65.069.19.03.76.05.9.05.14 0 .78.059.93.068.15.01.31.02.38.03.07.01.75.049.9.059.15.01.81.049.95.058.14.01.29.031.45.05.16.02.44.03.55.04.11.01.93.1 1.02.11.09.01.5.04.75.07.25.03.51.041.63.051.12.01.67.051.82.071.15.02.59.03.69.04.1.01.92.07 1.02.08.1.01.69.03.79.04.1.01.84.056.94.066.1.01.79.03.88.04.09.01.92.06 1.02.07.1.01.79.02.89.03.1.01.99.067 1.09.077.1.01.89.01.99.02.1.01 1.13.078 1.23.088.1.01 1.07.03 1.17.04.1.01 1.09.089 1.19.099.1.01 1.13.01 1.23.02.1.01 1.18.09 1.28.09.1 0 1.17.01 1.27.01.1 0 1.27.08 1.37.08.1 0 1.32 0 1.42.01.1.01 1.37.069 1.47.079.1.01 1.41.01 1.51.01.1 0 1.47.079 1.57.079.1 0 1.51.01 1.61.02.1.01 1.56.059 1.66.069.1.01 1.66.02 1.76.03.1.01 1.69.059 1.79.069.1.01 1.77.02 1.88.03.11.01 1.83.059 1.94.069.11.01 1.87.01 1.98.02.11.01 1.98.06 2.08.06.1 0 1.97-.01 2.07-.01.1 0 2.01.07 2.12.07.11 0 2.12-.01 2.22-.01.1 0 2.16.069 2.27.079.11.01 2.21-.01 2.31-.01.1 0 2.25.08 2.35.08.1 0 2.3-.01 2.4-.01.1 0 2.33.079 2.42.079.09 0 2.44-.01 2.52-.01.08 0 2.47.08 2.55.08.08 0 2.5-.01 2.58-.01.08 0 2.55.079 2.63.079.08 0 2.58-.01 2.66-.01.08 0 2.67.069 2.75.069.08 0 2.64-.01 2.72-.01.08 0 2.69.08 2.76.08.07 0 2.76-.02 2.83-.02.07 0 2.78.07 2.86.07.08 0 2.85-.02 2.92-.02.07 0 2.85.08 2.92.08.07 0 2.89-.02 2.97-.02.08 0 2.97.069 3.04.069.07 0 2.99-.03 3.05-.03.06 0 3.04.08 3.1.08.06 0 3.01-.03 3.07-.03.06 0 3.09.069 3.15.069.06 0 3.09-.04 3.15-.04.06 0 3.14.069 3.21.069.07 0 3.15-.04 3.22-.04.07 0 3.2.06 3.26.06.06 0 3.19-.04 3.25-.04.06 0 3.23.049 3.29.049.06 0 3.27-.04 3.33-.04.06 0 3.27.049 3.33.049.06 0 3.32-.05 3.38-.05.06 0 3.3.04 3.36.04.06 0 3.36-.06 3.41-.06.05 0 3.35.03 3.41.03.06 0 3.39-.06 3.44-.06.05 0 3.45.019 3.5.019.05 0 3.43-.05 3.48-.05.05 0 3.47.02 3.52.02.05 0 3.51-.06 3.56-.06.05 0 3.54.009 3.59.009.05 0 3.53-.05 3.59-.05.06 0 3.58.01 3.63.01.05 0 3.57-.05 3.63-.05.06 0 3.61.01 3.66.01.05 0 3.64-.06 3.69-.06.05 0 3.66-.01 3.71-.01.05 0 3.7-.049 3.75-.049.05 0 3.73-.02 3.78-.02.05 0 3.76-.05 3.81-.05.05 0 3.82-.02 3.87-.02.05 0 3.81-.05 3.86-.05.05 0 3.85-.02 3.9-.02.05 0 3.88-.059 3.93-.059.05 0 3.92-.021 3.97-.021.05 0 3.96-.06 4.01-.06.05 0 3.97-.03 4.02-.03.05 0 4-.069 4.05-.069.05 0 4.06-.031 4.1-.031.04 0 4.05-.07 4.09-.07.04 0 4.06-.04 4.1-.04.04 0 4.1-.07 4.14-.07.04 0 4.1-.04 4.14-.04.04 0 4.13-.08 4.17-.08.04 0 4.15-.04 4.19-.04.04 0 4.18-.07 4.22-.07.04 0 4.18-.05 4.22-.05.04 0 4.22-.069 4.26-.069.04 0 4.22-.05 4.26-.05.04 0 4.25-.07 4.29-.07.04 0 4.25-.05 4.29-.05.04 0 4.27-.08 4.31-.08.04 0 4.3-.05 4.34-.05.04 0 4.32-.079 4.36-.079.04 0 4.35-.05 4.39-.05.04 0 4.36-.08 4.4-.08.04 0 4.4-.05 4.44-.05.04 0 4.41-.089 4.45-.089.04 0 4.45-.04 4.49-.04.04 0 4.45-.089 4.49-.089.04 0 4.5-.04 4.54-.04.04 0 4.51-.1 4.55-.1.04 0 4.51-.04 4.55-.04.04 0 4.56-.089 4.6-.089.04 0 4.56-.05 4.6-.05.04 0 4.58-.09 4.62-.09.04 0 4.61-.05 4.65-.05.04 0 4.62-.099 4.66-.099.04 0 4.67-.05 4.71-.05.04 0 4.67-.089 4.71-.089.04 0 4.7-.06 4.74-.06.04 0 4.71-.099 4.75-.099.04 0 4.75-.05 4.79-.05.04 0 4.76-.099 4.8-.099.04 0 4.79-.06 4.82-.06.03 0 4.82-.09 4.85-.09.03 0 4.86-.06 4.89-.06.03 0 4.86-.09 4.89-.09.03 0 4.87-.06 4.9-.06.03 0 4.9-.09 4.93-.09.03 0 4.91-.069 4.94-.069.03 0 4.95-.09 4.98-.09.03 0 4.95-.069 4.98-.069.03 0 4.96-.1 4.99-.1.03 0 4.99-.07 5.02-.07.03 0 5-.1 5.03-.1.03 0 5.02-.07 5.05-.07.03 0 5.05-.1 5.08-.1.03 0 5.05-.069 5.08-.069.03 0 5.09-.1 5.12-.1.03 0 5.1-.069 5.13-.069.03 0 5.1-.11 5.13-.11.03 0 5.11-.08 5.13-.08.02 0 5.12-.12 5.14-.12.02 0 5.16-.069 5.18-.069.02 0 5.17-.11 5.19-.11.02 0 5.19-.08 5.21-.08.02 0 5.2-.12 5.22-.12.02 0 5.2-.09 5.22-.09.02 0 5.22-.12 5.24-.12.02 0 5.23-.09 5.25-.09.02 0 5.26-.12 5.28-.12.02 0 5.29-.09 5.31-.09.02 0 5.3-.12 5.32-.12.02 0 5.32-.1 5.34-.1.02 0 5.33-.11 5.35-.11.02 0 5.35-.09 5.37-.09.02 0 5.36-.11 5.38-.11.02 0 5.39-.09 5.41-.09.02 0 5.4-.12 5.42-.12.02 0 5.42-.1 5.44-.1.02 0 5.43-.12 5.45-.12.02 0 5.45-.1 5.47-.1.02 0 5.46-.12 5.48-.12.02 0 5.51-.1 5.53-.1.02 0 5.54-.11 5.56-.11.02 0 5.56-.1 5.58-.1.02 0 5.57-.11 5.59-.11.02 0 5.58-.1 5.6-.1.02 0 5.59-.11 5.61-.11.02 0 5.62-.1 5.64-.1.02 0 5.63-.11 5.65-.11.02 0 5.68-.1 5.7-.1.02 0 5.67-.11 5.69-.11.02 0 5.7-.1 5.72-.1.02 0 5.71-.11 5.73-.11.02 0 5.75-.1 5.77-.1.02 0 5.75-.11 5.77-.11.02 0 5.79-.11 5.81-.11.02 0 5.8-.11 5.82-.11.02 0 5.83-.11 5.84-.11.01 0 5.84-.1 5.85-.1.01 0 5.87-.11 5.88-.11.01 0 5.89-.11 5.9-.11.01 0 5.89-.1 5.9-.1.01 0 5.91-.1 5.92-.1.01 0 5.93-.1 5.94-.1.01 0 5.95-.1 5.96-.1.01 0 5.96-.11 5.97-.11.01 0 5.97-.1 5.98-.1.01 0 5.98-.11 5.99-.11.01 0 6-.1 6.01-.1.01 0 6.02-.11 6.03-.11.01 0 6.05-.1 6.06-.1.01 0 6.06-.11 6.07-.11.01 0 6.06-.1 6.07-.1.01 0 6.08-.11 6.09-.11.01 0 6.11-.1 6.12-.1.01 0 6.11-.11 6.12-.11.01 0 6.13-.1 6.14-.1.01 0 6.13-.11 6.14-.11.01 0 6.15-.1 6.16-.1.01 0 6.16-.11 6.17-.11.01 0 6.18-.1 6.19-.1.01 0 6.18-.11 6.19-.11.01 0 6.2-.1 6.21-.1.01 0 6.2-.11 6.21-.11.01 0 6.21-.1 6.22-.1.01 0 6.22-.11 6.23-.11.01 0 6.23-.1 6.24-.1.01 0 6.24-.11 6.25-.11.01 0 6.25-.1 6.26-.1.01 0 6.25-.11 6.26-.11.01 0 6.26-.1 6.27-.1.01 0 6.26-.11 6.27-.11.01 0 6.28-.1 6.29-.1.01 0 6.28-.11 6.29-.11.01 0 6.3-.1 6.3-.1 0 0 6.3-.1 6.3-.1' fill='%23FFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")"
                }}></div>
                
                {/* Cream wave patterns */}
                <div className="absolute inset-0 opacity-40 overflow-hidden" style={{
                  backgroundImage: "radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.8) 0%, transparent 70%), radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.8) 0%, transparent 70%)"
                }}></div>
                
                {/* Decorative elements with 3D effects */}
                <div className="absolute top-1 left-6 w-3 h-2 rounded-full transform rotate-12" style={{
                  background: 'linear-gradient(135deg, #f8a5c2 0%, #f78fb3 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
                }}></div>
                
                <div className="absolute top-2 right-8 w-2 h-3 rounded-full transform -rotate-12" style={{
                  background: 'linear-gradient(135deg, #a3bded 0%, #6991c7 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
                }}></div>
                
                <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-full" style={{
                  background: 'linear-gradient(135deg, #fff7ad 0%, #ffd45e 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
                }}></div>
                
                <div className="absolute top-3 left-12 w-2 h-2 rounded-full" style={{
                  background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
                }}></div>
                
                <div className="absolute top-1 right-16 w-1.5 h-2.5 rounded-full" style={{
                  background: 'linear-gradient(135deg, #b4ffba 0%, #84fab0 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.3)'
                }}></div>
                
                {/* Small sprinkles */}
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  {[...Array(20)].map((_, i) => (
                    <div 
                      key={`sprinkle-${i}`}
                      className="absolute rounded-full"
                      style={{
                        width: `${0.3 + Math.random() * 0.4}rem`,
                        height: `${0.2 + Math.random() * 0.3}rem`,
                        background: ['#f78fb3', '#7ed6df', '#f5cd79', '#e55039', '#4bcffa'][Math.floor(Math.random() * 5)],
                        left: `${5 + Math.random() * 90}%`,
                        top: `${10 + Math.random() * 80}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        boxShadow: '0 0.5px 1px rgba(0,0,0,0.1)'
                      }}
                    ></div>
                  ))}
                </div>
              </motion.div>

              {/* "Happy Birthday Pooja" Text on the cake */}
              <motion.div
                className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center z-20"
                style={{
                  transform: isCut ? `translateX(${cutProgress * 58}px) translateY(${cutProgress * -45}px) rotateY(${cutProgress * 30}deg) translateZ(105px)` : 'translateZ(105px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease'
                }}
              >
                <div 
                  className="text-4xl font-bold mb-2 drop-shadow-lg px-6 py-2"
                  style={{ 
                    fontFamily: 'cursive',
                    background: 'linear-gradient(45deg, #9333EA 0%, #C084FC 50%, #9333EA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
                    textAlign: 'center',
                    letterSpacing: '2px'
                  }}
                >
                  Happy Birthday
                </div>
                <div 
                  className="text-5xl font-bold drop-shadow-xl px-6 py-3"
                  style={{ 
                    fontFamily: 'cursive',
                    background: 'linear-gradient(45deg, #EC4899 0%, #F472B6 50%, #EC4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                    letterSpacing: '3px'
                  }}
                >
                  Pooja
                </div>
              </motion.div>

              {/* Beautiful Sparkler Candles - positioned directly on top tier */}
              <motion.div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 flex justify-center gap-4 z-20"
                style={{
                  transform: isCut ? `translateX(${cutProgress * 60}px) translateY(${cutProgress * -50}px) rotateY(${cutProgress * 32}deg) translateZ(110px)` : 'translateZ(110px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease'
                }}
              >
                {/* Left Sparkler */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-6 bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 rounded-full shadow-md"></div>
                  <motion.div
                    className="relative -mt-1"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="text-lg">✨</div>
                    {/* Sparkle effects */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={`left-sparkle-${i}`}
                        className="absolute text-yellow-300 text-xs"
                        style={{
                          left: `${-8 + Math.random() * 16}px`,
                          top: `${-10 + Math.random() * 8}px`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          y: [0, -10],
                          x: [0, (Math.random() - 0.5) * 15]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: Math.random() * 1.5,
                          ease: "easeOut"
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Center Main Candle */}
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-8 bg-gradient-to-t from-red-600 via-red-500 to-red-400 rounded-full shadow-lg"></div>
                  <motion.div
                    className="w-3 h-3 bg-gradient-to-t from-orange-400 via-yellow-300 to-yellow-100 rounded-full -mt-1 shadow-xl relative"
                    animate={{ 
                      scale: [1, 1.2, 1], 
                      opacity: [0.9, 1, 0.9] 
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-0.5 h-2 bg-yellow-50 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full blur-[1px]"></div>
                  </motion.div>
                </div>

                {/* Right Sparkler */}
                <div className="flex flex-col items-center">
                  <div className="w-1 h-6 bg-gradient-to-t from-yellow-600 via-yellow-500 to-yellow-400 rounded-full shadow-md"></div>
                  <motion.div
                    className="relative -mt-1"
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  >
                    <div className="text-lg">✨</div>
                    {/* Sparkle effects */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={`right-sparkle-${i}`}
                        className="absolute text-yellow-300 text-xs"
                        style={{
                          left: `${-8 + Math.random() * 16}px`,
                          top: `${-10 + Math.random() * 8}px`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          y: [0, -10],
                          x: [0, (Math.random() - 0.5) * 15]
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          delay: Math.random() * 1.8,
                          ease: "easeOut"
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Additional smaller candles around the top tier */}
              <motion.div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-12 z-10"
                style={{
                  transform: isCut ? `translateX(${cutProgress * 45}px) translateY(${cutProgress * -40}px) rotateY(${cutProgress * 25}deg) translateZ(100px)` : 'translateZ(100px)',
                  transition: isCut ? 'none' : 'transform 0.3s ease'
                }}
              >
                {/* Small candles positioned around the cake */}
                <div className="absolute top-1 left-1 flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-full"></div>
                  <motion.div
                    className="w-1.5 h-1.5 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full -mt-0.5"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  />
                </div>
                
                <div className="absolute top-1 right-1 flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-gradient-to-t from-green-500 to-green-400 rounded-full"></div>
                  <motion.div
                    className="w-1.5 h-1.5 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full -mt-0.5"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                </div>
                
                <div className="absolute top-4 left-4 flex flex-col items-center">
                  <div className="w-0.5 h-2.5 bg-gradient-to-t from-purple-500 to-purple-400 rounded-full"></div>
                  <motion.div
                    className="w-1 h-1 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full -mt-0.5"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                  />
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col items-center">
                  <div className="w-0.5 h-2.5 bg-gradient-to-t from-pink-500 to-pink-400 rounded-full"></div>
                  <motion.div
                    className="w-1 h-1 bg-gradient-to-t from-orange-400 to-yellow-300 rounded-full -mt-0.5"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  />
                </div>
              </motion.div>
              
              {/* Sparkles around the cake */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ transform: 'translateZ(120px)' }}
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-yellow-300 text-xs"
                    style={{
                      left: `${15 + Math.random() * 70}%`,
                      top: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeInOut"
                    }}
                  >
                    ✨
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Cut Line Effect with Slice Separation */}
              {isDragging && cutProgress > 0.1 && (
                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{
                    background: `linear-gradient(45deg, transparent ${100 - cutProgress * 100}%, rgba(255,255,255,0.95) ${100 - cutProgress * 100}%, rgba(255,255,255,0.95) ${100 - cutProgress * 100 + 6}%, transparent ${100 - cutProgress * 100 + 6}%)`,
                    transform: 'translateZ(125px)',
                    boxShadow: 'inset 0 0 30px rgba(255,255,255,0.6), 0 0 20px rgba(255,255,255,0.4)'
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                />
              )}

              {/* Realistic Cake Interior when Cut */}
              {isCut && (
                <motion.div
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{ transform: 'translateZ(130px)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Cut cake interior showing layers */}
                  <div 
                    className="absolute left-1/2 top-1/2 w-1 h-full bg-gradient-to-b from-yellow-100 via-pink-200 to-brown-300 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                    style={{
                      background: 'linear-gradient(to bottom, #FFF8DC 0%, #FFE4E1 25%, #F5DEB3 50%, #DEB887 75%, #D2B48C 100%)',
                      width: '3px',
                      boxShadow: '0 0 10px rgba(0,0,0,0.3), inset 1px 0 2px rgba(255,255,255,0.5)'
                    }}
                  ></div>
                  
                  {/* Cake crumbs texture on cut surface */}
                  <div className="absolute left-1/2 top-1/2 w-2 h-full transform -translate-x-1/2 -translate-y-1/2 opacity-60" style={{
                    background: "url(\"data:image/svg+xml,%3Csvg width='10' height='20' viewBox='0 0 10 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23deb887' fill-opacity='0.4'%3E%3Ccircle cx='2' cy='3' r='0.5'/%3E%3Ccircle cx='7' cy='8' r='0.3'/%3E%3Ccircle cx='3' cy='13' r='0.4'/%3E%3Ccircle cx='8' cy='17' r='0.2'/%3E%3C/g%3E%3C/svg%3E\")"
                  }}></div>
                </motion.div>
              )}

              {/* Dramatic Crumbs and Cake Pieces Falling */}
              {isCut && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ transform: 'translateZ(135px)' }}
                >
                  {/* Large cake pieces with realistic colors */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`piece-${i}`}
                      className="absolute rounded-sm shadow-lg"
                      style={{
                        width: `${12 + Math.random() * 8}px`,
                        height: `${8 + Math.random() * 6}px`,
                        background: ['#FFF8DC', '#F5DEB3', '#DEB887', '#FFE4E1'][Math.floor(Math.random() * 4)],
                        left: `${25 + Math.random() * 50}%`,
                        top: `${40 + Math.random() * 30}%`,
                        border: '1px solid rgba(222, 184, 135, 0.5)'
                      }}
                      animate={{
                        y: [0, 120 + Math.random() * 80],
                        x: [0, (Math.random() - 0.5) * 150],
                        rotate: [0, Math.random() * 720],
                        scale: [1, 0.3, 0.1],
                        opacity: [1, 0.8, 0]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        delay: Math.random() * 0.5
                      }}
                    />
                  ))}

                  {/* Small realistic crumbs */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={`crumb-${i}`}
                      className="absolute rounded-full shadow-sm"
                      style={{
                        width: `${2 + Math.random() * 3}px`,
                        height: `${2 + Math.random() * 3}px`,
                        background: ['#F5DEB3', '#DEB887', '#D2B48C', '#FFE4E1', '#FFF8DC'][Math.floor(Math.random() * 5)],
                        left: `${20 + Math.random() * 60}%`,
                        top: `${35 + Math.random() * 40}%`,
                      }}
                      animate={{
                        y: [0, 80 + Math.random() * 60],
                        x: [0, (Math.random() - 0.5) * 120],
                        rotate: [0, Math.random() * 360],
                        opacity: [1, 0.6, 0]
                      }}
                      transition={{
                        duration: 2.5 + Math.random() * 1.5,
                        ease: "easeOut",
                        delay: Math.random() * 0.8
                      }}
                    />
                  ))}

                  {/* Coral flower petals falling */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`petal-${i}`}
                      className="absolute rounded-full shadow-sm"
                      style={{
                        width: `${4 + Math.random() * 4}px`,
                        height: `${3 + Math.random() * 3}px`,
                        background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E8E 50%, #FFB1B1 100%)',
                        left: `${30 + Math.random() * 40}%`,
                        top: `${20 + Math.random() * 40}%`,
                        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%'
                      }}
                      animate={{
                        y: [0, 100 + Math.random() * 50],
                        x: [0, (Math.random() - 0.5) * 100],
                        rotate: [0, Math.random() * 720],
                        scale: [1, 0.5, 0.2],
                        opacity: [1, 0.7, 0]
                      }}
                      transition={{
                        duration: 2.8 + Math.random() * 1.5,
                        ease: "easeOut",
                        delay: 0.2 + Math.random() * 0.5
                      }}
                    />
                  ))}

                  {/* Enhanced sparkle effects */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      className="absolute text-yellow-300 text-lg pointer-events-none"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [0, -50 - Math.random() * 30],
                        x: [0, (Math.random() - 0.5) * 80],
                        scale: [0, 1.5, 0],
                        rotate: [0, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 1.8 + Math.random(),
                        ease: "easeOut",
                        delay: 0.2 + Math.random() * 0.5
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-4xl md:text-6xl font-bold text-pink-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, rotate: 360 }}
              transition={{ duration: 1 }}
            >
              <div className="text-center">
                <div>🎉 Happy Birthday 🎉</div>
                <div className="text-2xl md:text-3xl mt-2 text-purple-600">Pooja</div>
              </div>
            </motion.div>
          )}
        </div>

        <p className="text-lg text-gray-700 mb-4 text-center max-w-md mx-auto px-4 py-2 bg-white/70 backdrop-blur-sm rounded-lg shadow-md">
          {!blast
            ? "Drag your knife diagonally across the cake to cut a beautiful slice! Watch as the pieces separate just like real cake cutting! 🎂✨"
            : "Enjoy your celebration 🎊"}
        </p>
      </div>
    </div>
  );
};

export default CakeCuttingSection;
