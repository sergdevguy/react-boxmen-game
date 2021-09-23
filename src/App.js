import React, { useState, useEffect } from 'react';
import s from './App.module.scss';
import ArrowIcon from './components/Icons/Arrow';
import Arrow from './components/Icons/Arrow';

import Levels from './components/Levels/Levels';

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelArray, setLevelArray] = useState(Levels?.slice()[currentLevel]?.map((i) => { return [...i] }) || null);
  const [winStatus, setWinStatus] = useState(false);

  useEffect(() => {
    if (currentLevel === (Levels.length)) {
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
    if (typeof(e) === 'string') {
      moveHero(e);
    }
  }

  const checkWin = () => {
    for (let i = 0; i < cloneArr.length; i++) {
      for (let j = 0; j < cloneArr[i].length; j++) {
        if (cloneArr[i][j] === 4 && Levels[currentLevel][i][j] !== 3) {
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
      default:
        break;
    }
  }

  const restartLevel = () => {
    setLevelArray(Levels.slice()[currentLevel].map((i) => { return [...i] }));
  }

  const restartGame = () => {
    setCurrentLevel(0);
    setWinStatus(false);
  }

  const mobileButtons = (direction) => {

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

    if (currentLevel !== (Levels.length)) {
      setLevelArray(cloneArr);
    }

    if (checkWin()) {
      setWinStatus(true);
      setCurrentLevel(currentLevel + 1);
    }
  }

  useEffect(() => {
    window.onkeydown = checkKey;
  }, [checkKey]);

  return (
    <div className={s["game"]}>
      {drawLevel(cloneArr)}
      {!winStatus ?
        <button className={s["game__restart"]} onClick={() => restartLevel()}>Переиграть уровень</button>
        :
        <button className={s["game__restart"]} style={{ visibility: 'hidden' }}>Не баг а фича</button>
      }
      <div className={s["game__mobile"]}>
        <div onClick={() => checkKey('ArrowUp')} className={s["game__mobile-button"] + ' ' + s["_top"]}>{ArrowIcon}</div>
        <div onClick={() => checkKey('ArrowDown')} className={s["game__mobile-button"] + ' ' + s["_bottom"]}>{ArrowIcon}</div>
        <div onClick={() => checkKey('ArrowLeft')} className={s["game__mobile-button"] + ' ' + s["_left"]}>{ArrowIcon}</div>
        <div onClick={() => checkKey('ArrowRight')} className={s["game__mobile-button"] + ' ' + s["_right"]}>{ArrowIcon}</div>
      </div>
      {winStatus &&
        <div className={s["game__win"]}>
          <div className={s["game__win-wrapper"]}></div>
          <div className={s["game__win-text"]}>
            <div>Вы победили!</div>
            <button className={s["game__win-button"]} onClick={() => restartGame()}>Начать игру заного</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
