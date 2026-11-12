import { createRoot } from 'react-dom/client';
import { App } from './ui/App.tsx';
import './ui/styles.css';

// StrictMode is intentionally not used: it double-mounts effects in dev, which
// would briefly create two WebGL contexts / audio graphs for the game.
createRoot(document.getElementById('root')!).render(<App />);
