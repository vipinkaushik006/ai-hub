import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function Sitemap() {
  return (
    <>
      <SEO title="Sitemap" />
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-6">Sitemap</h1>

        <ul className="space-y-2">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/tools">AI Tools</Link></li>
          <li><Link to="/dev-tools">Developer Tools</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
      </div>
    </>
  );
}