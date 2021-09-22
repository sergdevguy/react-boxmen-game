import React, { useState } from 'react';
import s from './App.module.scss';

import Levels from './components/Levels/Levels';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelArray, setLevelArray] = useState(Levels.slice()[currentLevel].map((i) => {return [...i]}));

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

  function checkKey(e) {
    if (e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight') {
      moveHero(e.code);
    }
  }

  const getHeroPosition = () => {
    let heroPosition = [];

    for (let i = 0; i < levelArray.length; i++) {
      for (let j = 0; j < levelArray[i].length; j++) {
        if (levelArray[i][j] === 5) {
          heroPosition = [i, j];
        }
      }
    }
    return heroPosition;
  }

  const moveHero = (direction) => {
    switch (direction) {
      case 'ArrowUp':
        move(1, 0);
        break;
      case 'ArrowDown':
        move(-1, 0);
        break;
      case 'ArrowRight':
        move(0, -1);
        break;
      case 'ArrowLeft':
        move(0, 1);
        break;
    }
  }

  function move(stepRow, stepCol) {
    const [row, col] = getHeroPosition();
    let cloneArr = Levels.slice()[currentLevel].map((i) => {
      return [...i];
    })

    // draw floor if this block is was hero before
    if (levelArray[row][col] === 3) {
      cloneArr[row][col] = 3;
    } else {
      cloneArr[row][col] = 2;
    }

    cloneArr[row - stepRow][col - stepCol] = 5;

    setLevelArray(cloneArr);
  }


  return (
    <div className="game" onKeyDown={(e) => checkKey(e)} tabIndex="0">
      {drawLevel(levelArray)}
    </div>
  );
}

export default App;
