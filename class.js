export class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  linkTile(tile) { // Установим координаты клеточки и свяжем её с тайлом // Setzen wir die Koordinaten der Zelle und verbinden sie mit einem Kachel
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() { // Отвяжем тайл от ячейки // Trennen wir die Kachel von der Zelle
    this.linkedTile = null;
  }

  isEmpty() { // Проверяем, пустая ли ячейка // Überprüfen wir, ob die Zelle leer ist
    return !this.linkedTile; // Если клеточка не связана с тайлом, то она пустая // Wenn die Zelle nicht mit einer Kachel verbunden ist, ist sie leer
  }

  linkTileForMerge(tile) { // Свяжем клеточку с тайлом для слияния // Verbinden wir die Zelle mit einer Kachel zum Zusammenführen
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }
 // moin
  unlinkTileForMerge() {
    this.linkedTileForMerge = null; // Отвяжем тайл от ячейки // Trennen wir die Kachel von der Zelle
  }

  hasTileForMerge() { // Проверяем, есть ли тайл для слияния // Überprüfen wir, ob es eine Kachel zum Zusammenführen gibt
    return !!this.linkedTileForMerge;
  }


  canAccept(newTile) { // Проверяем, может ли ячейка принять новый тайл // Überprüfen wir, ob die Zelle eine neue Kachel akzeptieren kann
    return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    if (this.hasTileForMerge()) {
      this.linkedTile.setValue(this.linkedTile.value + this.linkedTileForMerge.value); // Сливаем тайлы // Fügen wir die Kacheln zusammen
      this.linkedTileForMerge.removeFromDOM();// Удаляем тайл из DOM // Entfernen wir die Kachel aus dem DOM
      const scoreToAdd = this.linkedTile.value;
      this.unlinkTileForMerge();
      return scoreToAdd;
    }
    return 0;
  }
}
