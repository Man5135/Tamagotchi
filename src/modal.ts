export class Modal {
  private modal: HTMLElement;
  private closeButton: HTMLElement;

  constructor(modalId: string, closeButtonId: string = 'closeModal') {
    this.modal = document.getElementById(modalId)!;
    this.closeButton = document.getElementById(closeButtonId)!;
    this.init();
  }

  private init(): void {
    this.closeButton.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  public open(): void {
    this.modal.classList.add('show');
  }

  public close(): void {
    this.modal.classList.remove('show');
  }
}
