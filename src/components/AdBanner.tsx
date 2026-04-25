import React, { useEffect } from 'react';

export const AdBanner: React.FC = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense Error', e);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4 overflow-hidden min-h-[90px] bg-transparent">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8216688270722962"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};
