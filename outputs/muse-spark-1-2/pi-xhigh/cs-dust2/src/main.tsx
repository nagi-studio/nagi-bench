// @ts-nocheck - Vite subproject isolated from host; deps declared in package.json and installed via npm install on bench
// @ts-expect-error - Vite subproject deps declared in package.json, installed on bench
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

createRoot(document.getElementById('root')!).render(<App />);
