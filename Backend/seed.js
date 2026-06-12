const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './Backend/.env' }) || require('dotenv').config({ path: './.env' });
const Category = require('./models/categoryModel');
const Snippet = require('./models/snippetModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://polampallisaivardhan1423_db_user:nFwrktaLXrb9mVlB@cluster0.8m9ylhs.mongodb.net/?appName=Cluster0';

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected successfully!');

    // 1. Clear existing items
    console.log('Clearing old categories and snippets...');
    await Category.deleteMany({});
    await Snippet.deleteMany({});
    console.log('Database cleared.');

    // 2. Create Categories
    console.log('Seeding categories...');
    const catButtons = await Category.create({ name: 'Buttons', icon: 'MousePointerClick' });
    const catCards = await Category.create({ name: 'Cards', icon: 'Layers' });
    const catLoaders = await Category.create({ name: 'Loaders', icon: 'Activity' });
    console.log('Categories created successfully!');

    // 3. Create Snippets
    console.log('Seeding premium snippets...');

    const snippetsData = [
      // --- BUTTONS ---
      {
        category_id: catButtons._id,
        title: 'Neon Border Glow Button',
        description: 'A futuristic dark slate button with an glowing neon purple outline that spreads outwards on hover.',
        htmlCode: `<button class="neon-glow-btn">
  <span>Hover Me</span>
</button>`,
        cssCode: `.neon-glow-btn {
  background: #09090b;
  color: #c084fc;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 2px solid #a855f7;
  padding: 14px 30px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
}

.neon-glow-btn span {
  position: relative;
  z-index: 1;
}

.neon-glow-btn:hover {
  box-shadow: 0 0 30px rgba(168, 85, 247, 0.65), 
              inset 0 0 15px rgba(168, 85, 247, 0.3);
  color: #ffffff;
  background: #a855f7;
  transform: translateY(-2px);
}`,
        tailwindCode: `<button class="relative bg-zinc-950 text-purple-400 font-bold text-xs uppercase tracking-wider border-2 border-purple-500 py-3.5 px-7 rounded-xl cursor-pointer hover:bg-purple-600 hover:text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all duration-300">
  Hover Me
</button>`
      },
      {
        category_id: catButtons._id,
        title: 'Shiny Liquid Slide Button',
        description: 'A premium Indigo button that gets flooded with a vibrant pink gradient slide from the center on hover.',
        htmlCode: `<button class="liquid-slide-btn">
  <span>Vibrant Wave</span>
</button>`,
        cssCode: `.liquid-slide-btn {
  position: relative;
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  background: #1e1b4b;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
}

.liquid-slide-btn span {
  position: relative;
  z-index: 2;
}

.liquid-slide-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 320px;
  height: 320px;
  background: linear-gradient(45deg, #4f46e5, #db2777);
  border-radius: 40%;
  transform: translate(-50%, -50%) scale(0) rotate(0deg);
  transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1;
}

.liquid-slide-btn:hover::before {
  transform: translate(-50%, -50%) scale(1) rotate(360deg);
}

.liquid-slide-btn:hover {
  box-shadow: 0 8px 25px rgba(219, 39, 119, 0.4);
  transform: translateY(-1px);
}`,
        tailwindCode: `<button class="relative py-3.5 px-8 rounded-xl bg-indigo-950 text-white font-bold text-xs cursor-pointer overflow-hidden shadow-lg group">
  <span class="relative z-10 transition-transform duration-300 group-hover:scale-105 block">Vibrant Wave</span>
  <div class="absolute inset-0 w-80 h-80 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out origin-center"></div>
</button>`
      },
      {
        category_id: catButtons._id,
        title: 'Retro 3D Tactile Push Button',
        description: 'Chunky retro gaming button that pushes downwards along the Z-axis in a tactile way when clicked.',
        htmlCode: `<button class="retro-btn-3d">
  PUSH START
</button>`,
        cssCode: `.retro-btn-3d {
  background: #f43f5e;
  border: 2px solid #000000;
  border-radius: 10px;
  color: #ffffff;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 0.05em;
  padding: 14px 28px;
  text-shadow: 2px 2px 0px #000;
  box-shadow: 0px 6px 0px #9f1239, 0px 6px 12px rgba(0, 0, 0, 0.45);
  transition: all 0.1s ease;
}

.retro-btn-3d:hover {
  background: #fda4af;
  color: #000;
  text-shadow: none;
}

.retro-btn-3d:active {
  transform: translateY(6px);
  box-shadow: 0px 0px 0px #9f1239, 0px 2px 4px rgba(0, 0, 0, 0.2);
}`,
        tailwindCode: `<button class="bg-rose-500 border-2 border-black rounded-xl text-white font-black text-xs tracking-widest py-3 px-6 shadow-[0_6px_0_#9f1239,0_6px_12px_rgba(0,0,0,0.4)] active:translate-y-1.5 active:shadow-[0_0_0_#9f1239,0_2px_4px_rgba(0,0,0,0.2)] transition-all cursor-pointer">
  PUSH START
</button>`
      },
      {
        category_id: catButtons._id,
        title: 'Shimmering Metallic Ribbon Button',
        description: 'A button with a smooth diagonal metallic light reflection overlay that sweeps across infinitely.',
        htmlCode: `<button class="shimmer-btn">
  Metallic Shine
</button>`,
        cssCode: `.shimmer-btn {
  background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  padding: 14px 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.shimmer-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  transform: skewX(-25deg);
  animation: shine-sweep 3s infinite;
}

.shimmer-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

@keyframes shine-sweep {
  0% {
    left: -150%;
  }
  50% {
    left: 150%;
  }
  100% {
    left: 150%;
  }
}`,
        tailwindCode: `<button class="relative bg-zinc-900 border border-white/10 text-white font-semibold text-xs py-3 px-7 rounded-xl cursor-pointer overflow-hidden group">
  Metallic Shine
  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
</button>`
      },

      // --- CARDS ---
      {
        category_id: catCards._id,
        title: 'Glassmorphic Radial Spotlight Card',
        description: 'A beautiful translucent card overlay. Hovering over the card casts a neon radial gradient glow that tracks the cursor coordinates.',
        htmlCode: `<div class="glass-spotlight-card">
  <div class="spotlight"></div>
  <div class="card-inner">
    <h4>Interactive Glow</h4>
    <p>A sleek dark card leveraging frosted backdrop blurs and dynamic mouse spotlight positions.</p>
  </div>
</div>`,
        cssCode: `.glass-spotlight-card {
  position: relative;
  width: 300px;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.card-inner {
  position: relative;
  padding: 30px;
  z-index: 2;
}

.card-inner h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #ffffff;
  font-weight: 700;
}

.card-inner p {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.spotlight {
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;
}`,
        jsCode: `const card = document.querySelector('.glass-spotlight-card');
const spotlight = card.querySelector('.spotlight');

card.addEventListener('mousemove', (e) => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spotlight.style.left = x + 'px';
  spotlight.style.top = y + 'px';
});

card.addEventListener('mouseenter', () => {
  spotlight.style.opacity = '1';
});

card.addEventListener('mouseleave', () => {
  spotlight.style.opacity = '0';
});`
      },
      {
        category_id: catCards._id,
        title: 'Rainbow Spin Border Card',
        description: 'A frosted dark card framed by a thin rotating rainbow border line using CSS conic-gradients.',
        htmlCode: `<div class="rainbow-border-card">
  <div class="inner-block">
    <h4>Vivid Borders</h4>
    <p>Using background-conic gradients masked by sub-pixel panels to present thin revolving colored borders.</p>
  </div>
</div>`,
        cssCode: `.rainbow-border-card {
  position: relative;
  width: 300px;
  padding: 2.5px;
  border-radius: 18px;
  overflow: hidden;
  background: #09090b;
}

.rainbow-border-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(#3b82f6, #ec4899, #10b981, #ff007f, #3b82f6);
  animation: border-revolve 5s linear infinite;
}

.inner-block {
  position: relative;
  border-radius: 16px;
  padding: 26px;
  background: #09090f;
  color: #f1f5f9;
  z-index: 2;
}

.inner-block h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #fff;
}

.inner-block p {
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

@keyframes border-revolve {
  100% {
    transform: rotate(360deg);
  }
}`
      },

      // --- LOADERS ---
      {
        category_id: catLoaders._id,
        title: 'Neon Ripple Wave Spinner',
        description: 'A modern loader that expands double wave concentric rings outwards in a delayed pulse loop.',
        htmlCode: `<div class="ripple-wave-loader">
  <div class="ripple"></div>
  <div class="ripple"></div>
  <div class="ripple"></div>
</div>`,
        cssCode: `.ripple-wave-loader {
  position: relative;
  width: 60px;
  height: 60px;
}

.ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #6366f1;
  border-bottom-color: #ec4899;
  animation: spin-pulse-ripple 1.6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.ripple:nth-child(1) {
  animation-delay: -0.4s;
}

.ripple:nth-child(2) {
  animation-delay: -0.2s;
}

@keyframes spin-pulse-ripple {
  0% {
    transform: rotate(0deg) scale(0.75);
    opacity: 0.4;
  }
  50% {
    transform: rotate(180deg) scale(1.15);
    opacity: 1;
    border-top-color: #8b5cf6;
    border-bottom-color: #f43f5e;
  }
  100% {
    transform: rotate(360deg) scale(0.75);
    opacity: 0.4;
  }
}`
      },
      {
        category_id: catLoaders._id,
        title: 'Helix Wave Dots Loader',
        description: 'A 3D revolving helix line effect composed of 5 gradient bounce dots.',
        htmlCode: `<div class="helix-dots-loader">
  <div class="h-dot"></div>
  <div class="h-dot"></div>
  <div class="h-dot"></div>
  <div class="h-dot"></div>
  <div class="h-dot"></div>
</div>`,
        cssCode: `.helix-dots-loader {
  display: flex;
  gap: 8px;
  align-items: center;
}

.h-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
  animation: helix-bounce 1.2s ease-in-out infinite;
}

.h-dot:nth-child(1) { animation-delay: 0s; }
.h-dot:nth-child(2) { animation-delay: 0.15s; }
.h-dot:nth-child(3) { animation-delay: 0.3s; }
.h-dot:nth-child(4) { animation-delay: 0.45s; }
.h-dot:nth-child(5) { animation-delay: 0.6s; }

@keyframes helix-bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-24px);
    background: #ec4899;
    opacity: 1;
  }
}`
      }
    ];

    await Snippet.create(snippetsData);
    console.log('Premium code snippets seeded successfully!');

    console.log('Seeding complete. Closing database connection.');
    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
