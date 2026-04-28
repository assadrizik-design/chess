import React, { useState } from 'react';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
const chessBanner = 'https://i.postimg.cc/CMjdMqJH/chess-banner.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isInGame, setIsInGame] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} onGameChange={setIsInGame} />;
      case 'profile': return <Profile />;
      case 'about': return <About />;
      case 'privacy': return <Privacy />;
      case 'contact': return <Contact />;
      default: return <Home onNavigate={setCurrentPage} onGameChange={setIsInGame} />;
    }
  };

  const showBackground = currentPage !== 'home' || !isInGame;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-amber-500 selection:text-[#0a0a0a] relative" dir="rtl">
      {showBackground && (
         <div 
           className="fixed inset-0 z-0 opacity-10 pointer-events-none bg-cover bg-center bg-no-repeat"
           style={{ backgroundImage: `url(${chessBanner})` }}
         />
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 flex flex-col p-4 sm:p-6 gap-6 overflow-hidden">
          {renderPage()}
          <AdBanner />
        </main>
        <Footer onNavigate={setCurrentPage} />
      </div>
    </div>
  );
}
