import { useHud } from './state/store';
import { GameView } from './ui/GameView';
import { Menu } from './ui/Menu';

export default function App() {
  const screen = useHud((s) => s.screen);
  return screen === 'menu' ? <Menu /> : <GameView />;
}
