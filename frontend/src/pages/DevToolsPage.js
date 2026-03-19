import React, { useState, useRef } from 'react';
import SEO from '../components/common/SEO';
import AdBanner from '../components/common/AdBanner';
import toast from 'react-hot-toast';

// ─── Password Generator ───────────────────────────────────────────────────────
function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const generate = () => {
    let chars = '';
    if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (options.numbers) chars += '0123456789';
    if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { toast.error('Select at least one character type'); return; }
    let pwd = '';
    for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    setPassword(pwd);
    const types = Object.values(options).filter(Boolean).length;
    setStrength(Math.min(100, (length / 32) * 60 + types * 10));
  };

  const copy = () => { navigator.clipboard.writeText(password); toast.success('Copied!'); };
  const strengthColor = strength > 70 ? 'bg-green-500' : strength > 40 ? 'bg-yellow-500' : 'bg-red-500';
  const strengthLabel = strength > 70 ? 'Strong' : strength > 40 ? 'Medium' : 'Weak';

  return (
    <div id="password" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔐 Password Generator</h3>
      <div className="mb-4">
        <label className="text-slate-400 text-sm mb-2 block">Length: <span className="text-white font-bold">{length}</span></label>
        <input type="range" min="8" max="64" value={length} onChange={e => setLength(+e.target.value)} className="w-full accent-primary-500" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {Object.entries(options).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={val} onChange={e => setOptions(p => ({ ...p, [key]: e.target.checked }))} className="accent-primary-500 w-4 h-4" />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
      <button onClick={generate} className="btn-primary w-full mb-4">Generate Password</button>
      {password && (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <code className="font-mono text-green-400 text-sm break-all">{password}</code>
            <button onClick={copy} className="ml-3 text-xs btn-outline py-1.5 px-3 flex-shrink-0">Copy</button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white/5 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full transition-all ${strengthColor}`} style={{ width: `${strength}%` }} />
            </div>
            <span className={`text-xs font-semibold ${strength > 70 ? 'text-green-400' : strength > 40 ? 'text-yellow-400' : 'text-red-400'}`}>{strengthLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ───────────────────────────────────────────────────────────
function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const format = () => {
    try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError(''); }
    catch (e) { setError(e.message); setOutput(''); }
  };
  const minify = () => {
    try { setOutput(JSON.stringify(JSON.parse(input))); setError(''); }
    catch (e) { setError(e.message); setOutput(''); }
  };
  const copy = () => { navigator.clipboard.writeText(output); toast.success('Copied!'); };

  return (
    <div id="json" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📄 JSON Formatter</h3>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder='Paste your JSON here...' className="input-field font-mono text-sm h-40 resize-none mb-3" />
      {error && <p className="text-red-400 text-xs mb-3 font-mono">{error}</p>}
      <div className="flex gap-2 mb-4">
        <button onClick={format} className="btn-primary flex-1">Format / Prettify</button>
        <button onClick={minify} className="btn-outline flex-1">Minify</button>
      </div>
      {output && (
        <div className="relative">
          <pre className="bg-white/5 rounded-xl p-4 text-green-400 font-mono text-xs overflow-auto max-h-64 border border-white/10">{output}</pre>
          <button onClick={copy} className="absolute top-3 right-3 text-xs btn-outline py-1 px-2">Copy</button>
        </div>
      )}
    </div>
  );
}

// ─── Word Counter ─────────────────────────────────────────────────────────────
function WordCounter() {
  const [text, setText] = useState('');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div id="word-counter" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📝 Word Counter</h3>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste or type your text here..." className="input-field h-40 resize-none mb-5" />
      <div className="grid grid-cols-3 gap-3">
        {[['Words', words], ['Characters', chars], ['No Spaces', charsNoSpace], ['Sentences', sentences], ['Paragraphs', paragraphs], ['Read Time', `~${readTime}m`]].map(([label, val]) => (
          <div key={label} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
            <div className="font-display font-bold text-xl text-primary-400">{val}</div>
            <div className="text-slate-500 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Image Compressor ─────────────────────────────────────────────────────────
function ImageCompressor() {
  const [original, setOriginal] = useState(null);
  const [compressed, setCompressed] = useState(null);
  const [quality, setQuality] = useState(80);
  const canvasRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setOriginal({ src: ev.target.result, size: file.size, name: file.name });
    reader.readAsDataURL(file);
    setCompressed(null);
  };

  const compress = () => {
    if (!original) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        setCompressed({ src: url, size: blob.size });
      }, 'image/jpeg', quality / 100);
    };
    img.src = original.src;
  };

  const saving = original && compressed ? Math.round((1 - compressed.size / original.size) * 100) : 0;

  return (
    <div id="image" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🖼️ Image Compressor</h3>
      <canvas ref={canvasRef} className="hidden" />
      <input type="file" accept="image/*" onChange={handleFile} className="input-field mb-4 cursor-pointer" />
      {original && (
        <>
          <div className="mb-4">
            <label className="text-slate-400 text-sm mb-2 block">Quality: <span className="text-white font-bold">{quality}%</span></label>
            <input type="range" min="10" max="100" value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-primary-500" />
          </div>
          <button onClick={compress} className="btn-primary w-full mb-4">Compress Image</button>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
              <div className="text-slate-400 text-xs mb-1">Original</div>
              <div className="font-bold text-white">{(original.size / 1024).toFixed(1)} KB</div>
            </div>
            {compressed && (
              <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
                <div className="text-green-400 text-xs mb-1">Compressed 🎉</div>
                <div className="font-bold text-green-400">{(compressed.size / 1024).toFixed(1)} KB</div>
                <div className="text-xs text-green-500">-{saving}% saved</div>
              </div>
            )}
          </div>
          {compressed && (
            <a href={compressed.src} download={`compressed_${original.name}`} className="btn-primary w-full mt-4 justify-center">Download Compressed Image</a>
          )}
        </>
      )}
      {!original && <p className="text-slate-500 text-sm">Upload a JPG, PNG, or WebP image to compress it in your browser. No server upload required.</p>}
    </div>
  );
}

// ─── Resume Builder (AI-powered) ─────────────────────────────────────────────
function ResumeAnalyzer() {
  const [resume, setResume] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async () => {
    if (!resume.trim()) { toast.error('Paste your resume text first'); return; }
    setAnalyzing(true);
    // Simulate AI analysis (in prod, call backend AI API)
    await new Promise(r => setTimeout(r, 2000));
    const wordCount = resume.split(/\s+/).length;
    const hasEmail = /\S+@\S+\.\S+/.test(resume);
    const hasPhone = /[\d\s\-\+\(\)]{10,}/.test(resume);
    const keywords = ['Python', 'JavaScript', 'SQL', 'Machine Learning', 'React', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'Data Science', 'API', 'REST', 'Git', 'Agile', 'Leadership'];
    const found = keywords.filter(k => resume.toLowerCase().includes(k.toLowerCase()));
    const missing = keywords.filter(k => !resume.toLowerCase().includes(k.toLowerCase())).slice(0, 5);
    const score = Math.min(95, Math.max(35, Math.round(
      (found.length / keywords.length) * 40 +
      (wordCount > 300 ? 20 : wordCount / 15) +
      (hasEmail ? 10 : 0) +
      (hasPhone ? 10 : 0) +
      (resume.includes('experience') || resume.includes('Experience') ? 10 : 0) +
      (resume.includes('education') || resume.includes('Education') ? 10 : 0)
    )));
    setResult({ score, found, missing, hasEmail, hasPhone, wordCount });
    setAnalyzing(false);
  };

  const scoreColor = result?.score > 75 ? 'text-green-400' : result?.score > 55 ? 'text-yellow-400' : 'text-red-400';
  const scoreLabel = result?.score > 75 ? 'Excellent' : result?.score > 55 ? 'Good' : 'Needs Work';

  return (
    <div id="resume" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-2">🤖 AI Resume Analyzer</h3>
      <p className="text-slate-400 text-sm mb-5">Paste your resume text to get an instant ATS score, keyword analysis, and improvement tips.</p>
      <textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume text here..." className="input-field h-40 resize-none mb-4 text-sm" />
      <button onClick={analyze} disabled={analyzing} className="btn-primary w-full mb-5">
        {analyzing ? '🔄 Analyzing your resume...' : '🔍 Analyze Resume (Free)'}
      </button>
      {result && (
        <div className="space-y-4">
          {/* ATS Score */}
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-white">ATS Compatibility Score</span>
              <span className={`font-display font-extrabold text-2xl ${scoreColor}`}>{result.score}%</span>
            </div>
            <div className="bg-white/5 rounded-full h-2 mb-2">
              <div className={`h-2 rounded-full transition-all ${result.score > 75 ? 'bg-green-500' : result.score > 55 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${result.score}%` }} />
            </div>
            <p className={`text-sm ${scoreColor}`}>{scoreLabel} — {result.score > 75 ? 'Your resume is well-optimized for ATS!' : result.score > 55 ? 'Good foundation. Add missing skills to improve.' : 'Needs significant improvements to pass ATS filters.'}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['Word Count', result.wordCount], ['Email Found', result.hasEmail ? '✓ Yes' : '✗ No'], ['Phone Found', result.hasPhone ? '✓ Yes' : '✗ No']].map(([l, v]) => (
              <div key={l} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className={`font-bold text-sm ${String(v).startsWith('✓') ? 'text-green-400' : String(v).startsWith('✗') ? 'text-red-400' : 'text-white'}`}>{v}</div>
                <div className="text-slate-500 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>

          {/* Keywords found */}
          <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
            <p className="text-green-400 text-sm font-semibold mb-2">✓ Keywords Found ({result.found.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {result.found.map(k => <span key={k} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-md">{k}</span>)}
            </div>
          </div>

          {/* Missing keywords */}
          {result.missing.length > 0 && (
            <div className="bg-orange-500/5 rounded-xl p-4 border border-orange-500/20">
              <p className="text-orange-400 text-sm font-semibold mb-2">⚠ Suggested Keywords to Add</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing.map(k => <span key={k} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-md">{k}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const TABS = [
    { id: 'all', label: '🧰 All Tools' },
    { id: 'password', label: '🔐 Password' },
    { id: 'json', label: '📄 JSON' },
    { id: 'words', label: '📝 Words' },
    { id: 'image', label: '🖼️ Image' },
    { id: 'resume', label: '🤖 Resume AI' },
  ];

  return (
    <>
      <SEO title="Free Developer Tools" description="Free browser-based developer tools: password generator, JSON formatter, word counter, image compressor, and AI resume analyzer." keywords="free developer tools, password generator, JSON formatter, word counter, image compressor, resume analyzer, ATS checker" />
      <div className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">⚙️ Free Utilities</div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-4">
              Free <span className="gradient-text">Developer Tools</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Browser-based utilities that work instantly—no signup required. 100% free.</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeTab === tab.id ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <AdBanner slot="inline" className="mb-8" />

          <div className="grid grid-cols-1 gap-6">
            {(activeTab === 'all' || activeTab === 'password') && <PasswordGenerator />}
            {(activeTab === 'all' || activeTab === 'json') && <JSONFormatter />}
            {(activeTab === 'all' || activeTab === 'words') && <WordCounter />}
            {(activeTab === 'all' || activeTab === 'image') && <ImageCompressor />}
            {(activeTab === 'all' || activeTab === 'resume') && <ResumeAnalyzer />}
          </div>
        </div>
      </div>
    </>
  );
}
