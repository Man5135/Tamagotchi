import './style.css';
import './animations.css';

import { Modal } from './modal.js';
import { Game } from './game.js';
import { BonusMenu } from './bonusMenu.js';

const MAX_ENERGY = 3;
const REGEN_INTERVAL_HOURS = 3;
const REGEN_INTERVAL_MS = REGEN_INTERVAL_HOURS * 60 * 60 * 1000;

const phrases: string[] = [
    'Диверсифицируй портфель — меньше риск.',
    'Инвестируй регулярно, а не разово.',
    'Держи подушку безопасности в облигациях.',
    'Проверь комиссии перед сделкой.',
    'Купи валюту, когда она дешевая.',
    'Сделай досрочное погашение кредита.',
    'Управляй финансами через мобильное приложение Газпромбанка !.',
    'Сберегай деньги на депозите.',
    'Изучай рынок перед инвестированием.',
    'Используй кредитные карты для быстрого погашения долга.',
];

const phraseElement = document.getElementById("phrase") as HTMLElement;
const feedButton = document.getElementById("feedButton") as HTMLButtonElement;
const mainMenuButton = document.getElementById("main-menu") as HTMLButtonElement;
const gamepadButton = document.getElementById("gamepad") as HTMLButtonElement;

let hasWon: boolean = false;
let currentGame: Game | null = null;
let energy: number = MAX_ENERGY;
let lastRegenTime: number = Date.now();

const modal = new Modal('gameModal');

const closeModalButton = document.getElementById('closeModal')!;
closeModalButton.addEventListener('click', () => {
    if (currentGame) {
        currentGame.destroy();
        currentGame = null;
    }
    hasWon = false;
    feedButton.disabled = true;
});
const bonusModalInstance = new Modal('bonusModal', 'closeBonusModal');
const bonusMenu = new BonusMenu('bonusCanvas');

const energyDisplay = document.createElement('div');
energyDisplay.className = 'energy-display';
document.querySelector('.bear')!.appendChild(energyDisplay);

const timerDisplay = document.createElement('div');
timerDisplay.className = 'timer-display';
document.querySelector('.bear')!.appendChild(timerDisplay);

function loadEnergy() {
  const savedEnergy = localStorage.getItem('tamagotchi_energy');
  const savedTime = localStorage.getItem('tamagotchi_lastRegen');
  if (savedEnergy) energy = parseInt(savedEnergy);
  if (savedTime) lastRegenTime = parseInt(savedTime);
  const now = Date.now();
  const timePassed = now - lastRegenTime;
  const regenPoints = Math.floor(timePassed / REGEN_INTERVAL_MS);
  energy = Math.max(0, Math.min(MAX_ENERGY, energy + regenPoints));
  if (regenPoints > 0) {
    lastRegenTime += regenPoints * REGEN_INTERVAL_MS;
    saveEnergy();
  }
}

function saveEnergy() {
  localStorage.setItem('tamagotchi_energy', energy.toString());
  localStorage.setItem('tamagotchi_lastRegen', lastRegenTime.toString());
}

function updateEnergyDisplay() {
  energyDisplay.textContent = `Энергия: ${energy}/${MAX_ENERGY}`;
  gamepadButton.disabled = energy <= 0;
  if (energy < MAX_ENERGY) {
    const nextRegen = lastRegenTime + REGEN_INTERVAL_MS;
    const hoursLeft = Math.ceil((nextRegen - Date.now()) / (1000 * 60 * 60));
    timerDisplay.textContent = `До регенерации: ${hoursLeft} ч`;
  } else {
    timerDisplay.textContent = '';
  }
}

feedButton.addEventListener("click", () => {
    if (!hasWon) return;
    const randomIndex = Math.floor(Math.random() * phrases.length);
    phraseElement.textContent = phrases[randomIndex];
    phraseElement.classList.remove("animate");
    void phraseElement.offsetWidth;
    phraseElement.classList.add("animate");
    bonusMenu.addBonuses(1);
    hasWon = false;
    feedButton.disabled = true;
});

gamepadButton.addEventListener("click", () => {
    if (currentGame) {
        currentGame.destroy();
        currentGame = null;
    }
    hasWon = false;
    feedButton.disabled = true;
});

mainMenuButton.addEventListener("click", () => {
    bonusModalInstance.open();
});

gamepadButton.addEventListener("click", () => {
    if (energy <= 0) return;
    if (currentGame) {
        currentGame.destroy();
        currentGame = null;
    }
    hasWon = false;
    feedButton.disabled = true;
    energy--;
    saveEnergy();
    updateEnergyDisplay();
    modal.open();
    currentGame = new Game('gameCanvas', () => {
        hasWon = true;
        feedButton.disabled = false;
        modal.close();
        if (currentGame) {
            currentGame.destroy();
            currentGame = null;
        }
    }, () => {
        hasWon = false;
        feedButton.disabled = true;
        modal.close();
        if (currentGame) {
            currentGame.destroy();
            currentGame = null;
        }
    });
});

loadEnergy();
updateEnergyDisplay();
setInterval(updateEnergyDisplay, 60000);
