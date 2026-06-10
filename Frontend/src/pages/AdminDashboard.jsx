import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Plus, Edit, Trash2, FolderPlus, FileCode, Check, AlertCircle, X, ChevronRight, Sparkles } from 'lucide-react';
import { API_URL } from '../config';

const DynamicIcon = ({ name, className, size = 18 }) => {
  const IconComponent = Icons[name] || Icons.Code;
  return <IconComponent className={className} size={size} />;
};

const POPULAR_ICONS = [
  'MousePointerClick', 'Layers', 'Palette', 'Terminal', 'Tv', 'Layout', 'Grid', 'SquarePlay', 
  'Sliders', 'Sparkles', 'Activity', 'Play', 'Code', 'Menu', 'FileText', 'HandClick', 'Cpu'
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'snippets'
  const [categories, setCategories] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Category Form State
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('MousePointerClick');
  const [isEditingCat, setIsEditingCat] = useState(false);

  // Snippet Form State
  const [snipId, setSnipId] = useState('');
  const [snipTitle, setSnipTitle] = useState('');
  const [snipDescription, setSnipDescription] = useState('');
  const [snipCategoryId, setSnipCategoryId] = useState('');
  const [snipHtml, setSnipHtml] = useState('');
  const [snipCss, setSnipCss] = useState('');
  const [snipTailwind, setSnipTailwind] = useState('');
  const [snipReact, setSnipReact] = useState('');
  const [snipJs, setSnipJs] = useState('');
  const [isEditingSnip, setIsEditingSnip] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!token || !isAdmin) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const catRes = await fetch(`${API_URL}/categories`);
      const catData = await catRes.json();
      if (Array.isArray(catData)) setCategories(catData);

      const snipRes = await fetch(`${API_URL}/snippets`);
      const snipData = await snipRes.json();
      if (Array.isArray(snipData)) setSnippets(snipData);
    } catch (err) {
      showMsg('Failed to load database content.', 'error');
    }
  };

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  // --- Category CRUD ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catName || !catIcon) {
      showMsg('Please fill all category fields.', 'error');
      return;
    }

    const url = isEditingCat 
      ? `${API_URL}/categories/${catId}` 
      : `${API_URL}/categories`;
    const method = isEditingCat ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({ name: catName, icon: catIcon })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error saving category');
      
      showMsg(isEditingCat ? 'Category updated!' : 'Category created successfully!');
      resetCatForm();
      fetchData();
    } catch (err) {
      showMsg(err.message, 'error');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Deleting this category will unlink its snippets. Are you sure?')) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete category');
      showMsg('Category deleted successfully.');
      fetchData();
    } catch (err) {
      showMsg(err.message, 'error');
    }
  };

  const startEditCategory = (cat) => {
    setCatId(cat._id);
    setCatName(cat.name);
    setCatIcon(cat.icon);
    setIsEditingCat(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetCatForm = () => {
    setCatId('');
    setCatName('');
    setCatIcon('MousePointerClick');
    setIsEditingCat(false);
  };

  // --- Snippet CRUD ---
  const handleSnippetSubmit = async (e) => {
    e.preventDefault();
    if (!snipTitle || !snipCategoryId) {
      showMsg('Title and Category are mandatory fields.', 'error');
      return;
    }

    const payload = {
      title: snipTitle,
      description: snipDescription,
      category_id: snipCategoryId,
      htmlCode: snipHtml,
      cssCode: snipCss,
      tailwindCode: snipTailwind,
      reactCode: snipReact,
      jsCode: snipJs
    };

    const url = isEditingSnip 
      ? `${API_URL}/snippets/${snipId}` 
      : `${API_URL}/snippets`;
    const method = isEditingSnip ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Error saving snippet');

      showMsg(isEditingSnip ? 'Snippet updated!' : 'Snippet added successfully!');
      resetSnipForm();
      fetchData();
    } catch (err) {
      showMsg(err.message, 'error');
    }
  };

  const deleteSnippet = async (id) => {
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;
    try {
      const res = await fetch(`${API_URL}/snippets/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete snippet');
      showMsg('Snippet deleted successfully.');
      fetchData();
    } catch (err) {
      showMsg(err.message, 'error');
    }
  };

  const startEditSnippet = (snip) => {
    setSnipId(snip._id);
    setSnipTitle(snip.title);
    setSnipDescription(snip.description || '');
    setSnipCategoryId(snip.category_id);
    setSnipHtml(snip.htmlCode || '');
    setSnipCss(snip.cssCode || '');
    setSnipTailwind(snip.tailwindCode || '');
    setSnipReact(snip.reactCode || '');
    setSnipJs(snip.jsCode || '');
    setIsEditingSnip(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetSnipForm = () => {
    setSnipId('');
    setSnipTitle('');
    setSnipDescription('');
    setSnipCategoryId('');
    setSnipHtml('');
    setSnipCss('');
    setSnipTailwind('');
    setSnipReact('');
    setSnipJs('');
    setIsEditingSnip(false);
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c._id === catId);
    return cat ? cat.name : 'Unknown Category';
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={24} />
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-400">Configure public navigation categories and UI code repositories.</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 bg-[#0d0d15] p-1 border border-white/5 rounded-xl shrink-0">
          <button
            onClick={() => { setActiveTab('categories'); resetCatForm(); resetSnipForm(); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FolderPlus size={14} />
            Pages (Categories)
          </button>
          <button
            onClick={() => { setActiveTab('snippets'); resetCatForm(); resetSnipForm(); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'snippets'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FileCode size={14} />
            Content (Snippets)
          </button>
        </div>
      </div>

      {/* Global Notifications */}
      {message.text && (
        <div className={`flex items-center gap-2 p-3.5 border rounded-xl text-xs font-medium animate-fade-in ${
          message.type === 'error'
            ? 'bg-red-500/10 border-red-500/20 text-red-400'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        }`}>
          {message.type === 'error' ? <AlertCircle size={15} /> : <Check size={15} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Creation Forms */}
        <div className="lg:col-span-1 glass-panel border border-white/5 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="font-bold text-base text-white">
              {activeTab === 'categories' 
                ? (isEditingCat ? 'Edit Page' : 'Add New Page') 
                : (isEditingSnip ? 'Edit Snippet' : 'Add New Snippet')
              }
            </h2>
            {(isEditingCat || isEditingSnip) && (
              <button 
                onClick={activeTab === 'categories' ? resetCatForm : resetSnipForm}
                className="text-gray-400 hover:text-white bg-white/5 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {activeTab === 'categories' ? (
            /* Category Form */
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Page Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Buttons"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Select Icon</label>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 bg-[#050508] border border-white/5 rounded-xl scrollbar-thin">
                  {POPULAR_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setCatIcon(icon)}
                      className={`p-2 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        catIcon === icon 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10' 
                          : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                      title={icon}
                    >
                      <DynamicIcon name={icon} size={15} />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1">Selected: {catIcon}</p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                {isEditingCat ? 'Save Changes' : 'Create Page'}
              </button>
            </form>
          ) : (
            /* Snippet Form */
            <form onSubmit={handleSnippetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Snippet Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Glow Button"
                  value={snipTitle}
                  onChange={(e) => setSnipTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Description</label>
                <input
                  type="text"
                  placeholder="Short explanation of styling..."
                  value={snipDescription}
                  onChange={(e) => setSnipDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assign Page</label>
                <select
                  required
                  value={snipCategoryId}
                  onChange={(e) => setSnipCategoryId(e.target.value)}
                  className="w-full bg-[#0c0c14] border border-white/5 rounded-xl py-2.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Select Page --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">HTML Code</label>
                <textarea
                  placeholder="<div>My Element</div>"
                  value={snipHtml}
                  onChange={(e) => setSnipHtml(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CSS Stylesheet</label>
                <textarea
                  placeholder=".btn { color: red; }"
                  value={snipCss}
                  onChange={(e) => setSnipCss(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Tailwind Code</label>
                <textarea
                  placeholder="<button class='bg-blue-500'>Click</button>"
                  value={snipTailwind}
                  onChange={(e) => setSnipTailwind(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">React JSX</label>
                <textarea
                  placeholder="export default function Button() { ... }"
                  value={snipReact}
                  onChange={(e) => setSnipReact(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Interactive JS</label>
                <textarea
                  placeholder="document.querySelector('.btn').addEventListener('click', ...)"
                  value={snipJs}
                  onChange={(e) => setSnipJs(e.target.value)}
                  rows={3}
                  className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 px-3 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} />
                {isEditingSnip ? 'Update Snippet' : 'Add Content'}
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Existing Content View List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-base text-white">
              {activeTab === 'categories' ? 'Pages' : 'Snippets'} ({activeTab === 'categories' ? categories.length : snippets.length})
            </h3>
          </div>

          {activeTab === 'categories' ? (
            /* Categories list */
            categories.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
                <p className="text-gray-500 text-xs">No pages created yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="glass-card hover:bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white/5 p-2 rounded-xl text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 border border-transparent group-hover:border-indigo-500/25 transition-all">
                        <DynamicIcon name={cat.icon} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono">ID: {cat._id.slice(-6)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditCategory(cat)}
                        className="text-gray-400 hover:text-indigo-400 hover:bg-white/5 p-2 rounded-xl transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Snippets list */
            snippets.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
                <p className="text-gray-500 text-xs">No snippets added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {snippets.map((snip) => (
                  <div
                    key={snip._id}
                    className="glass-card hover:bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{snip.title}</h4>
                        <span className="text-[9px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                          {getCategoryName(snip.category_id)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1 max-w-md">{snip.description || 'No description provided'}</p>
                      <div className="flex gap-2 text-[9px] text-gray-500 font-mono">
                        {snip.htmlCode && <span>• HTML</span>}
                        {snip.cssCode && <span>• CSS</span>}
                        {snip.tailwindCode && <span>• Tailwind</span>}
                        {snip.reactCode && <span>• React</span>}
                        {snip.jsCode && <span>• JS</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => startEditSnippet(snip)}
                        className="text-gray-400 hover:text-indigo-400 hover:bg-white/5 p-2 rounded-xl transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => deleteSnippet(snip._id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
