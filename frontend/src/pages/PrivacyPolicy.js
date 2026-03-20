import React from 'react';
import SEO from '../components/common/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy" />
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>

        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal data.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">Information We Collect</h2>
        <p className="mb-4">
          We may collect basic information such as name, email, and usage data.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">How We Use Data</h2>
        <p className="mb-4">
          We use your data to improve our services and user experience.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">Cookies</h2>
        <p>
          We use cookies for analytics and improving performance.
        </p>
      </div>
    </>
  );
}