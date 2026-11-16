import { createRoot } from 'react-dom/client';
import { h } from './components/h.ts';
import App from './App.ts';
import './styles.css';

const el = document.getElementById('root');
if (el) {
  createRoot(el).render(h(App));
}
