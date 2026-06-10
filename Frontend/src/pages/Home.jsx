import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Search, Sparkles, Code, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';

// Dynamic Icon rendering helper
const DynamicIcon = ({ name, className, size = 24 }) => {
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent className={className} size={size} />;
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/categories`).then(res => res.json()),
      fetch(`${API_URL}/snippets`).then(res => res.json())
    ])
      .then(([cats, snips]) => {
        if (Array.isArray(cats)) setCategories(cats);
        if (Array.isArray(snips)) setSnippets(snips);
      })
      .catch(err => console.error("Error loading home page data:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Filter categories or search snippets
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSnippetCount = (catId) => {
    return snippets.filter(s => s.category_id === catId).length;
  };

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center relative py-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-purple-600/10 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-indigo-600/10 blur-[80px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles size={12} />
            Ultimate UI Library
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Build Faster with <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Curated UI Elements
            </span>
          </h1>
          
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong className="text-white">SnippetBox</strong>, your interactive frontend code library. Browse categorized pages of responsive UI elements—from buttons and cards to custom animations. Interact with them live in sandboxed previews, toggle between code syntaxes (Tailwind, React JSX, HTML/CSS, or JS), and copy ready-made assets instantly.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto relative group mt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-md opacity-20 group-hover:opacity-35 transition-opacity duration-300" />
            <div className="relative flex items-center bg-[#0d0d15]/80 border border-white/5 rounded-2xl overflow-hidden px-4">
              <Search className="text-gray-500 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search categories (e.g. Buttons, Cards)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 py-4 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Pages / Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Code size={18} className="text-indigo-400" />
              Explore Components By Page
            </h2>
            <p className="text-xs text-gray-400">Select a page category to view and copy specific layout codes.</p>
          </div>
          <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-gray-400 font-mono">
            {filteredCategories.length} categories
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card rounded-2xl p-6 h-40 animate-pulse border border-white/5 bg-white/5" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm">No pages found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <Link
                key={cat._id}
                to={`/category/${cat._id}`}
                className="glass-card hover:bg-[#121220]/60 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 block relative overflow-hidden"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between">
                  <div className="bg-white/5 group-hover:bg-indigo-500/10 border border-white/10 group-hover:border-indigo-500/20 p-3.5 rounded-xl text-gray-400 group-hover:text-indigo-400 transition-all duration-300">
                    <DynamicIcon name={cat.icon} />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 group-hover:bg-indigo-500/15 text-gray-400 group-hover:text-indigo-300 transition-colors">
                    {getSnippetCount(cat._id)} Snippets
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    Interactive components list for {cat.name.toLowerCase()}. Render templates and extract ready-made assets.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  Browse items
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}