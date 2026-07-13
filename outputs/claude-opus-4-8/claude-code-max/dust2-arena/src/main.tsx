import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

// No StrictMode: the game owns an imperative three.js loop with manual setup /
// teardown, and double-invoked effects would spin up two render loops.
createRoot(document.getElementById('root')!).render(<App />);
