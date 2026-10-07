import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// StrictMode is intentionally not used: it double-mounts effects in development, which would
// create and immediately destroy a WebGL context + game loop.
createRoot(document.getElementById('root')!).render(<App />);
