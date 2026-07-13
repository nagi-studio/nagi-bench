import { useState } from 'react';
import { Team } from './engine/types';
import { Menu } from './components/Menu';
import { GameCanvas } from './components/GameCanvas';

export function App() {
  const [team, setTeam] = useState<Team | null>(null);
  if (team === null) return <Menu onStart={setTeam} />;
  return <GameCanvas team={team} />;
}
