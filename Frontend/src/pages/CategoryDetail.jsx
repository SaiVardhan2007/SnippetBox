import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ArrowLeft, Copy, Check, Terminal, Code, X, Sparkles, ChevronRight, Eye } from 'lucide-react';
import IframePreview from '../components/IframePreview';
import { API_URL } from '../config';

const DynamicIcon = ({ name, className, size = 18 }) => {
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent className={className} size={size} />;
};

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const [cardThemes, setCardThemes] = useState({});
  
  // Selected snippet for the Google Images style detail popup
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [modalActiveTab, setModalActiveTab] = useState(''); // Active tab in the modal: 'tailwind', 'html', etc.
  const [modalBgTheme, setModalBgTheme] = useState('dark'); // 'dark' | 'light' | 'grid'
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('snippetbox_bookmarks') || '[]'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    setIsLoading(true);
  }

  useEffect(() => {
    const handleStorage = () => {
      setBookmarks(JSON.parse(localStorage.getItem('snippetbox_bookmarks') || '[]'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'IFRAME_CLICK') {
        const found = snippets.find(s => s._id === e.data.snippetId);
        if (found) {
          openSnippetModal(found);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [snippets]);

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

  useEffect(() => {
    // Fetch current category
    fetch(`${API_URL}/categories/${id}`)
      .then(res => res.json())
      .then(cat => setCategory(cat))
      .catch(err => console.error("Error fetching category:", err));

    // Fetch all categories for sub-navigation
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllCategories(data);
      })
      .catch(err => console.error("Error loading categories:", err));

    // Fetch snippets
    fetch(`${API_URL}/snippets?category_id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSnippets(data);
      })
      .catch(err => console.error("Error loading snippets:", err))
      .finally(() => setIsLoading(false));
  }, [id]);

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

  const filteredSnippets = snippets.filter(snip =>
    snip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (snip.description && snip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 py-2 animate-fade-in relative">
      
      {/* Category Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <Link to="/" className="inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-indigo-400 uppercase tracking-widest font-bold transition-colors">
            <ArrowLeft size={10} />
            Back to Categories
          </Link>
          <div className="flex items-center gap-3">
            {category && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl text-indigo-400">
                <DynamicIcon name={category.icon} size={18} />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-black text-[var(--title-color)]">{category ? category.name : 'Loading...'}</h1>
          </div>
        </div>

        <div className="relative w-full sm:w-60">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-3 pr-9 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
          />
          <Terminal size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Horizontal Page Navigation (Positioned "Little Down" & Swipable Left-to-Right) */}
      {allCategories.length > 0 && (
        <div className="relative border-b border-white/5 pb-5 pt-2">
          {/* Swipable navigation pills */}
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none no-scrollbar py-1 scroll-smooth w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mr-2 shrink-0 select-none">Jump to page:</span>
            {allCategories.map(cat => (
              <Link
                key={cat._id}
                to={`/category/${cat._id}`}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 select-none ${
                  cat._id === id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/10'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          {/* Subtle gradient scroll indicator on right */}
          <div className="absolute right-0 top-0 bottom-5 w-12 bg-gradient-to-l from-[#050508] to-transparent pointer-events-none" />
        </div>
      )}

      {/* Grid of Compact Snippet Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card rounded-2xl p-6 h-48 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredSnippets.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/5">
          <p className="text-gray-400 text-sm">No snippets found on this page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snip) => (
            <div
              key={snip._id}
              onClick={() => openSnippetModal(snip)}
              className="glass-card hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between h-52 group relative overflow-hidden"
            >
              {/* Highlight gradient indicator */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-[var(--title-color)] group-hover:text-indigo-300 transition-colors truncate">{snip.title}</h3>
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
                    <Eye size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                {snip.description && (
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 leading-relaxed">{snip.description}</p>
                )}
              </div>

              {/* Natural Component Size Sandbox Preview (Centering component cleanly at standard size) */}
              <div className="flex-1 flex items-center justify-center overflow-hidden mt-2 select-none">
                <div className="scale-90 origin-center transition-transform group-hover:scale-95 duration-300">
                  <IframePreview
                    htmlCode={snip.htmlCode}
                    cssCode={snip.cssCode}
                    jsCode={snip.jsCode}
                    tailwindCode={snip.tailwindCode}
                    height="90px"
                    snippetId={snip._id}
                    theme={cardThemes[snip._id] || 'dark'}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 select-none relative z-10">
                {/* Background theme toggle for preview */}
                <div className="flex items-center gap-1 bg-black/20 dark:bg-black/40 border border-white/5 rounded-lg p-0.5">
                  {['dark', 'light', 'grid'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Avoid opening modal
                        setCardThemes(prev => ({ ...prev, [snip._id]: t }));
                      }}
                      className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                        (cardThemes[snip._id] || 'dark') === t
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                      title={`${t.charAt(0).toUpperCase() + t.slice(1)} Preview Theme`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 group-hover:text-indigo-400 transition-colors">
                  View & Copy Code
                </div>
              </div>
            </div>
          ))}
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
              <X size={16} />
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
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {category ? category.name : 'Component'}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-[var(--title-color)] mt-1.5">{selectedSnippet.title}</h2>
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
                              <Check size={12} className="text-emerald-400 animate-scale-up" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
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
                          <Terminal size={20} className="opacity-30 mb-2" />
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
