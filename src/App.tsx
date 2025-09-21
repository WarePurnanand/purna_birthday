import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import MemoriesSlideshow from './components/MemoriesSlideshow';
import FireworksSection from './components/FireworksSection';
import CakeCuttingSection from './components/CakeCuttingSection';
import EmotionWall from './components/EmotionWall';
import Gallery from './components/Gallery';
import AudioManager from './components/AudioManager';

export type Section = 'login' | 'main' | 'memories' | 'fireworks' | 'cake' | 'emotion' | 'gallery';

export interface User {
  name: string;
  birthdate: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
}

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('login');
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentSection('main');
  };

  const navigateToSection = (section: Section) => {
    setCurrentSection(section);
  };

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'main':
        return <MainPage user={user!} onNext={() => navigateToSection('memories')} />;
      case 'memories':
        return <MemoriesSlideshow onComplete={() => navigateToSection('fireworks')} />;
      case 'fireworks':
        return <FireworksSection user={user!} onNext={() => navigateToSection('cake')} />;
      case 'cake':
        return <CakeCuttingSection onNext={() => navigateToSection('emotion')} />;
      case 'emotion':
        return <EmotionWall messages={messages} onAddMessage={addMessage} onNavigateToGallery={() => navigateToSection('gallery')} />;
      case 'gallery':
        return <Gallery onBack={() => navigateToSection('emotion')} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <AudioManager currentSection={currentSection} />
      {renderCurrentSection()}
    </div>
  );
}

export default App;