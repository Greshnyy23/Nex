// Звуки для действий
const clickSound = new Audio('click-sound.mp3');
const boostSound = new Audio('boost-sound.mp3');
const upgradeSound = new Audio('upgrade-sound.mp3');
const prestigeSound = new Audio('prestige-sound.mp3');

// Загружаем сохраненные данные из localStorage
let savedData;
try {
    savedData = JSON.parse(localStorage.getItem('gameData')) || {};
} catch (e) {
    console.error("Ошибка при загрузке данных:", e);
    savedData = {};
}

let resources = savedData.resources || 0;
let multiplier = savedData.multiplier || 1;
let autoClicker = savedData.autoClicker || 0;
let highscore = savedData.highscore || 0;
let energy = savedData.energy || 100;
let prestigeMultiplier = savedData.prestigeMultiplier || 1;
let boostActive = savedData.boostActive || false;
let upgradeCost = savedData.upgradeCost || 50; // Начальная цена улучшения

const resourceDisplay = document.getElementById('resource-count');
const highscoreDisplay = document.getElementById('highscore');
const energyDisplay = document.getElementById('energy');
const incomeDisplay = document.getElementById('income');
const clickButton = document.getElementById('click-button');
const upgradeButton = document.getElementById('upgrade-button');
const autoClickerButton = document.getElementById('auto-clicker-button');
const boostButton = document.getElementById('boost-button');
const prestigeButton = document.getElementById('prestige-button');
const notification = document.getElementById('notification');
const boostIndicator = document.getElementById('boost-indicator');
const upgradeCostDisplay = document.getElementById('upgrade-cost');

let saveTimeout;

function saveGame() {
    clearTimeout(saveTimeout); 
    saveTimeout = setTimeout(() => {
        const gameData = {
            resources,
            multiplier,
            autoClicker,
            highscore,
            energy,
            prestigeMultiplier,
            boostActive,
            upgradeCost
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }, 2000);
}

function updateUI() {
    resourceDisplay.textContent = resources;
    highscoreDisplay.textContent = highscore;
    energyDisplay.textContent = `${energy}/100`;
    incomeDisplay.textContent = autoClicker;
    upgradeCostDisplay.textContent = upgradeCost; 
}

function showNotification(text, color = 'rgba(0, 255, 0, 0.8)') {
    notification.textContent = text;
    notification.style.background = color;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 1500);
}

clickButton.addEventListener('click', () => {
    if (energy > 0) {
        let gained = multiplier * prestigeMultiplier * (boostActive ? 2 : 1);
        resources += gained;
        energy--;
        if (resources > highscore) highscore = resources;
        updateUI();
        clickSound.play(); // Воспроизводим звук при клике
        saveGame(); 
    }
});

boostButton.addEventListener('click', () => {
    if (!boostActive) {
        boostActive = true;
        boostIndicator.classList.add('active');
        showNotification('x2 Буст активирован!', 'rgba(255, 0, 255, 0.8)');
        boostSound.play(); // Воспроизведение звука для активации буста
        setTimeout(() => {
            boostActive = false;
            boostIndicator.classList.remove('active');
            showNotification('x2 Буст закончился!', 'rgba(255, 0, 0, 0.8)');
            saveGame(); 
        }, 10000);
    }
});

prestigeButton.addEventListener('click', () => {
    if (resources >= 1000) {
        prestigeMultiplier *= 2;
        resources = 0;
        autoClicker = 0;
        updateUI();
        prestigeSound.play(); // Звук для престижа
        showNotification('Престиж! Ваш множитель x' + prestigeMultiplier, 'rgba(255, 165, 0, 0.9)');
        saveGame(); 
    }
});

autoClickerButton.addEventListener('click', () => {
    if (resources >= 50) {
        autoClicker += 1;
        resources -= 50; 
        updateUI();
        showNotification('Автокликер активирован!', 'rgba(0, 255, 255, 0.8)');
        saveGame(); 
    }
});

upgradeButton.addEventListener('click', () => {
    if (resources >= upgradeCost) {
        resources -= upgradeCost;
        multiplier *= 1.5; 
        upgradeCost = Math.floor(upgradeCost * 1.5); 
        updateUI();
        upgradeSound.play(); // Звук для улучшения
        showNotification('Улучшение куплено!', 'rgba(0, 255, 255, 0.8)');
        saveGame(); 
    } else {
        showNotification('Недостаточно ресурсов для улучшения.', 'rgba(255, 0, 0, 0.8)');
    }
});

setInterval(() => {
    if (autoClicker > 0) {
        resources += autoClicker * prestigeMultiplier;
        updateUI();
        saveGame(); 
    }
    if (energy < 100) energy++;
}, 500);

updateUI();
