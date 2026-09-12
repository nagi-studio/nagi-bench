import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles.css';

// 注意：这里不用 StrictMode。开发模式下 StrictMode 会把 effect 跑两遍，
// 会导致 WebGL 上下文和游戏循环被创建两次。
createRoot(document.getElementById('root')!).render(<App />);
