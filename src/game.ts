import { TouchInput } from './input.js';

export class Game {
  private canvas: HTMLElement;
  private bucket!: HTMLElement;
  private bucketPosition: number = 50;
  private fallingObjects: HTMLElement[] = [];
  private score: number = 0;
  private winScore: number = 10;
  private misses: number = 0;
  private gameLoop: number | null = null;
  private onWin: () => void;
  private onLose: () => void;
  private gameResultElement: HTMLElement | null = null;
  private scoreDisplay!: HTMLElement;
  private touchInput: TouchInput;

  constructor(canvasId: string, onWin: () => void, onLose: () => void) {
    this.canvas = document.getElementById(canvasId)!;
    this.onWin = onWin;
    this.onLose = onLose;
    this.createBucket();
    this.createScoreDisplay();
    this.touchInput = new TouchInput(this.canvas, (deltaX) => this.moveBucket(deltaX));
    this.startGame();
  }

  private createBucket(): void {
    this.bucket = document.createElement('div');
    this.bucket.className = 'bucket';
    this.canvas.appendChild(this.bucket);
  }

  private createScoreDisplay(): void {
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.className = 'score-display';
    this.canvas.appendChild(this.scoreDisplay);
    this.updateScoreDisplay();
  }

  private createGameResultElement(): void {
    if (!this.gameResultElement) {
      this.gameResultElement = document.createElement('div');
      this.gameResultElement.className = 'game-result';
      this.canvas.appendChild(this.gameResultElement);
    }
  }

  private updateScoreDisplay(): void {
    this.scoreDisplay.textContent = `Поймано: ${this.score} / ${this.winScore}`;
  }

  private moveBucket(deltaX: number): void {
    const canvasWidth = this.canvas.clientWidth;
    const bucketWidth = this.bucket.clientWidth;
    const maxLeft = 0;
    const maxRight = canvasWidth - bucketWidth;

    this.bucketPosition += (deltaX / canvasWidth) * 100;
    this.bucketPosition = Math.max(0, Math.min(100, this.bucketPosition));

    const leftPx = (this.bucketPosition / 100) * (canvasWidth - bucketWidth);
    this.bucket.style.left = `${leftPx}px`;
  }

  private startGame(): void {
    this.gameLoop = setInterval(() => {
      this.updateFallingObjects();
      this.spawnFallingObject();
    }, 100);
  }

  private canSpawnObjects: boolean = true;

  private spawnFallingObject(): void {
    if (!this.canSpawnObjects) return;
    if (Math.random() < 0.09) {
      const obj = document.createElement('div');
      obj.className = 'falling-object';
      const emojis = ['🐡', '🐠','🐟'];
      obj.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      obj.style.left = `${Math.random() * 80 + 10}%`;
      obj.style.top = '0px';
      this.canvas.appendChild(obj);
      this.fallingObjects.push(obj);
    }
  }

  private updateFallingObjects(): void {
    this.fallingObjects.forEach((obj, index) => {
      const top = parseFloat(obj.style.top || '0') + 16;
      obj.style.top = `${top}px`;

      if (this.checkCollision(obj)) {
        this.score++;
        this.updateScoreDisplay();
        obj.remove();
        this.fallingObjects.splice(index, 1);
        if (this.score >= this.winScore) {
          this.win();
        }
      } else if (top > this.canvas.clientHeight) {
        this.misses++;
        if (this.misses >= 3) {
          this.lose();
        }
        obj.remove();
        this.fallingObjects.splice(index, 1);
      }
    });
  }

  private checkCollision(obj: HTMLElement): boolean {
    const objRect = obj.getBoundingClientRect();
    const bucketRect = this.bucket.getBoundingClientRect();

    return !(objRect.right < bucketRect.left ||
             objRect.left > bucketRect.right ||
             objRect.bottom < bucketRect.top ||
             objRect.top > bucketRect.bottom);
  }

  private win(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.canSpawnObjects = false;
    this.createGameResultElement();
    if (this.gameResultElement) {
      this.gameResultElement.textContent = 'Победа';
      this.gameResultElement.classList.add('winMenu');
      this.gameResultElement.style.display = 'block';
    }
    setTimeout(() => this.onWin(), 1000);
  }

  private lose(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.canSpawnObjects = false;
    this.createGameResultElement();
    if (this.gameResultElement) {
      this.gameResultElement.textContent = 'Поражение';
      this.gameResultElement.classList.add('loseMenu');
      this.gameResultElement.style.display = 'block';
    }
    setTimeout(() => this.onLose(), 1000);
  }

  public destroy(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.fallingObjects.forEach(obj => obj.remove());
    this.bucket.remove();
    this.scoreDisplay.remove();
    if (this.gameResultElement) {
      this.gameResultElement.remove();
      this.gameResultElement = null;
    }
  }
}
