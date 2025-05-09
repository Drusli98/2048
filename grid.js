import { Cell } from "./class.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export class Grid {
  constructor(gridElement) {
    this.cells = [];
    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
    }
    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByReverseColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
    this.cellsGroupedByRow = this.groupCellsByRow();
    this.cellsGroupedByReverseRow = this.cellsGroupedByRow.map(row => [...row].reverse());
  }


  getRandomEmptyCell() { // Функция для получения случайной пустой ячейки // Funktion, um eine zufällige leere Zelle zu erhalten
    const emptyCells = this.cells.filter(cell => cell.isEmpty()); // Сохраним в константу только пустые ячейки // Speichern wir nur leere Zellen in eine Konstante
    const randomIndex = Math.floor(Math.random() * emptyCells.length); // Получим случайный индекс // Erhalten wir einen zufälligen Index
    return emptyCells[randomIndex]; // Вернем случайную пустую ячейку // Geben wir eine zufällige leere Zelle zurück
  }

  groupCellsByColumn() { // Функция для группировки ячеек по колонкам // Funktion zum Gruppieren von Zellen nach Spalten
    return this.cells.reduce((groupCells, cell) => {
      groupCells[cell.x] = groupCells[cell.x] || [];
      groupCells[cell.x][cell.y] = cell;
      return groupCells;
    }, []);
  }

  groupCellsByRow() { // Функция для группировки ячеек по колонкам // Funktion zum Gruppieren von Zellen nach Spalten
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []);
  }
}
