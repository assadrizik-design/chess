import React from 'react';
import { Mail, MessageCircle, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#e0e0e0] leading-relaxed font-sans bg-[#161616] p-8 md:p-12 rounded-xl border border-[#2a2a2a] shadow-xl">
      <div className="text-center mb-12 border-b border-[#2a2a2a] pb-8">
        <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">اتصل بنا</h1>
        <p className="text-gray-400 text-sm">يسعدنا تواصلكم للإجابة على جميع استفساراتكم أو تلقي الاقتراحات.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8 hover:border-amber-500/30 transition-colors group text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#161616] border border-[#2a2a2a] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Mail className="text-amber-500" size={24} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">الدعم الفني</h2>
          <p className="text-gray-500 text-xs mb-6">لأي استفسارات تقنية أو مساعدة، يرجى مراسلتنا على البريد الإلكتروني.</p>
          <a href="mailto:assadrizik2011@gmail.com" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-bold text-sm">
            assadrizik2011@gmail.com
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8 hover:border-blue-500/30 transition-colors group text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#161616] border border-[#2a2a2a] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle className="text-blue-500" size={24} />
          </div>
          <h2 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">مجتمعنا</h2>
          <p className="text-gray-500 text-xs mb-6">انضم إلى سيرفر الديسكورد الرسمي الخاص بنا للتحدث مع المطور واللاعبين الآخرين.</p>
          <a href="https://discord.gg/BJ5kYUNutq" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold text-sm">
            سيرفر الديسكورد الرسمي
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="mt-12 text-center pt-8 text-xs text-gray-500">
        <p>
          تم تطوير هذه اللعبة بكل حب وبأعلى معايير البرمجة بواسطة: <span className="text-amber-500 font-bold ml-1">Abu Saqr</span>
        </p>
      </div>
    </div>
  );
};
