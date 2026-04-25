import React from 'react';

type FooterProps = {
  onNavigate: (page: string) => void;
};

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="h-auto md:h-12 border-t border-[#2a2a2a] bg-[#0a0a0a] flex flex-col md:flex-row items-center justify-between px-8 py-4 md:py-0 text-[10px] text-gray-500 gap-4 md:gap-0">
      <div className="text-center md:text-right">المطور: <span className="text-white">Abu Saqr</span> | الدعم: <span className="text-amber-500 cursor-pointer" onClick={() => onNavigate('contact')}>assadrizik2011@gmail.com</span></div>
      <div className="flex gap-4 items-center">
        <a href="https://discord.gg/BJ5kYUNutq" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500">Discord Community</a>
        <span>&copy; {new Date().getFullYear()} لعبة gamerspaces</span>
      </div>
    </footer>
  );
};
