import React from 'react';

export default function AdBanner({ slot = 'header', className = '' }) {
  // In production, replace with real AdSense code:
  // <ins className="adsbygoogle" ... data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" />
  const sizes = {
    header: 'h-24 max-w-4xl',
    sidebar: 'h-64 w-full',
    inline: 'h-28 max-w-2xl',
  };

  return (
    <div className={`${sizes[slot] || sizes.inline} ${className} mx-auto my-8 bg-white/3 border border-white/5 rounded-xl flex items-center justify-center`}>
      <div className="text-center">
        <p className="text-slate-600 text-xs uppercase tracking-widest font-semibold">Advertisement</p>
        <p className="text-slate-700 text-xs mt-1">Google AdSense • {slot} banner</p>
      </div>
    </div>
  );
}
