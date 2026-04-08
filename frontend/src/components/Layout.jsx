import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const Layout = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme === 'light' ? 'light-theme' : '';
  }, [theme]);

  return (
    <div className="layout">
      <header>
        <div className="header-top">
          <h1>NexPost</h1>
          <button 
            className="theme-toggle" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <p>Real-time post explorer & synchronizer</p>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};
