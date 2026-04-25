import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#e0e0e0] leading-relaxed font-sans bg-[#161616] p-8 md:p-12 rounded-xl border border-[#2a2a2a] shadow-xl">
      <h1 className="text-3xl font-bold text-white mb-8 border-b border-[#2a2a2a] pb-4 uppercase tracking-tight">سياسة الخصوصية</h1>

      <p className="text-gray-500 text-xs">تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>

      <p className="text-lg text-gray-400">
        نحن في <strong className="text-white">gamerspaces</strong> نحترم خصوصيتك ونلتزم بحمايتها. توضح سياسة الخصوصية هذه نوعية المعلومات التي قد نجمعها وكيفية حفظها والمحافظة عليها.
      </p>

      <h2 className="text-xl font-bold text-amber-500 mt-8 mb-4 uppercase tracking-tighter">جمع المعلومات</h2>
      <p className="text-gray-400">
        نحن لا نطلب أو نجمع أية معلومات شخصية (الاسم، البريد الإلكتروني، الموقع) بشكل إجباري لتصفح هذا الموقع أو لعب الشطرنج مع البوت.
      </p>

      <h2 className="text-xl font-bold text-amber-500 mt-8 mb-4 uppercase tracking-tighter">الإعلانات وملفات تعريف الارتباط (Cookies)</h2>
      <p className="text-gray-400">
        نحن نستخدم خدمات إعلانية مثل <strong className="text-white">جوجل أدسنس (Google AdSense)</strong> لتوفير الإعلانات على موقعنا. قد تستخدم الجهات الخارجية ملفات تعريف الارتباط لعرض إعلانات مخصصة لك بناءً على زياراتك السابقة لهذا الموقع ومواقع أخرى على الإنترنت.
      </p>

      <ul className="list-disc list-inside space-y-2 mt-4 mr-4 text-gray-400 marker:text-amber-500">
        <li>بإمكانك تعطيل تخصيص الإعلانات عن طريق زيارة إعدادات إعلانات جوجل.</li>
        <li>نحن نلتزم بشروط الخدمة الخاصة بجوجل أدسنس لضمان توفير بيئة آمنة للمستخدم.</li>
      </ul>

      <h2 className="text-xl font-bold text-amber-500 mt-8 mb-4 uppercase tracking-tighter">التغييرات على سياسة الخصوصية</h2>
      <p className="text-gray-400">
        نحتفظ بالحق في إجراء تغييرات على سياسة الخصوصية الخاصة بنا بأي وقت ودون سابق إنذار. سيتم إخطار الزوار بالتغييرات عن طريق تحديث هذا المستند في هذه الصفحة.
      </p>

      <p className="mt-8 font-semibold text-amber-500/80 text-sm">
        إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يمكنك التواصل معنا عبر صفحة "اتصل بنا".
      </p>
    </div>
  );
};
