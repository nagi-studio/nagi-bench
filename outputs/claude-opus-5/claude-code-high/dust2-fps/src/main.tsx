import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';

// Note: intentionally not wrapped in <StrictMode>. Its double-mount in dev
// would build the WebGL context, the level geometry and a second GameEngine
// twice per session for no benefit.
const container = document.getElementById('root');
if (!container) throw new Error('#root not found');
createRoot(container).render(<App />);
