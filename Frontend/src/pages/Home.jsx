import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Search, Sparkles, Code, ArrowRight } from 'lucide-react';
import IframePreview from '../components/IframePreview';
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

  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [modalActiveTab, setModalActiveTab] = useState('');
  const [modalBgTheme, setModalBgTheme] = useState('dark');
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('snippetbox_bookmarks') || '[]'));

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

  useEffect(() => {
    const handleStorage = () => {
      setBookmarks(JSON.parse(localStorage.getItem('snippetbox_bookmarks') || '[]'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleBookmark = (snippetId) => {
    let nextBookmarks = [...bookmarks];
    if (nextBookmarks.includes(snippetId)) {
      nextBookmarks = nextBookmarks.filter(id => id !== snippetId);
    } else {
      nextBookmarks.push(snippetId);
    }
    setBookmarks(nextBookmarks);
    localStorage.setItem('snippetbox_bookmarks', JSON.stringify(nextBookmarks));
    window.dispatchEvent(new Event('storage'));
  };

  const handleCopy = (snippet, langKey) => {
    let copyText = '';
    if (langKey === 'html') {
      copyText = snippet.htmlCode;
      if (snippet.cssCode) {
        copyText = `<!-- HTML -->\n${snippet.htmlCode}\n\n/* CSS */\n<style>\n${snippet.cssCode}\n</style>`;
      }
    } else if (langKey === 'tailwind') {
      copyText = snippet.tailwindCode;
    } else if (langKey === 'react') {
      copyText = snippet.reactCode;
    } else if (langKey === 'js') {
      copyText = snippet.jsCode;
    }

    navigator.clipboard.writeText(copyText)
      .then(() => {
        setCopiedSnippetId(snippet._id);
        setTimeout(() => setCopiedSnippetId(null), 2000);
      })
      .catch(err => console.error("Failed to copy:", err));
  };

  const getLanguageTabs = (snip) => {
    if (!snip) return [];
    const tabs = [];
    if (snip.tailwindCode) tabs.push({ key: 'tailwind', label: 'Tailwind CSS' });
    if (snip.htmlCode || snip.cssCode) tabs.push({ key: 'html', label: 'HTML & CSS' });
    if (snip.reactCode) tabs.push({ key: 'react', label: 'React JSX' });
    if (snip.jsCode) tabs.push({ key: 'js', label: 'JavaScript' });
    return tabs;
  };

  const getCodeContent = (snip, activeTab) => {
    if (!snip) return '';
    if (activeTab === 'html') {
      return snip.cssCode 
        ? `${snip.htmlCode}\n\n/* Custom Styles */\n${snip.cssCode}`
        : snip.htmlCode;
    }
    if (activeTab === 'tailwind') return snip.tailwindCode;
    if (activeTab === 'react') return snip.reactCode;
    if (activeTab === 'js') return snip.jsCode;
    return '';
  };

  const openSnippetModal = (snip) => {
    setSelectedSnippet(snip);
    const tabs = getLanguageTabs(snip);
    if (tabs.length > 0) {
      setModalActiveTab(tabs[0].key);
    }
  };

  // Filter categories or search snippets
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSnippets = snippets.filter(snip =>
    snip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (snip.description && snip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const bookmarkedSnippets = snippets.filter(s => bookmarks.includes(s._id));

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
            <Icons.Sparkles size={12} />
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
              <Icons.Search className="text-gray-500 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search categories or elements (e.g. Buttons, glow)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 py-4 px-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
        </div>
      </section>

      {!searchQuery ? (
        <>
          {/* Grid of Pages / Categories */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Icons.Code size={18} className="text-indigo-400" />
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
                      <Icons.ArrowRight size={12} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Bookmarked Snippets Catalog */}
          {bookmarkedSnippets.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Icons.Heart className="text-pink-500" size={18} fill="currentColor" />
                    Your Bookmarked Snippets
                  </h2>
                  <p className="text-xs text-gray-400">Your quick-access, saved components catalog.</p>
                </div>
                <span className="text-xs bg-white/5 px-2.5 py-1 rounded-full text-gray-400 font-mono">
                  {bookmarkedSnippets.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedSnippets.map((snip) => (
                  <div
                    key={snip._id}
                    onClick={() => openSnippetModal(snip)}
                    className="glass-card hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between h-52 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-300 transition-colors truncate">{snip.title}</h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(snip._id);
                            }}
                            className="p-1 rounded-lg border text-pink-500 border-pink-500/20 bg-pink-500/10 transition-all cursor-pointer hover:bg-white/5"
                            title="Remove Bookmark"
                          >
                            <Icons.Heart size={12} fill="currentColor" />
                          </button>
                          <Icons.Eye size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {snip.description && (
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 leading-relaxed">{snip.description}</p>
                      )}
                    </div>

                    <div className="flex-1 flex items-center justify-center overflow-hidden pointer-events-none mt-2 select-none">
                      <div className="scale-90 origin-center transition-transform group-hover:scale-95 duration-300">
                        <IframePreview
                          htmlCode={snip.htmlCode}
                          cssCode={snip.cssCode}
                          jsCode={snip.jsCode}
                          tailwindCode={snip.tailwindCode}
                          height="90px"
                        />
                      </div>
                    </div>

                    <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 text-right mt-2 group-hover:text-indigo-400 transition-colors">
                      View & Copy Code
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        /* Search Layout */
        <div className="space-y-12">
          {/* Matching Categories */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Icons.FolderPlus size={18} className="text-indigo-400" />
                  Matching Pages ({filteredCategories.length})
                </h2>
                <p className="text-xs text-gray-400">Navigation categories matching your search query.</p>
              </div>
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 glass-card rounded-2xl border border-white/5">
                <p className="text-gray-500 text-xs">No pages found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat._id}`}
                    className="glass-card hover:bg-[#121220]/60 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-1 block relative overflow-hidden"
                  >
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
                        Explore matching elements on the {cat.name} page.
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Matching Snippets */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Icons.FileCode size={18} className="text-indigo-400" />
                  Matching Components ({filteredSnippets.length})
                </h2>
                <p className="text-xs text-gray-400">UI library items matching your search query.</p>
              </div>
            </div>

            {filteredSnippets.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
                <p className="text-gray-500 text-xs">No UI components found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSnippets.map((snip) => (
                  <div
                    key={snip._id}
                    onClick={() => openSnippetModal(snip)}
                    className="glass-card hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between h-52 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-300 transition-colors truncate">{snip.title}</h3>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(snip._id);
                            }}
                            className={`p-1 rounded-lg border transition-all cursor-pointer hover:bg-white/5 ${
                              bookmarks.includes(snip._id)
                                ? 'text-pink-500 border-pink-500/20 bg-pink-500/10'
                                : 'text-gray-500 border-transparent hover:text-gray-300'
                            }`}
                            title={bookmarks.includes(snip._id) ? "Remove Bookmark" : "Bookmark Snippet"}
                          >
                            <Icons.Heart size={12} fill={bookmarks.includes(snip._id) ? "currentColor" : "none"} />
                          </button>
                          <Icons.Eye size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      {snip.description && (
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 leading-relaxed">{snip.description}</p>
                      )}
                    </div>

                    <div className="flex-1 flex items-center justify-center overflow-hidden pointer-events-none mt-2 select-none">
                      <div className="scale-90 origin-center transition-transform group-hover:scale-95 duration-300">
                        <IframePreview
                          htmlCode={snip.htmlCode}
                          cssCode={snip.cssCode}
                          jsCode={snip.jsCode}
                          tailwindCode={snip.tailwindCode}
                          height="90px"
                        />
                      </div>
                    </div>

                    <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 text-right mt-2 group-hover:text-indigo-400 transition-colors">
                      View & Copy Code
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Google Images style Detail Overlay Modal */}
      {selectedSnippet && (
        <div 
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedSnippet(null); }}
          className="fixed inset-0 bg-[#020205]/95 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
        >
          <div className="relative glass-panel max-w-5xl w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col lg:flex-row h-[90vh] lg:h-[500px] max-h-[90vh] animate-scale-up">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedSnippet(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer z-10"
              title="Close View"
            >
              <Icons.X size={16} />
            </button>

            {/* Left Panel: Large Interactive Preview Sandbox */}
            <div className="lg:w-1/2 p-6 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-white/5 bg-[#08080e]/40 h-1/2 lg:h-full relative">
              <span className="absolute top-4 left-6 text-[9px] font-bold uppercase tracking-widest text-indigo-400/80 flex items-center gap-1.5 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                Sandbox Element View
              </span>
              
              <div className="w-full max-w-sm flex items-center justify-center">
                <IframePreview
                  htmlCode={selectedSnippet.htmlCode}
                  cssCode={selectedSnippet.cssCode}
                  jsCode={selectedSnippet.jsCode}
                  tailwindCode={selectedSnippet.tailwindCode}
                  height="220px"
                  theme={modalBgTheme}
                />
              </div>

              {/* Background Theme Switcher */}
              <div className="flex items-center gap-1 bg-[#050508] p-0.5 border border-white/5 rounded-lg mt-3 self-center shadow-inner select-none">
                {['dark', 'light', 'grid'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setModalBgTheme(t)}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      modalBgTheme === t
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              
              <span className="text-[9px] text-gray-500 mt-2.5 text-center select-none">
                Hover or click component to interact live. entry states repeat automatically.
              </span>
            </div>

            {/* Right Panel: Snippet details, Copy Tabs, and Preformated Code block */}
            <div className="lg:w-1/2 flex flex-col bg-[#06060c] h-1/2 lg:h-full">
              
              {/* Header Details */}
              <div className="p-6 border-b border-white/5 shrink-0">
                <h2 className="text-base sm:text-lg font-black text-white">{selectedSnippet.title}</h2>
                {selectedSnippet.description && (
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{selectedSnippet.description}</p>
                )}
              </div>

              {/* Tabs selector row and copy trigger */}
              {(() => {
                const tabs = getLanguageTabs(selectedSnippet);
                const activeTab = modalActiveTab || tabs[0]?.key;
                
                return (
                  <>
                    <div className="border-b border-white/5 px-6 py-2.5 flex items-center justify-between shrink-0 bg-[#0a0a10]/50">
                      {tabs.length > 0 && (
                        <div className="flex items-center gap-1 bg-[#050508] p-0.5 border border-white/5 rounded-lg">
                          {tabs.map((tab) => (
                            <button
                              key={tab.key}
                              onClick={() => setModalActiveTab(tab.key)}
                              className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                                activeTab === tab.key
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-gray-400 hover:text-gray-200'
                              }`}
                            >
                              {tab.label.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(selectedSnippet._id)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            bookmarks.includes(selectedSnippet._id)
                              ? 'bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20'
                              : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          <Icons.Heart size={12} fill={bookmarks.includes(selectedSnippet._id) ? "currentColor" : "none"} />
                          {bookmarks.includes(selectedSnippet._id) ? 'Bookmarked' : 'Bookmark'}
                        </button>

                        <button
                          onClick={() => handleCopy(selectedSnippet, activeTab)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                            copiedSnippetId === selectedSnippet._id
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 text-gray-300'
                          }`}
                        >
                          {copiedSnippetId === selectedSnippet._id ? (
                            <>
                              <Icons.Check size={12} className="text-emerald-400 animate-scale-up" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Icons.Copy size={12} />
                              Copy Code
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Pre-formatted Code scroll container */}
                    <div className="flex-1 p-6 overflow-auto font-mono text-[10px] text-indigo-300/80 leading-relaxed scrollbar-thin scrollbar-thumb-indigo-950 scrollbar-track-transparent">
                      {getCodeContent(selectedSnippet, activeTab) ? (
                        <pre className="whitespace-pre select-all">{getCodeContent(selectedSnippet, activeTab)}</pre>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-6">
                          <Icons.Terminal size={20} className="opacity-30 mb-2" />
                          <p className="text-[10px]">No code provided for this format</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}