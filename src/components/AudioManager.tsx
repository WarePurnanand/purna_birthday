import React, { useEffect, useRef } from 'react';
import type { Section } from '../App';

interface AudioManagerProps {
  currentSection: Section;
}

const AudioManager: React.FC<AudioManagerProps> = ({ currentSection }) => {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const rocketSoundRef = useRef<HTMLAudioElement | null>(null);
  const birthdaySongRef = useRef<HTMLAudioElement | null>(null);
  const firewhistleRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Store current refs to avoid stale closure issues
    const backgroundMusic = backgroundMusicRef.current;
    const rocketSound = rocketSoundRef.current;
    const birthdaySong = birthdaySongRef.current;
    const firewhistle = firewhistleRef.current;

    // Create audio elements
    if (typeof window !== 'undefined') {
      // Simple background music simulation
      if (currentSection === 'main' || currentSection === 'memories') {
        // In a real implementation, you would load actual audio files here
        console.log('Playing soft background music...');
      }
      
      if (currentSection === 'fireworks') {
        console.log('Playing rocket launch sound...');
        // Play firewhistle sound
        if (firewhistle) {
          firewhistle.currentTime = 0; // Reset to beginning
          firewhistle.play().catch(() => {
            console.log('Firewhistle audio autoplay blocked');
          });
        }
      }
      
      if (currentSection === 'cake') {
        console.log('Playing Happy Birthday song...');
      }
    }

    return () => {
      // Cleanup audio - stop all sounds
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
      if (rocketSound) {
        rocketSound.pause();
        rocketSound.currentTime = 0;
      }
      if (birthdaySong) {
        birthdaySong.pause();
        birthdaySong.currentTime = 0;
      }
      if (firewhistle) {
        firewhistle.pause();
        firewhistle.currentTime = 0;
      }
    };
  }, [currentSection]);

  return (
    <>
      {/* Firewhistle sound for fireworks */}
      <audio ref={firewhistleRef} src="/audio/firewhistle.mp3" preload="auto" />
    </>
  );
};

export default AudioManager;