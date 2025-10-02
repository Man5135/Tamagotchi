export class TouchInput {
  private element: HTMLElement;
  private onMove: (deltaX: number) => void;
  private startX: number = 0;
  private isDragging: boolean = false;

  constructor(element: HTMLElement, onMove: (deltaX: number) => void) {
    this.element = element;
    this.onMove = onMove;
    this.init();
  }

  private init(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    this.startX = e.touches[0].clientX;
    this.isDragging = true;
  }

  private handleTouchMove(e: TouchEvent): void {
    if (!this.isDragging) return;
    e.preventDefault();
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - this.startX;
    this.onMove(deltaX);
    this.startX = currentX;
  }

  private handleTouchEnd(e: TouchEvent): void {
    this.isDragging = false;
  }
}
