import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// NOTE: StrictMode is intentionally omitted because the game engine owns a
// WebGL context; StrictMode's double-invoke in dev would create/dispose it twice.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
