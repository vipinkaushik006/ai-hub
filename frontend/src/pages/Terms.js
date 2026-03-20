import React from 'react';
import SEO from '../components/common/SEO';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service" />
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>

        <p className="mb-4">
          By using our website, you agree to the following terms.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">Usage</h2>
        <p className="mb-4">
          You agree not to misuse the platform or its services.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">Content</h2>
        <p className="mb-4">
          We are not responsible for third-party tools listed on the platform.
        </p>

        <h2 className="text-xl text-white mt-6 mb-2">Changes</h2>
        <p>
          We may update these terms anytime without prior notice.
        </p>
      </div>
    </>
  );
}