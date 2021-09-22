import React, { useState } from 'react';
import s from './App.module.scss';

import Levels from './components/Levels/Levels';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelArray, setLevelArray] = useState(Levels[currentLevel].slice());

  const drawLevel = (lvl) => {
    return (lvl.map((rowItem, i) => {
      return (
        <div key={i} className={s["game-row"]}>
          {rowItem.map((colItem, i) => {
            return (
              <div
                key={i}
                className={s["game-box"] + ' ' + s[`_${colItem}`]}
              ></div>
            )
          })}
        </div>
      );
    }))
  }

  return (
    <div className="game">
      {drawLevel(levelArray)}
    </div>
  );
}

export default App;
