import React, { useState } from 'react';
import { MainMenu } from './components/Menu/MainMenu';
import { GameView } from './components/GameView';

export function App() {
  const [isInGame, setIsInGame] = useState<boolean>(false);
  const [playerTeam, setPlayerTeam] = useState<'CT' | 'T'>('CT');
  const [isPistolOnly, setIsPistolOnly] = useState<boolean>(false);
  const [mouseSensitivity, setMouseSensitivity] = useState<number>(1.2);

  const handleStartGame = (team: 'CT' | 'T', pistolOnly: boolean, sensitivity: number) => {
    setPlayerTeam(team);
    setIsPistolOnly(pistolOnly);
    setMouseSensitivity(sensitivity);
    setIsInGame(true);
  };

  const handleExitToMenu = () => {
    setIsInGame(false);
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-black select-none font-sans">
      {!isInGame ? (
        <MainMenu onStartGame={handleStartGame} />
      ) : (
        <GameView
          playerTeam={playerTeam}
          isPistolOnly={isPistolOnly}
          mouseSensitivity={mouseSensitivity}
          onExitToMenu={handleExitToMenu}
        />
      )}
    </div>
  );
}

export default App;
