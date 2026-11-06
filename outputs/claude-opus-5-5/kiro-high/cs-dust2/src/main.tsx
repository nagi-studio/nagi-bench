import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// StrictMode is intentionally omitted: the engine owns a WebGL context, an AudioContext and
// pointer lock; double-mounting in development would create and tear them down twice.
createRoot(document.getElementById('root')!).render(<App />);
