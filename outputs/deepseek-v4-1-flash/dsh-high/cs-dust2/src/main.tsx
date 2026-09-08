import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// StrictMode is intentionally omitted: it double-mounts effects in dev which
// would create two WebGL renderers on the same canvas.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
