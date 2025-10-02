export class BonusMenu {
  private bonusDisplay!: HTMLElement;
  private spinButton!: HTMLButtonElement;
  private prizeDisplay!: HTMLElement;
  private bonuses: number = 0;
  private spinning: boolean = false;

  constructor(canvasId: string) {
    this.loadBonuses();
    this.createUI(canvasId);
  }

  private createUI(canvasId: string): void {
    const canvas = document.getElementById(canvasId)!;
    canvas.innerHTML = '';

    this.bonusDisplay = document.createElement('div');
    this.bonusDisplay.className = 'bonus-display';
    this.bonusDisplay.textContent = `Бонусы: ${this.bonuses}`;
    canvas.appendChild(this.bonusDisplay);

    this.spinButton = document.createElement('button');
    this.spinButton.className = 'spin-button';
    this.spinButton.textContent = 'Крутить колесо';
    this.spinButton.disabled = this.bonuses <= 0;
    this.spinButton.addEventListener('click', () => this.spinWheel());
    canvas.appendChild(this.spinButton);

    this.prizeDisplay = document.createElement('div');
    this.prizeDisplay.className = 'prize-display';
    this.prizeDisplay.textContent = '';
    canvas.appendChild(this.prizeDisplay);
  }

  private spinWheel(): void {
    if (this.spinning || this.bonuses <= 0) return;
    this.spinning = true;
    this.bonuses--;
    this.saveBonuses();
    this.updateBonusDisplay();

    const discounts = [
    '10% скидка на все заказы в будние дни с 12:00 до 15:00',
    '10% скидка при заказе от 2000 рублей в ресторанах-партнёрах',
    '20% скидка на бизнес-ланчи в ресторанах сети «Евразия»',
    '20% скидка на первый заказ в приложении',
    '30% скидка на доставку из ресторанов азиатской кухни',
    '30% скидка на заказ в «Вкусно — и точка» при заказе от 1500 рублей',
    '30% скидка на месячный абонемент доставки',
    '50% скидка на десерты в кафе «Шоколадница»',
    '50% скидка на второй сет роллов в «ЁбиДоёби»',
    '50% скидка на заказ в воскресенье до 16:00',
    '100% скидка на десерт при заказе от 3000 рублей',
    '100% скидка на доставку при заказе от 5000 рублей'
];

    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * discounts.length);
      this.prizeDisplay.textContent = discounts[randomIndex];
      count++;
      if (count >= 30) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * discounts.length);
        this.prizeDisplay.textContent = `Вы выиграли: ${discounts[finalIndex]}`;
        this.spinning = false;
      }
    }, 100);
  }

  private updateBonusDisplay(): void {
    this.bonusDisplay.textContent = `Бонусы: ${this.bonuses}`;
    this.spinButton.disabled = this.bonuses <= 0;
  }

  public addBonuses(amount: number): void {
    this.bonuses += amount;
    this.saveBonuses();
    this.updateBonusDisplay();
  }

  private loadBonuses(): void {
    const saved = localStorage.getItem('tamagotchi_bonuses');
    if (saved) this.bonuses = parseInt(saved);
  }

  private saveBonuses(): void {
    localStorage.setItem('tamagotchi_bonuses', this.bonuses.toString());
  }
}
