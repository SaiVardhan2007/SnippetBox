import React from 'react';

export default function IframePreview({ htmlCode = '', cssCode = '', jsCode = '', tailwindCode = '', height = '120px', theme = 'dark', snippetId = '', scale = 1 }) {
  const doc = `
    <!DOCTYPE html>
    <html class="h-full">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Standalone Tailwind CSS v4 CDN for dynamic compiled playgrounds -->
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <style>
          body {
            margin: 0;
            padding: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: transparent;
            color: ${theme === 'light' ? '#0f172a' : '#f3f4f6'};
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            box-sizing: border-box;
            overflow: hidden; /* Prevent scrolls inside standard UI components */
          }
          .scale-wrapper {
            transform: scale(${scale});
            transform-origin: center center;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          /* Inject custom style sheet code */
          ${cssCode}
        </style>
      </head>
      <body class="h-full antialiased">
        <div class="scale-wrapper">
          <div class="w-full flex items-center justify-center">
            ${htmlCode || tailwindCode || '<div class="text-gray-500 text-sm">No preview content available</div>'}
          </div>
        </div>
        <script>
          // Wrap custom JS run scripts inside try/catch so it doesn't crash execution context
          const runCustomJS = () => {
            try {
              ${jsCode}
            } catch (err) {
              console.error("Iframe Execution Error:", err);
            }
          };

          window.addEventListener('DOMContentLoaded', () => {
            runCustomJS();

            // Intercept clicks on the preview and notify parent component
            if ('${snippetId}') {
              document.addEventListener('click', () => {
                window.parent.postMessage({ type: 'IFRAME_CLICK', snippetId: '${snippetId}' }, '*');
              });
            }

            // Periodically refresh the component content to re-trigger mount transitions and loop scripts
            const container = document.querySelector('body > div');
            if (container && container.innerHTML) {
              const originalHTML = container.innerHTML;
              setInterval(() => {
                container.innerHTML = '';
                setTimeout(() => {
                  container.innerHTML = originalHTML;
                  runCustomJS();
                }, 80);
              }, 4000);
            }
          });
        </script>
      </body>
    </html>
  `;

  let bgClass = 'bg-[#08080f] border-white/5';
  let inlineStyles = {};

  if (theme === 'light') {
    bgClass = 'bg-white border-black/10';
  } else if (theme === 'grid') {
    bgClass = 'bg-[#06060a] border-white/5';
    inlineStyles = {
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      backgroundSize: '16px 16px'
    };
  }

  return (
    <div style={{ height, ...inlineStyles }} className={`w-full relative border rounded-xl overflow-hidden shadow-inner ${bgClass}`}>
      <iframe
        title="Code Snippet Preview"
        style={{ height }}
        className="w-full block border-none bg-transparent"
        scrolling="no"
        sandbox="allow-scripts"
        srcDoc={doc}
      />
    </div>
  );
}
