import React from 'react';
import { Shield, Info, Mail, Menu, X, Gamepad2, Lightbulb, User } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import chessLogo from '../assets/chess.png';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { id: 'home', label: 'اللعبة', icon: <Gamepad2 size={18} /> },
    { id: 'profile', label: 'الملف الشخصي', icon: <User size={18} /> },
    { id: 'about', label: 'من نحن', icon: <Info size={18} /> },
    { id: 'privacy', label: 'سياسة الخصوصية', icon: <Shield size={18} /> },
    { id: 'contact', label: 'اتصل بنا', icon: <Mail size={18} /> },
  ];

  return (
    <nav className="h-16 border-b border-[#2a2a2a] flex items-center justify-between px-4 sm:px-8 bg-[#111111] sticky top-0 z-50">
      <div className="flex-shrink-0 cursor-pointer flex items-center gap-3" onClick={() => onNavigate('home')}>
        <img src={chessLogo} alt="Logo" className="w-8 h-8 rounded-full shadow-inner hidden sm:block object-cover" />
        <span className="text-xl font-bold tracking-tighter text-white">
          gamer<span className="text-amber-500">spaces</span>
        </span>
      </div>

      <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onNavigate(link.id)}
            className={cn(
              'transition-colors flex items-center gap-2 pb-1',
              currentPage === link.id
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'hover:text-white'
            )}
          >
            {link.icon}
            {link.label}
          </button>
        ))}
      </div>

      <div className="flex md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#222] focus:outline-none"
        >
          {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#161616] border-b border-[#2a2a2a] shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium w-full text-right flex items-center gap-3',
                  currentPage === link.id ? 'bg-[#222] text-amber-500' : 'text-gray-400 hover:bg-[#222] hover:text-white'
                )}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
