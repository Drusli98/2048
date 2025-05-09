export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.setValue(Math.random() > 0.35 ? 2 : 4);
    gridElement.append(this.tileElement);
  }

  setXY(x, y) { // Установим координаты тайла // Setzen wir die Koordinaten der Kachel
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty('--x', x);
    this.tileElement.style.setProperty('--y', y);
  }

  setValue(value) { // Установим значение тайла и обновим стили // Setzen wir den Wert der Kachel und aktualisieren die Stile
    this.value = value;
    this.tileElement.textContent = value;
    const bgLightness = 100 - Math.log2(value) * 9;
    this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);
    this.tileElement.style.setProperty('--text-lightness', `${bgLightness < 50 ? 90 : 10}%`);
  }

  removeFromDOM() {
    this.tileElement.remove(); // Удаляем тайл из DOM // Entfernen wir die Kachel aus dem DOM
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener('transitionend', resolve, {once: true}); // Ждем окончания анимации // Warten wir auf das Ende der Animation
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener('animationend', resolve, {once: true}); // Ждем окончания анимации // Warten wir auf das Ende der Animation
    });
  }
}
