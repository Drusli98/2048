import {Grid} from "./grid.js";
import {Tile} from "./tile.js";
import {loadGameState, saveGameState} from "./savesdate.js";

const gameBoard = document.getElementById('game');
const buttonNewGame = document.getElementById('new-game');
// const scoreElement = document.getElementById('score span');
// let score = 0;


const grid = new Grid(gameBoard);

function initGame() {
  // Загружаем сохраненное состояние игры из localStorage
  loadGameState(grid, gameBoard);

  //Если сохраненного состояния нет, создаем два начальных тайла
  if (!localStorage.getItem('gameState')) {
    grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
    grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  }

  //updateScoreDisplay(); может пригодится
  // Настраиваем обработчик событий для клавиатур
  setupInputOnce();
}

initGame();


// Добавляем обработчик для кнопки "Новая игра" — сбрасываем игру
buttonNewGame.addEventListener('click', () => {
  // Удаляем сохраненное состояние из localStorage
  localStorage.removeItem('gameState');

  // Удаляем все текущие тайлы с поля
  grid.cells.forEach(cell => {
    if (cell.linkedTile) {
      cell.linkedTile.removeFromDOM();
      cell.unlinkTile();
    }
  });

  // Создаем два новых тайла для начала игры
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

  // Сохраняем новое начальное состояние после сброса
  saveGameState(grid);
});

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, {once: true});
} //Функция для установки обработчика событий клавиатуры // Funktion zum Einrichten eines Ereignislisteners für Tastatureingaben

async function handleInput(event) { // Функция для обработки событий клавиатуры // Funktion zur Verarbeitung von Tastatureingaben
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInputOnce();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInputOnce();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInputOnce();
        return;
      }
      await moveRight();

      break;
    default:
      setupInputOnce()// Если клавиша не стрелка, то ничего не делаем // Wenn die Taste keine Pfeiltaste ist, tun wir nichts
      return;
  }

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    alert("Game OVER") // Ждем окончания анимации // Warten wir auf das Ende der Animation
    return;
  }
  saveGameState(grid);
  setupInputOnce()
}


async function moveUp() { // Функция для движения вверх // Funktion für die Bewegung nach oben
  await slideTiles(grid.cellsGroupedByColumn); // Получим сгруппированные ячейки по колонкам // Holen wir die nach Spalten gruppierten Zellen
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReverseColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow)
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReverseRow)
}

async function slideTiles(groupedCells) { // Функция для сдвига тайлов
  const promises = []; // Создадим массив промисов
  groupedCells.forEach(group => slideTilesInGroup(group, promises)); // Пройдемся по всем группам

  await Promise.all(promises); // Ждем окончания всех анимаций

  grid.cells.forEach(cell => {
    if (cell.hasTileForMerge()) {
      cell.mergeTiles(); // Сливаем тайлы
    }
  });
}

function slideTilesInGroup(group, promises) { // Функция для сдвига тайлов в группе // Funktion zum Verschieben der Kacheln in einer Gruppe
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue; // Если клеточка пустая, то пропускаем её // Wenn die Zelle leer ist, überspringen wir sie
    }

    const cellWithTile = group[i]; // Получим клеточку с тайлом // Holen wir die Zelle mit der Kachel

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j]; // Выбираем ближайшую подходящую ячейку // Wählen wir die nächste passende Zelle aus
      j--;
    }

    if (!targetCell) {
      continue; // Если нет подходящей клеточки, то пропускаем // Wenn es keine passende Zelle gibt, überspringen wir
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd()); // Ждем окончания анимации // Warten wir auf das Ende der Animation

    if (targetCell.isEmpty()) { // Если клеточка пустая, то просто переместим тайл // Wenn die Zelle leer ist, verschieben wir einfach die Kachel
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile); // Иначе свяжем для слияния // Andernfalls verbinden wir zum Zusammenführen
    }
    cellWithTile.unlinkTile(); // Отвяжем тайл от исходной ячейки // Trennen wir die Kachel von der ursprünglichen Zelle
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReverseColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReverseRow);
}


function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }
    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  });
}

// function updateScoreDisplay() {
//   scoreElement.textContent = score; // Обновляем отображение счета // Aktualisieren wir die Punktanzeige
// }






