import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-[#e0e0e0] leading-relaxed font-sans bg-[#161616] p-8 md:p-12 rounded-xl border border-[#2a2a2a] shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-[#2a2a2a] pb-4 uppercase tracking-tight">من نحن</h1>
      
      <p className="text-lg text-gray-400">
        أهلاً بك في <strong className="text-white">gamerspaces</strong>. نحن نسعى لتقديم أفضل تجربة شطرنج متوفرة على المتصفح عبر رسوميات جذابة ومحركات قوية.
      </p>

      <h2 className="text-xl font-bold text-amber-500 mt-8 mb-4 uppercase tracking-tighter">رسالتنا</h2>
      <p className="text-gray-400">
        تهدف اللعبة إلى تطوير مهارات اللاعبين من خلال تدريبهم أمام محركات ذكية ومجتمع عالمي في بيئة آمنة وذات أداء عالي تدعم جميع الأجهزة بلا استثناء.
      </p>

      <h2 className="text-xl font-bold text-amber-500 mt-8 mb-4 uppercase tracking-tighter">لماذا نحن؟</h2>
      <ul className="list-disc list-inside space-y-3 mr-4 text-gray-400 marker:text-amber-500">
        <li>تصميم احترافي وراقٍ مخصص لهواة التميز.</li>
        <li>القدرة على اللعب مع البوت بمستويات مختلفة التكتيك والأسلوب من السهل إلى بالغ الصعوبة.</li>
        <li>اللعب المباشر مع أصدقائك واللاعبين (أونلاين).</li>
        <li>التركيز على واجهة مستخدم توفر الراحة والبساطة بدون تعقيدات خوارزمية ذكاء اصطناعي خارجية, اعتمادًا بالكامل على قوة محركات الشطرنج الرياضية.</li>
      </ul>
    </div>
  );
};
