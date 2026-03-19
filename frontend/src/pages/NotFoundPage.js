import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO title="404 – Page Not Found" />
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <div className="font-display font-extrabold text-8xl md:text-9xl gradient-text mb-4">404</div>
          <h2 className="font-display font-bold text-white text-3xl mb-3">Page Not Found</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/" className="btn-primary">Go Home →</Link>
            <Link to="/tools" className="btn-outline">Browse AI Tools</Link>
          </div>
        </div>
      </div>
    </>
  );
}
