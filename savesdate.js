import {Tile} from "./tile.js";

export function saveGameState(grid, score) {
  const state = grid.cells.map(cell => ({
    x: cell.x,
    y: cell.y,
    value: cell.linkedTile ? cell.linkedTile.value : null
  }));

  localStorage.setItem('gameState', JSON.stringify({cells: state, score}));
}

export function loadGameState(grid, gameBoard) {
  const savedState = localStorage.getItem('gameState');

  if (savedState) {
    const parsedState = JSON.parse(savedState); // Парсим состояние

    // Добавляем проверку, что parsedState.cells существует
    if (parsedState && parsedState.cells) {
      parsedState.cells.forEach(cellData => {
        if (cellData.value) { // Если в ячейке есть значение
          const cell = grid.cells.find(c => c.x === cellData.x && c.y === cellData.y);
          if (cell) { // Проверяем, что ячейка существует
            const tile = new Tile(gameBoard); // Создаем новый тайл
            tile.setValue(cellData.value); // Устанавливаем значение
            cell.linkTile(tile); // Связываем тайл с ячейкой (исправлена опечатка)
          }
        }
      });

      // Возвращаем счет из сохраненного состояния, если он существует, иначе 0
      return parsedState.score || 0;
    }
  }

  return 0; // Возвращаем 0 как значение по умолчанию
}
