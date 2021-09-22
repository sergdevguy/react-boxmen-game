import React, { useState, useEffect } from 'react';
import s from './App.module.scss';

import Levels from './components/Levels/Levels';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelArray, setLevelArray] = useState(Levels.slice()[currentLevel].map((i) => { return [...i] }));
  const [winStatus, setWinStatus] = useState(false);

  useEffect(() => {
    if (currentLevel === 4) {
      return;
    }
    setLevelArray(Levels.slice()[currentLevel].map((i) => { return [...i] }));
    setWinStatus(false);
  }, [currentLevel]);

  const cloneArr = levelArray.slice().map((i) => { return [...i] });

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

  const checkKey = (e) => {
    if (e.code === 'ArrowUp' ||
      e.code === 'ArrowDown' ||
      e.code === 'ArrowLeft' ||
      e.code === 'ArrowRight') {
      moveHero(e.code);
    }
  }

  const checkWin = () => {
    for (let i = 0; i < cloneArr.length; i++) {
      for (let j = 0; j < cloneArr[i].length; j++) {
        if (cloneArr[i][j] === 3) {
          return false;
        }
      }
    }
    return true;
  }

  const getHeroPosition = () => {
    let heroPosition = [];

    for (let i = 0; i < cloneArr.length; i++) {
      for (let j = 0; j < cloneArr[i].length; j++) {
        if (cloneArr[i][j] === 5) {
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

  const restartLevel = () => {
    setLevelArray(Levels.slice()[currentLevel].map((i) => { return [...i] }));
  }

  // sorry for this function
  const move = (stepRow, stepCol) => {
    if (winStatus) {
      return;
    }

    const [row, col] = getHeroPosition();

    // if next wall - dont move
    if (cloneArr[row - stepRow][col - stepCol] === 1) {
      return;
    }

    // if next step box and after box wall - return
    if (cloneArr[row - stepRow * 2][col - stepCol * 2] === 1
      && cloneArr[row - stepRow][col - stepCol] === 4) {
      return;
    }

    // if next step box and after box another box - return
    if (cloneArr[row - stepRow * 2][col - stepCol * 2] === 4
      && cloneArr[row - stepRow][col - stepCol] === 4) {
      return;
    }

    // return checkpoints after hero changed it for himself and move next
    if (Levels[currentLevel][row][col] === 3) {
      cloneArr[row][col] = 3;
    } else {
      cloneArr[row][col] = 2;
    }

    // if next box is ok - move box
    if (cloneArr[row - stepRow][col - stepCol] === 4) {
      cloneArr[row - stepRow - stepRow][col - stepCol - stepCol] = 4;
    }

    // move hero
    cloneArr[row - stepRow][col - stepCol] = 5;

    setLevelArray(cloneArr);

    if (checkWin()) {
      setWinStatus(true);
      setCurrentLevel(currentLevel + 1);
    } 
  }

  return (
    <div className={s["game"]} onKeyDown={(e) => checkKey(e)} tabIndex="0">
      {drawLevel(cloneArr)}
      <button onClick={() => restartLevel()}>Restart</button>
    </div>
  );
}

export default App;
