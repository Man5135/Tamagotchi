const phrases = [
  "Акции бы...",
  "Инвестиции — это семена будущего.",
  "Диверсификация снижает риски.",
  "Не клади все яйца в одну корзину.",
  "Вкладывай регулярно и терпеливо.",
  "Финансовая грамотность начинается с маленьких шагов."
];

const phraseElement = document.getElementById("phrase");
const feedButton = document.getElementById("feedButton");

feedButton.addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  phraseElement.textContent = phrases[randomIndex];
});
