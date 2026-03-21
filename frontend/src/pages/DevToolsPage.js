import React, { useState, useRef, useEffect, useCallback } from 'react';
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

// ─── Resume Analyzer ─────────────────────────────────────────────────────────
function ResumeAnalyzer() {
  const [resume, setResume] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = async () => {
    if (!resume.trim()) { toast.error('Paste your resume text first'); return; }
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    const wordCount = resume.split(/\s+/).length;
    const hasEmail = /\S+@\S+\.\S+/.test(resume);
    const hasPhone = /[\d\s\-+()]{10,}/.test(resume);
    const keywords = ['Python', 'JavaScript', 'SQL', 'Machine Learning', 'React', 'Node.js', 'AWS', 'Docker', 'TypeScript', 'Data Science', 'API', 'REST', 'Git', 'Agile', 'Leadership'];
    const found = keywords.filter(k => resume.toLowerCase().includes(k.toLowerCase()));
    const missing = keywords.filter(k => !resume.toLowerCase().includes(k.toLowerCase())).slice(0, 5);
    const score = Math.min(95, Math.max(35, Math.round(
      (found.length / keywords.length) * 40 +
      (wordCount > 300 ? 20 : wordCount / 15) +
      (hasEmail ? 10 : 0) + (hasPhone ? 10 : 0) +
      (resume.toLowerCase().includes('experience') ? 10 : 0) +
      (resume.toLowerCase().includes('education') ? 10 : 0)
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
          <div className="grid grid-cols-3 gap-3">
            {[['Word Count', result.wordCount], ['Email Found', result.hasEmail ? '✓ Yes' : '✗ No'], ['Phone Found', result.hasPhone ? '✓ Yes' : '✗ No']].map(([l, v]) => (
              <div key={l} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className={`font-bold text-sm ${String(v).startsWith('✓') ? 'text-green-400' : String(v).startsWith('✗') ? 'text-red-400' : 'text-white'}`}>{v}</div>
                <div className="text-slate-500 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
          <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
            <p className="text-green-400 text-sm font-semibold mb-2">✓ Keywords Found ({result.found.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {result.found.map(k => <span key={k} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-md">{k}</span>)}
            </div>
          </div>
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

// ─── NEW TOOLS ────────────────────────────────────────────────────────────────

// 1. Base64 Encoder / Decoder
function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const run = () => {
    try {
      if (mode === 'encode') setOutput(btoa(unescape(encodeURIComponent(input))));
      else setOutput(decodeURIComponent(escape(atob(input))));
    } catch {
      toast.error('Invalid input for decoding');
    }
  };

  return (
    <div id="base64" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔁 Base64 Encoder / Decoder</h3>
      <div className="flex gap-2 mb-4">
        {['encode', 'decode'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${mode === m ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {m}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'} className="input-field font-mono text-sm h-28 resize-none mb-3" />
      <button onClick={run} className="btn-primary w-full mb-4">{mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}</button>
      {output && (
        <div className="relative">
          <pre className="bg-white/5 rounded-xl p-4 text-green-400 font-mono text-xs overflow-auto max-h-40 border border-white/10 whitespace-pre-wrap break-all">{output}</pre>
          <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} className="absolute top-3 right-3 text-xs btn-outline py-1 px-2">Copy</button>
        </div>
      )}
    </div>
  );
}

// 2. URL Encoder / Decoder
function URLEncoderTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const run = () => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      toast.error('Invalid URL encoding');
    }
  };

  return (
    <div id="url-encoder" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔗 URL Encoder / Decoder</h3>
      <div className="flex gap-2 mb-4">
        {['encode', 'decode'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${mode === m ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {m}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com%2F...'} className="input-field font-mono text-sm h-24 resize-none mb-3" />
      <button onClick={run} className="btn-primary w-full mb-3">{mode === 'encode' ? 'Encode URL' : 'Decode URL'}</button>
      {output && (
        <div className="relative">
          <pre className="bg-white/5 rounded-xl p-4 text-green-400 font-mono text-xs overflow-auto max-h-32 border border-white/10 whitespace-pre-wrap break-all">{output}</pre>
          <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} className="absolute top-3 right-3 text-xs btn-outline py-1 px-2">Copy</button>
        </div>
      )}
    </div>
  );
}

// 3. Hash Generator
function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({});

  const generate = async () => {
    if (!input.trim()) { toast.error('Enter some text first'); return; }
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const results = {};
    for (const algo of ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512']) {
      const buf = await crypto.subtle.digest(algo, data);
      results[algo] = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    setHashes(results);
  };

  return (
    <div id="hash" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔑 Hash Generator</h3>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Enter text to hash..." className="input-field font-mono text-sm h-24 resize-none mb-3" />
      <button onClick={generate} className="btn-primary w-full mb-4">Generate Hashes</button>
      {Object.entries(hashes).length > 0 && (
        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div key={algo} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-primary-400 font-semibold">{algo}</span>
                <button onClick={() => { navigator.clipboard.writeText(hash); toast.success('Copied!'); }} className="text-xs btn-outline py-0.5 px-2">Copy</button>
              </div>
              <code className="text-green-400 font-mono text-xs break-all">{hash}</code>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 4. Regex Tester
function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState(null);
  const [error, setError] = useState('');

  const test = () => {
    if (!pattern) { toast.error('Enter a regex pattern'); return; }
    try {
      const re = new RegExp(pattern, flags);
      const found = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
      setMatches(found);
      setError('');
    } catch (e) {
      setError(e.message);
      setMatches(null);
    }
  };

  const highlighted = () => {
    if (!matches || matches.length === 0) return text;
    try {
      return text.replace(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'),
        m => `<mark class="bg-yellow-400/30 text-yellow-300 rounded px-0.5">${m}</mark>`);
    } catch { return text; }
  };

  return (
    <div id="regex" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔍 Regex Tester</h3>
      <div className="flex gap-2 mb-3">
        <input value={pattern} onChange={e => setPattern(e.target.value)} placeholder="Enter regex pattern..." className="input-field font-mono text-sm flex-1" />
        <input value={flags} onChange={e => setFlags(e.target.value)} placeholder="flags" className="input-field font-mono text-sm w-20" />
      </div>
      {error && <p className="text-red-400 text-xs mb-3 font-mono">{error}</p>}
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste test string here..." className="input-field h-28 resize-none mb-3 text-sm" />
      <button onClick={test} className="btn-primary w-full mb-4">Test Regex</button>
      {matches !== null && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${matches.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {matches.length > 0 ? `✓ ${matches.length} match${matches.length > 1 ? 'es' : ''} found` : '✗ No matches'}
            </span>
          </div>
          {text && matches.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-500 mb-2">Highlighted matches:</p>
              <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-all" dangerouslySetInnerHTML={{ __html: highlighted() }} />
            </div>
          )}
          {matches.length > 0 && (
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 max-h-40 overflow-auto">
              {matches.map((m, i) => (
                <div key={i} className="text-xs font-mono text-green-400 py-0.5 border-b border-white/5 last:border-0">
                  [{i + 1}] &quot;{m[0]}&quot; <span className="text-slate-500">at index {m.index}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 5. Lorem Ipsum Generator
function LoremGenerator() {
  const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident culpa qui officia deserunt mollit anim est laborum'.split(' ');
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const sentence = () => {
      const len = 8 + Math.floor(Math.random() * 10);
      return WORDS.slice().sort(() => Math.random() - 0.5).slice(0, len).join(' ').replace(/^\w/, c => c.toUpperCase()) + '.';
    };
    const paragraph = () => Array.from({ length: 4 + Math.floor(Math.random() * 4) }, sentence).join(' ');
    if (type === 'words') setOutput(WORDS.slice().sort(() => Math.random() - 0.5).slice(0, count).join(' '));
    else if (type === 'sentences') setOutput(Array.from({ length: count }, sentence).join(' '));
    else setOutput(Array.from({ length: count }, paragraph).join('\n\n'));
  };

  return (
    <div id="lorem" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📃 Lorem Ipsum Generator</h3>
      <div className="flex gap-2 mb-4">
        {['words', 'sentences', 'paragraphs'].map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${type === t ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mb-4">
        <label className="text-slate-400 text-sm mb-2 block">Count: <span className="text-white font-bold">{count}</span></label>
        <input type="range" min="1" max={type === 'paragraphs' ? 10 : type === 'sentences' ? 20 : 100} value={count} onChange={e => setCount(+e.target.value)} className="w-full accent-primary-500" />
      </div>
      <button onClick={generate} className="btn-primary w-full mb-4">Generate</button>
      {output && (
        <div className="relative">
          <pre className="bg-white/5 rounded-xl p-4 text-slate-300 text-xs overflow-auto max-h-52 border border-white/10 whitespace-pre-wrap font-sans">{output}</pre>
          <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} className="absolute top-3 right-3 text-xs btn-outline py-1 px-2">Copy</button>
        </div>
      )}
    </div>
  );
}

// 6. CSS Units Converter
function CSSUnitsConverter() {
  const [value, setValue] = useState('16');
  const [base, setBase] = useState('16');
  const basePx = parseFloat(base) || 16;
  const px = parseFloat(value) || 0;

  const units = [
    ['px', px.toFixed(2)],
    ['rem', (px / basePx).toFixed(4)],
    ['em', (px / basePx).toFixed(4)],
    ['%', ((px / basePx) * 100).toFixed(2)],
    ['pt', (px * 0.75).toFixed(2)],
    ['vw (1920px base)', ((px / 1920) * 100).toFixed(4)],
    ['vh (1080px base)', ((px / 1080) * 100).toFixed(4)],
  ];

  return (
    <div id="css-units" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📐 CSS Units Converter</h3>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Pixel Value (px)</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Base Font Size (px)</label>
          <input type="number" value={base} onChange={e => setBase(e.target.value)} className="input-field" />
        </div>
      </div>
      <div className="space-y-2">
        {units.map(([unit, val]) => (
          <div key={unit} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
            <span className="text-slate-400 text-sm">{unit}</span>
            <div className="flex items-center gap-2">
              <code className="text-primary-400 font-mono font-bold text-sm">{val}</code>
              <button onClick={() => { navigator.clipboard.writeText(val); toast.success('Copied!'); }} className="text-xs text-slate-500 hover:text-white transition-colors">📋</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Color Picker & Converter
function ColorConverter() {
  const [hex, setHex] = useState('#6366f1');
  const [error, setError] = useState('');

  const hexToRgb = (h) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const rgb = hexToRgb(hex);

  const toHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        default: h = ((r - g) / d + 4) / 6;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hsl = rgb ? toHsl(rgb.r, rgb.g, rgb.b) : null;

  const formats = rgb && hsl ? [
    ['HEX', hex.toUpperCase()],
    ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
    ['RGBA', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`],
    ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
    ['CSS Variable', `--color: ${hex};`],
    ['Tailwind approx', `[${hex}]`],
  ] : [];

  return (
    <div id="color" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🎨 Color Picker & Converter</h3>
      <div className="flex gap-3 mb-5">
        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-16 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
        <input type="text" value={hex} onChange={e => { setHex(e.target.value); setError(''); }} placeholder="#000000" className="input-field font-mono flex-1" />
      </div>
      {rgb && <div className="w-full h-16 rounded-xl mb-5 border border-white/10 transition-all" style={{ backgroundColor: hex }} />}
      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
      <div className="space-y-2">
        {formats.map(([label, val]) => (
          <div key={label} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
            <span className="text-slate-400 text-xs w-24">{label}</span>
            <code className="text-primary-400 font-mono text-xs flex-1 text-center">{val}</code>
            <button onClick={() => { navigator.clipboard.writeText(val); toast.success('Copied!'); }} className="text-xs text-slate-500 hover:text-white transition-colors">📋</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Timestamp Converter
function TimestampConverter() {
  const [unix, setUnix] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [human, setHuman] = useState('');

  const fromUnix = () => {
    const d = new Date(parseInt(unix) * 1000);
    if (isNaN(d)) { toast.error('Invalid Unix timestamp'); return; }
    setHuman(d.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }));
  };

  const toUnix = () => {
    const d = new Date(human);
    if (isNaN(d)) { toast.error('Invalid date string'); return; }
    setUnix(String(Math.floor(d.getTime() / 1000)));
  };

  const now = () => { const t = Math.floor(Date.now() / 1000); setUnix(String(t)); };

  const formats = unix && !isNaN(parseInt(unix)) ? (() => {
    const d = new Date(parseInt(unix) * 1000);
    return [
      ['UTC', d.toUTCString()],
      ['ISO 8601', d.toISOString()],
      ['Local', d.toLocaleString()],
      ['Date only', d.toLocaleDateString()],
      ['Time only', d.toLocaleTimeString()],
      ['MS (epoch)', String(parseInt(unix) * 1000)],
    ];
  })() : [];

  return (
    <div id="timestamp" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">⏱️ Timestamp Converter</h3>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Unix Timestamp</label>
          <div className="flex gap-2">
            <input value={unix} onChange={e => setUnix(e.target.value)} className="input-field font-mono flex-1 text-sm" />
            <button onClick={now} className="btn-outline px-3 text-xs whitespace-nowrap">Now</button>
            <button onClick={fromUnix} className="btn-primary px-3 text-xs whitespace-nowrap">→ Date</button>
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Human Readable Date</label>
          <div className="flex gap-2">
            <input value={human} onChange={e => setHuman(e.target.value)} placeholder="e.g. Jan 1, 2025 12:00 AM" className="input-field flex-1 text-sm" />
            <button onClick={toUnix} className="btn-primary px-3 text-xs whitespace-nowrap">→ Unix</button>
          </div>
        </div>
      </div>
      {formats.length > 0 && (
        <div className="space-y-1.5">
          {formats.map(([label, val]) => (
            <div key={label} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2 border border-white/5">
              <span className="text-slate-500 text-xs w-24 flex-shrink-0">{label}</span>
              <code className="text-primary-400 font-mono text-xs flex-1 text-right mr-2 truncate">{val}</code>
              <button onClick={() => { navigator.clipboard.writeText(val); toast.success('Copied!'); }} className="text-xs text-slate-500 hover:text-white transition-colors flex-shrink-0">📋</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 9. Markdown Previewer
function MarkdownPreviewer() {
  const [md, setMd] = useState('# Hello World\n\nThis is **bold** and _italic_.\n\n- Item one\n- Item two\n- Item three\n\n> A blockquote\n\n`const x = 42;`');

  const toHtml = (text) => text
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-white mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-white mt-5 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/_(.+?)_/g, '<em class="italic text-slate-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-green-400 font-mono text-xs px-1.5 py-0.5 rounded">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary-500 pl-4 text-slate-400 my-2">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-300 ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>');

  return (
    <div id="markdown" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">✍️ Markdown Previewer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Editor</p>
          <textarea value={md} onChange={e => setMd(e.target.value)} className="input-field font-mono text-sm h-64 resize-none" />
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Preview</p>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 h-64 overflow-auto text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: toHtml(md) }} />
        </div>
      </div>
    </div>
  );
}

// 10. UUID Generator
function UUIDGenerator() {
  const [uuids, setUuids] = useState([]);
  const [count, setCount] = useState(5);

  const generateUUID = () => {
    if (crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };

  const generate = () => setUuids(Array.from({ length: count }, generateUUID));

  return (
    <div id="uuid" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🆔 UUID Generator</h3>
      <div className="mb-4">
        <label className="text-slate-400 text-sm mb-2 block">Count: <span className="text-white font-bold">{count}</span></label>
        <input type="range" min="1" max="20" value={count} onChange={e => setCount(+e.target.value)} className="w-full accent-primary-500" />
      </div>
      <button onClick={generate} className="btn-primary w-full mb-4">Generate UUID(s)</button>
      {uuids.length > 0 && (
        <div className="space-y-2">
          {uuids.map((id, i) => (
            <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
              <code className="text-green-400 font-mono text-xs">{id}</code>
              <button onClick={() => { navigator.clipboard.writeText(id); toast.success('Copied!'); }} className="text-xs text-slate-500 hover:text-white transition-colors ml-2">📋</button>
            </div>
          ))}
          <button onClick={() => { navigator.clipboard.writeText(uuids.join('\n')); toast.success('All copied!'); }} className="btn-outline w-full text-xs mt-2">Copy All</button>
        </div>
      )}
    </div>
  );
}

// 11. Cron Expression Explainer
function CronExplainer() {
  const [expr, setExpr] = useState('0 9 * * 1-5');

  const PRESETS = [
    ['Every minute', '* * * * *'],
    ['Every hour', '0 * * * *'],
    ['Daily 9am', '0 9 * * *'],
    ['Weekdays 9am', '0 9 * * 1-5'],
    ['Every Sunday midnight', '0 0 * * 0'],
    ['1st of month', '0 0 1 * *'],
  ];

  const explain = (e) => {
    const parts = e.trim().split(/\s+/);
    if (parts.length !== 5) return 'Invalid cron expression (expected 5 fields)';
    const [min, hour, dom, month, dow] = parts;
    const f = v => v === '*' ? 'every' : v;
    const days = { '0': 'Sun', '1': 'Mon', '2': 'Tue', '3': 'Wed', '4': 'Thu', '5': 'Fri', '6': 'Sat' };
    const monthNames = { '1': 'Jan', '2': 'Feb', '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun', '7': 'Jul', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
    const fmtDow = v => v === '*' ? 'every day' : v.split(',').map(d => days[d] || d).join(', ');
    const fmtMonth = v => v === '*' ? 'every month' : v.split(',').map(m => monthNames[m] || m).join(', ');
    return `Runs at ${hour === '*' ? 'every hour' : `hour ${hour}`}, minute ${min === '*' ? 'every' : min}, on ${fmtDow(dow)}, day ${dom === '*' ? 'every' : dom} of ${fmtMonth(month)}.`;
  };

  return (
    <div id="cron" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">⏰ Cron Expression Explainer</h3>
      <input value={expr} onChange={e => setExpr(e.target.value)} placeholder="* * * * *" className="input-field font-mono text-lg mb-3 text-center tracking-widest" />
      <div className="flex gap-1 text-center mb-4">
        {['Minute', 'Hour', 'Day', 'Month', 'Weekday'].map(l => (
          <div key={l} className="flex-1 text-xs text-slate-500">{l}</div>
        ))}
      </div>
      <div className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/20 mb-4">
        <p className="text-primary-300 text-sm">{explain(expr)}</p>
      </div>
      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Presets</p>
      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map(([label, val]) => (
          <button key={val} onClick={() => setExpr(val)} className="text-left bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 border border-white/5 transition-all">
            <div className="text-xs text-slate-300">{label}</div>
            <code className="text-xs text-primary-400 font-mono">{val}</code>
          </button>
        ))}
      </div>
    </div>
  );
}

// 12. HTTP Status Code Reference
function HttpStatusRef() {
  const CODES = [
    [200, 'OK', 'success'], [201, 'Created', 'success'], [204, 'No Content', 'success'],
    [301, 'Moved Permanently', 'redirect'], [302, 'Found', 'redirect'], [304, 'Not Modified', 'redirect'],
    [400, 'Bad Request', 'error'], [401, 'Unauthorized', 'error'], [403, 'Forbidden', 'error'],
    [404, 'Not Found', 'error'], [409, 'Conflict', 'error'], [422, 'Unprocessable Entity', 'error'], [429, 'Too Many Requests', 'error'],
    [500, 'Internal Server Error', 'server'], [502, 'Bad Gateway', 'server'], [503, 'Service Unavailable', 'server'],
  ];
  const [filter, setFilter] = useState('all');
  const colors = { success: 'text-green-400 bg-green-500/10 border-green-500/20', redirect: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', error: 'text-red-400 bg-red-500/10 border-red-500/20', server: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
  const filtered = CODES.filter(c => filter === 'all' || c[2] === filter);

  return (
    <div id="http-status" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📡 HTTP Status Codes</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'success', 'redirect', 'error', 'server'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border capitalize transition-all ${filter === f ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-2 max-h-72 overflow-auto pr-1">
        {filtered.map(([code, name, type]) => (
          <div key={code} className={`flex items-center gap-3 rounded-lg px-4 py-2.5 border ${colors[type]}`}>
            <span className="font-mono font-bold text-sm w-10 flex-shrink-0">{code}</span>
            <span className="text-sm">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 13. Text Case Converter
function CaseConverter() {
  const [text, setText] = useState('');

  const conversions = [
    ['UPPER CASE', t => t.toUpperCase()],
    ['lower case', t => t.toLowerCase()],
    ['Title Case', t => t.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())],
    ['camelCase', t => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())],
    ['PascalCase', t => t.replace(/(^\w|[^a-zA-Z0-9]\w)/g, m => m.replace(/[^a-zA-Z0-9]/, '').toUpperCase())],
    ['snake_case', t => t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')],
    ['kebab-case', t => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')],
    ['CONSTANT_CASE', t => t.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '')],
  ];

  return (
    <div id="case" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔤 Text Case Converter</h3>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter your text here..." className="input-field h-24 resize-none mb-4 text-sm" />
      <div className="space-y-2">
        {conversions.map(([label, fn]) => {
          const result = text ? fn(text) : '';
          return (
            <div key={label} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
              <span className="text-slate-400 text-xs w-32 flex-shrink-0">{label}</span>
              <code className="text-primary-400 font-mono text-xs flex-1 mx-2 truncate">{result || '—'}</code>
              {result && <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Copied!'); }} className="text-xs text-slate-500 hover:text-white transition-colors flex-shrink-0">📋</button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 14. Number Base Converter
function BaseConverter() {
  const [input, setInput] = useState('255');
  const [fromBase, setFromBase] = useState(10);

  const convert = (val, from) => {
    try {
      const dec = parseInt(val, from);
      if (isNaN(dec)) return null;
      return { bin: dec.toString(2), oct: dec.toString(8), dec: dec.toString(10), hex: dec.toString(16).toUpperCase() };
    } catch { return null; }
  };

  const result = convert(input, fromBase);

  const bases = [
    ['Binary (Base 2)', 2, 'bin'],
    ['Octal (Base 8)', 8, 'oct'],
    ['Decimal (Base 10)', 10, 'dec'],
    ['Hexadecimal (Base 16)', 16, 'hex'],
  ];

  return (
    <div id="base-conv" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔢 Number Base Converter</h3>
      <div className="mb-3">
        <label className="text-slate-400 text-xs mb-1 block">Input Base</label>
        <div className="flex gap-2 mb-3">
          {[2, 8, 10, 16].map(b => (
            <button key={b} onClick={() => setFromBase(b)}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${fromBase === b ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
              Base {b}
            </button>
          ))}
        </div>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={`Enter base-${fromBase} number`} className="input-field font-mono" />
      </div>
      {result ? (
        <div className="space-y-2 mt-4">
          {bases.map(([label, base, key]) => (
            <div key={key} className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-2.5 border border-white/5">
              <span className="text-slate-400 text-xs w-40 flex-shrink-0">{label}</span>
              <code className="text-primary-400 font-mono font-bold text-sm flex-1 text-right mr-2">{result[key]}</code>
              <button onClick={() => { navigator.clipboard.writeText(result[key]); toast.success('Copied!'); }} className="text-xs text-slate-500 hover:text-white transition-colors">📋</button>
            </div>
          ))}
        </div>
      ) : <p className="text-red-400 text-xs mt-3">Invalid number for selected base</p>}
    </div>
  );
}

// 15. HTML Entity Encoder
function HTMLEntityTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const encode = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  const run = () => setOutput(mode === 'encode' ? encode(input) : decode(input));

  return (
    <div id="html-entity" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🏷️ HTML Entity Encoder</h3>
      <div className="flex gap-2 mb-4">
        {['encode', 'decode'].map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${mode === m ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {m}
          </button>
        ))}
      </div>
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? '<div class="hello">Hello & World</div>' : '&lt;div&gt;Hello &amp; World&lt;/div&gt;'} className="input-field font-mono text-sm h-28 resize-none mb-3" />
      <button onClick={run} className="btn-primary w-full mb-3">{mode === 'encode' ? 'Encode HTML Entities' : 'Decode HTML Entities'}</button>
      {output && (
        <div className="relative">
          <pre className="bg-white/5 rounded-xl p-4 text-green-400 font-mono text-xs overflow-auto max-h-40 border border-white/10 whitespace-pre-wrap break-all">{output}</pre>
          <button onClick={() => { navigator.clipboard.writeText(output); toast.success('Copied!'); }} className="absolute top-3 right-3 text-xs btn-outline py-1 px-2">Copy</button>
        </div>
      )}
    </div>
  );
}

// 16. JWT Decoder
function JWTDecoder() {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');

  const decode = () => {
    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) throw new Error('JWT must have 3 parts separated by dots');
      const base64Decode = str => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
      setDecoded({ header: base64Decode(parts[0]), payload: base64Decode(parts[1]), signature: parts[2] });
      setError('');
    } catch (e) {
      setError(e.message);
      setDecoded(null);
    }
  };

  const isExpired = decoded?.payload?.exp ? decoded.payload.exp * 1000 < Date.now() : false;

  return (
    <div id="jwt" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-2">🔓 JWT Decoder</h3>
      <p className="text-slate-500 text-xs mb-4">Decodes client-side only. Never paste production secrets.</p>
      <textarea value={token} onChange={e => setToken(e.target.value)} placeholder="Paste JWT token here (eyJ...)" className="input-field font-mono text-xs h-24 resize-none mb-3" />
      {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
      <button onClick={decode} className="btn-primary w-full mb-4">Decode JWT</button>
      {decoded && (
        <div className="space-y-3">
          {decoded.payload?.exp && (
            <div className={`rounded-lg px-4 py-2 text-xs font-semibold ${isExpired ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
              {isExpired ? '⚠ Token is EXPIRED' : `✓ Valid until ${new Date(decoded.payload.exp * 1000).toLocaleString()}`}
            </div>
          )}
          {[['Header', decoded.header], ['Payload', decoded.payload]].map(([label, data]) => (
            <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-primary-400 font-semibold mb-2">{label}</p>
              <pre className="text-green-400 font-mono text-xs overflow-auto max-h-40">{JSON.stringify(data, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 17. Diff Checker
function DiffChecker() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diff, setDiff] = useState([]);

  const compute = () => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const result = [];
    const maxLen = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i]; const b = linesB[i];
      if (a === undefined) result.push({ type: 'add', line: b, num: i + 1 });
      else if (b === undefined) result.push({ type: 'remove', line: a, num: i + 1 });
      else if (a === b) result.push({ type: 'same', line: a, num: i + 1 });
      else { result.push({ type: 'remove', line: a, num: i + 1 }); result.push({ type: 'add', line: b, num: i + 1 }); }
    }
    setDiff(result);
  };

  const colors = { same: 'text-slate-400', add: 'bg-green-500/10 text-green-400', remove: 'bg-red-500/10 text-red-400' };
  const prefix = { same: ' ', add: '+', remove: '-' };

  return (
    <div id="diff" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🔀 Text Diff Checker</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <textarea value={textA} onChange={e => setTextA(e.target.value)} placeholder="Original text..." className="input-field font-mono text-xs h-32 resize-none" />
        <textarea value={textB} onChange={e => setTextB(e.target.value)} placeholder="Modified text..." className="input-field font-mono text-xs h-32 resize-none" />
      </div>
      <button onClick={compute} className="btn-primary w-full mb-4">Compare</button>
      {diff.length > 0 && (
        <div className="bg-black/20 rounded-xl border border-white/10 overflow-auto max-h-64 font-mono text-xs p-3 space-y-0.5">
          {diff.map((d, i) => (
            <div key={i} className={`px-2 py-0.5 rounded flex gap-2 ${colors[d.type]}`}>
              <span className="w-4 flex-shrink-0 text-slate-600">{d.num}</span>
              <span className="w-4 flex-shrink-0">{prefix[d.type]}</span>
              <span className="flex-1 whitespace-pre">{d.line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 18. Aspect Ratio Calculator
function AspectRatioCalc() {
  const [w, setW] = useState('1920');
  const [h, setH] = useState('1080');
  const [newW, setNewW] = useState('');
  const [newH, setNewH] = useState('');

  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const g = gcd(parseInt(w) || 1, parseInt(h) || 1);
  const ratio = `${(parseInt(w) || 0) / g}:${(parseInt(h) || 0) / g}`;

  const calcH = () => { if (w && h && newW) setNewH(String(Math.round((parseInt(newW) * parseInt(h)) / parseInt(w)))); };
  const calcW = () => { if (w && h && newH) setNewW(String(Math.round((parseInt(newH) * parseInt(w)) / parseInt(h)))); };

  const PRESETS = [['16:9', 1920, 1080], ['4:3', 1024, 768], ['1:1', 1080, 1080], ['9:16', 1080, 1920], ['21:9', 2560, 1080], ['3:2', 1500, 1000]];

  return (
    <div id="aspect-ratio" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📺 Aspect Ratio Calculator</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-slate-400 text-xs mb-1 block">Width (px)</label><input value={w} onChange={e => setW(e.target.value)} className="input-field font-mono" /></div>
        <div><label className="text-slate-400 text-xs mb-1 block">Height (px)</label><input value={h} onChange={e => setH(e.target.value)} className="input-field font-mono" /></div>
      </div>
      <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 text-center mb-4">
        <span className="text-primary-300 font-display font-bold text-xl">{ratio}</span>
        <span className="text-slate-500 text-xs ml-2">aspect ratio</span>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div><label className="text-slate-400 text-xs mb-1 block">New Width</label><input value={newW} onChange={e => setNewW(e.target.value)} className="input-field font-mono" /></div>
        <div><label className="text-slate-400 text-xs mb-1 block">New Height</label><input value={newH} onChange={e => setNewH(e.target.value)} className="input-field font-mono" /></div>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={calcH} className="btn-outline flex-1 text-xs">Calculate Height →</button>
        <button onClick={calcW} className="btn-outline flex-1 text-xs">← Calculate Width</button>
      </div>
      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Common Presets</p>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map(([label, pw, ph]) => (
          <button key={label} onClick={() => { setW(String(pw)); setH(String(ph)); }}
            className="bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 border border-white/5 text-xs text-center transition-all">
            <div className="font-bold text-white">{label}</div>
            <div className="text-slate-500">{pw}×{ph}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 19. Readability Score Checker
function ReadabilityChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const analyze = () => {
    if (!text.trim()) { toast.error('Enter some text first'); return; }
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length || 1;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length || 1;
    const syllables = words.reduce((acc, w) => acc + Math.max(1, w.replace(/[^aeiouy]/gi, '').length), 0);
    const avgSylPerWord = syllables / wordCount;
    const avgWordPerSent = wordCount / sentences;
    const flesch = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * avgWordPerSent - 84.6 * avgSylPerWord)));
    const gradeRaw = 0.39 * avgWordPerSent + 11.8 * avgSylPerWord - 15.59;
    const grade = Math.max(1, Math.min(16, Math.round(gradeRaw)));
    const level = flesch > 70 ? 'Easy' : flesch > 50 ? 'Standard' : flesch > 30 ? 'Difficult' : 'Very Difficult';
    const color = flesch > 70 ? 'text-green-400' : flesch > 50 ? 'text-yellow-400' : 'text-red-400';
    setResult({ flesch, grade, level, color, wordCount, sentences, avgWordPerSent: avgWordPerSent.toFixed(1) });
  };

  return (
    <div id="readability" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">📊 Readability Checker</h3>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your content to analyze readability..." className="input-field h-32 resize-none mb-3 text-sm" />
      <button onClick={analyze} className="btn-primary w-full mb-4">Analyze Readability</button>
      {result && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
              <div className={`font-display font-extrabold text-3xl ${result.color}`}>{result.flesch}</div>
              <div className="text-xs text-slate-500 mt-1">Flesch Score</div>
              <div className={`text-xs font-semibold mt-1 ${result.color}`}>{result.level}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
              <div className="font-display font-extrabold text-3xl text-primary-400">G{result.grade}</div>
              <div className="text-xs text-slate-500 mt-1">Grade Level</div>
              <div className="text-xs text-slate-400 mt-1">US School Grade</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[['Words', result.wordCount], ['Sentences', result.sentences], ['Avg Words/Sent', result.avgWordPerSent]].map(([l, v]) => (
              <div key={l} className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
                <div className="font-bold text-white text-sm">{v}</div>
                <div className="text-slate-500 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 20. Meta Tag Generator
function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const t = title || 'Your Page Title';
    const d = description || 'Your page description';
    return `<!-- Primary Meta Tags -->
<title>${t}</title>
<meta name="title" content="${t}" />
<meta name="description" content="${d}" />
${keywords ? `<meta name="keywords" content="${keywords}" />\n` : ''
}<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url || 'https://yoursite.com/'}" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
${image ? `<meta property="og:image" content="${image}" />\n` : ''}
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${url || 'https://yoursite.com/'}" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
${image ? `<meta name="twitter:image" content="${image}" />` : ''}`.trim();
  };

  const output = generate();
  const handleCopy = () => { navigator.clipboard.writeText(output); toast.success('Meta tags copied!'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const titleLen = title.length;
  const descLen = description.length;

  return (
    <div id="meta" className="card p-6">
      <h3 className="font-display font-bold text-white text-xl mb-5">🏷️ Meta Tag Generator</h3>
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-slate-400 text-xs">Page Title</label>
            <span className={`text-xs ${titleLen > 60 ? 'text-red-400' : titleLen > 50 ? 'text-yellow-400' : 'text-slate-500'}`}>{titleLen}/60</span>
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Page" className="input-field text-sm" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-slate-400 text-xs">Meta Description</label>
            <span className={`text-xs ${descLen > 160 ? 'text-red-400' : descLen > 140 ? 'text-yellow-400' : 'text-slate-500'}`}>{descLen}/160</span>
          </div>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A brief description of your page for search engines..." className="input-field text-sm h-20 resize-none" />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Keywords (comma-separated)</label>
          <input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="react, javascript, web dev" className="input-field text-sm" />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">Canonical URL</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yoursite.com/page" className="input-field text-sm font-mono" />
        </div>
        <div>
          <label className="text-slate-400 text-xs mb-1 block">OG Image URL</label>
          <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://yoursite.com/og-image.png" className="input-field text-sm font-mono" />
        </div>
      </div>
      <div className="relative">
        <pre className="bg-white/5 rounded-xl p-4 text-green-400 font-mono text-xs overflow-auto max-h-56 border border-white/10 whitespace-pre-wrap">{output}</pre>
        <button onClick={handleCopy} className={`absolute top-3 right-3 text-xs py-1 px-2 rounded-lg border transition-all ${copied ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'btn-outline'}`}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const TABS = [
    { id: 'all',         label: '🧰 All' },
    { id: 'password',    label: '🔐 Password' },
    { id: 'json',        label: '📄 JSON' },
    { id: 'words',       label: '📝 Words' },
    { id: 'image',       label: '🖼️ Image' },
    { id: 'resume',      label: '🤖 Resume AI' },
    { id: 'encode',      label: '🔁 Encode' },
    { id: 'colors',      label: '🎨 Colors' },
    { id: 'time',        label: '⏱️ Time' },
    { id: 'code',        label: '💻 Code' },
    { id: 'text',        label: '🔤 Text' },
    { id: 'web',         label: '🌐 Web' },
  ];

  // Map tabs to which tool IDs are visible
  const isVisible = (toolTab) => activeTab === 'all' || activeTab === toolTab;

  return (
    <>
      <SEO
        title="Free Developer Tools"
        description="25+ free browser-based developer tools: password generator, JSON formatter, regex tester, color picker, JWT decoder, diff checker, and more."
        keywords="free developer tools, password generator, JSON formatter, regex tester, color picker, JWT decoder, diff checker, word counter, image compressor, resume analyzer"
      />
      <div className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-accent-400 font-semibold text-sm uppercase tracking-wider mb-2">⚙️ Free Utilities</div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-4">
              Free <span className="gradient-text">Developer Tools</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              25+ browser-based utilities that work instantly — no signup required. 100% free.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${activeTab === tab.id ? 'bg-primary-500 border-primary-500 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <AdBanner slot="inline" className="mb-8" />

          <div className="grid grid-cols-1 gap-6">
            {/* Original 5 tools */}
            {isVisible('password')  && <PasswordGenerator />}
            {isVisible('json')      && <JSONFormatter />}
            {isVisible('words')     && <WordCounter />}
            {isVisible('image')     && <ImageCompressor />}
            {isVisible('resume')    && <ResumeAnalyzer />}

            {/* Encode / Decode group */}
            {isVisible('encode')    && <Base64Tool />}
            {isVisible('encode')    && <URLEncoderTool />}
            {isVisible('encode')    && <HashGenerator />}
            {isVisible('encode')    && <HTMLEntityTool />}
            {isVisible('encode')    && <JWTDecoder />}

            {/* Colors & Time group */}
            {isVisible('colors')    && <ColorConverter />}
            {isVisible('colors')    && <CSSUnitsConverter />}
            {isVisible('colors')    && <AspectRatioCalc />}
            {isVisible('time')      && <TimestampConverter />}
            {isVisible('time')      && <CronExplainer />}

            {/* Code group */}
            {isVisible('code')      && <RegexTester />}
            {isVisible('code')      && <UUIDGenerator />}
            {isVisible('code')      && <BaseConverter />}
            {isVisible('code')      && <HttpStatusRef />}
            {isVisible('code')      && <DiffChecker />}

            {/* Text & Web group */}
            {isVisible('text')      && <CaseConverter />}
            {isVisible('text')      && <LoremGenerator />}
            {isVisible('text')      && <MarkdownPreviewer />}
            {isVisible('text')      && <ReadabilityChecker />}
            {isVisible('web')       && <MetaTagGenerator />}
          </div>

        </div>
      </div>
    </>
  );
}