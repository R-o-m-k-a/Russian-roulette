// Игровые переменные
const gameState = {
    round: 1,
    maxRounds: 3,
    player: {
        health: 100,
        maxHealth: 100,
        damage: 10,
        accuracy: 60, // в процентах
        upgrades: []
    },
    dealer: {
        health: 100,
        maxHealth: 100,
        damage: 10,
        accuracy: 50, // в процентах
        upgrades: []
    },
    money: 100,
    gameOver: false
};

// DOM элементы
const elements = {
    round: document.getElementById('round'),
    playerHealth: document.getElementById('player-health'),
    playerHealthText: document.getElementById('player-health-text'),
    playerDamage: document.getElementById('player-damage'),
    playerAccuracy: document.getElementById('player-accuracy'),
    playerUpgrades: document.getElementById('player-upgrades'),
    dealerHealth: document.getElementById('dealer-health'),
    dealerHealthText: document.getElementById('dealer-health-text'),
    dealerDamage: document.getElementById('dealer-damage'),
    dealerAccuracy: document.getElementById('dealer-accuracy'),
    dealerUpgrades: document.getElementById('dealer-upgrades'),
    revolver: document.getElementById('revolver'),
    shootBtn: document.getElementById('shoot-btn'),
    messageBox: document.getElementById('message-box'),
    shop: document.getElementById('shop'),
    continueBtn: document.getElementById('continue-btn'),
    gameOverScreen: document.getElementById('game-over'),
    resultText: document.getElementById('result-text'),
    resultMessage: document.getElementById('result-message'),
    restartBtn: document.getElementById('restart-btn'),
    shopItems: document.querySelectorAll('.shop-item')
};

// Улучшения
const upgrades = {
    damage: {
        name: "Усиленный патрон",
        description: "+5 к урону",
        cost: 50,
        apply: (target) => {
            target.damage += 5;
            return { damage: target.damage };
        }
    },
    accuracy: {
        name: "Прицел",
        description: "+10% к точности",
        cost: 50,
        apply: (target) => {
            target.accuracy += 10;
            return { accuracy: target.accuracy };
        }
    },
    health: {
        name: "Бронежилет",
        description: "+20 к здоровью",
        cost: 50,
        apply: (target) => {
            target.maxHealth += 20;
            target.health += 20;
            return { health: target.health, maxHealth: target.maxHealth };
        }
    }
};

// Инициализация игры
function initGame() {
    gameState.round = 1;
    gameState.player = {
        health: 100,
        maxHealth: 100,
        damage: 10,
        accuracy: 60,
        upgrades: []
    };
    gameState.dealer = {
        health: 100,
        maxHealth: 100,
        damage: 10,
        accuracy: 50,
        upgrades: []
    };
    gameState.money = 100;
    gameState.gameOver = false;

    updateUI();
    elements.gameOverScreen.classList.add('hidden');
    elements.shop.classList.add('hidden');
    elements.messageBox.textContent = "Нажмите 'Стрелять', чтобы начать игру";
    elements.shootBtn.disabled = false;
}

// Обновление интерфейса
function updateUI() {
    // Игрок
    elements.round.textContent = gameState.round;
    elements.playerHealth.style.width = `${(gameState.player.health / gameState.player.maxHealth) * 100}%`;
    elements.playerHealthText.textContent = gameState.player.health;
    elements.playerDamage.textContent = gameState.player.damage;
    elements.playerAccuracy.textContent = gameState.player.accuracy;
    
    // Дилер
    elements.dealerHealth.style.width = `${(gameState.dealer.health / gameState.dealer.maxHealth) * 100}%`;
    elements.dealerHealthText.textContent = gameState.dealer.health;
    elements.dealerDamage.textContent = gameState.dealer.damage;
    elements.dealerAccuracy.textContent = gameState.dealer.accuracy;
    
    // Обновление улучшений игрока
    elements.playerUpgrades.innerHTML = '';
    gameState.player.upgrades.forEach(upgrade => {
        const div = document.createElement('div');
        div.className = 'upgrade';
        div.textContent = `${upgrade.name}: ${upgrade.description}`;
        elements.playerUpgrades.appendChild(div);
    });
    
    // Обновление улучшений дилера
    elements.dealerUpgrades.innerHTML = '';
    gameState.dealer.upgrades.forEach(upgrade => {
        const div = document.createElement('div');
        div.className = 'upgrade';
        div.textContent = `${upgrade.name}: ${upgrade.description}`;
        elements.dealerUpgrades.appendChild(div);
    });
}

// Выстрел игрока
function playerShoot() {
    elements.shootBtn.disabled = true;
    elements.revolver.classList.add('spin');
    
    setTimeout(() => {
        elements.revolver.classList.remove('spin');
        
        const isHit = Math.random() * 100 <= gameState.player.accuracy;
        
        if (isHit) {
            // Попадание
            gameState.dealer.health -= gameState.player.damage;
            if (gameState.dealer.health < 0) gameState.dealer.health = 0;
            
            elements.messageBox.textContent = `Вы попали и нанесли ${gameState.player.damage} урона дилеру!`;
            elements.dealerHealth.style.width = `${(gameState.dealer.health / gameState.dealer.maxHealth) * 100}%`;
            elements.dealerHealthText.textContent = gameState.dealer.health;
            
            // Анимация попадания
            elements.revolver.classList.add('shot');
            setTimeout(() => {
                elements.revolver.classList.remove('shot');
            }, 300);
        } else {
            // Промах
            elements.messageBox.textContent = "Вы промахнулись!";
        }
        
        // Проверка на победу игрока
        if (gameState.dealer.health <= 0) {
            endRound(true);
            return;
        }
        
        // Ход дилера
        setTimeout(dealerShoot, 1500);
    }, 1000);
}

// Выстрел дилера
function dealerShoot() {
    elements.revolver.classList.add('spin');
    
    setTimeout(() => {
        elements.revolver.classList.remove('spin');
        
        const isHit = Math.random() * 100 <= gameState.dealer.accuracy;
        
        if (isHit) {
            // Попадание
            gameState.player.health -= gameState.dealer.damage;
            if (gameState.player.health < 0) gameState.player.health = 0;
            
            elements.messageBox.textContent = `Дилер попал и нанес вам ${gameState.dealer.damage} урона!`;
            elements.playerHealth.style.width = `${(gameState.player.health / gameState.player.maxHealth) * 100}%`;
            elements.playerHealthText.textContent = gameState.player.health;
            
            // Анимация попадания
            elements.revolver.classList.add('shot');
            setTimeout(() => {
                elements.revolver.classList.remove('shot');
            }, 300);
        } else {
            // Промах
            elements.messageBox.textContent = "Дилер промахнулся!";
        }
        
        // Проверка на победу дилера
        if (gameState.player.health <= 0) {
            endRound(false);
            return;
        }
        
        // Продолжение раунда
        elements.shootBtn.disabled = false;
    }, 1000);
}

// Завершение раунда
function endRound(playerWon) {
    if (playerWon) {
        elements.messageBox.textContent = `Вы победили в раунде ${gameState.round}!`;
        gameState.money += 50;
    } else {
        elements.messageBox.textContent = `Дилер победил в раунде ${gameState.round}!`;
    }
    
    gameState.round++;
    
    // Проверка на завершение игры
    if (gameState.round > gameState.maxRounds || gameState.player.health <= 0 || gameState.dealer.health <= 0) {
        endGame(playerWon);
        return;
    }
    
    // Магазин между раундами
    setTimeout(() => {
        openShop();
    }, 2000);
}

// Открытие магазина
function openShop() {
    elements.shop.classList.remove('hidden');
    
    // Обновление кнопок покупки
    elements.shopItems.forEach(item => {
        const upgradeType = item.getAttribute('data-upgrade');
        const btn = item.querySelector('.btn-buy');
        
        btn.textContent = `Купить (${upgrades[upgradeType].cost})`;
        btn.disabled = gameState.money < upgrades[upgradeType].cost;
        
        btn.onclick = () => {
            buyUpgrade(upgradeType);
        };
    });
}

// Покупка улучшения
function buyUpgrade(type) {
    const upgrade = upgrades[type];
    
    if (gameState.money >= upgrade.cost) {
        gameState.money -= upgrade.cost;
        const result = upgrade.apply(gameState.player);
        gameState.player.upgrades.push({
            name: upgrade.name,
            description: upgrade.description
        });
        
        updateUI();
        elements.messageBox.textContent = `Вы купили ${upgrade.name}!`;
        
        // Обновление кнопок покупки
        elements.shopItems.forEach(item => {
            const upgradeType = item.getAttribute('data-upgrade');
            const btn = item.querySelector('.btn-buy');
            btn.disabled = gameState.money < upgrades[upgradeType].cost;
        });
    }
}

// Завершение игры
function endGame(playerWon) {
    gameState.gameOver = true;
    
    if (playerWon) {
        elements.resultText.textContent = "Поздравляем! Вы победили!";
        elements.resultMessage.textContent = `Вы обыграли дилера в ${gameState.round - 1} раундах из ${gameState.maxRounds}.`;
    } else {
        elements.resultText.textContent = "Игра окончена. Вы проиграли.";
        elements.resultMessage.textContent = `Дилер победил вас в ${gameState.round - 1} раундах из ${gameState.maxRounds}.`;
    }
    
    setTimeout(() => {
        elements.gameOverScreen.classList.remove('hidden');
    }, 2000);
}

// Продолжить игру (после магазина)
function continueGame() {
    // Сброс здоровья для нового раунда
    gameState.player.health = gameState.player.maxHealth;
    gameState.dealer.health = gameState.dealer.maxHealth;
    
    // Улучшение дилера
    const dealerUpgradeTypes = Object.keys(upgrades);
    const randomUpgradeType = dealerUpgradeTypes[Math.floor(Math.random() * dealerUpgradeTypes.length)];
    const dealerUpgrade = upgrades[randomUpgradeType];
    dealerUpgrade.apply(gameState.dealer);
    gameState.dealer.upgrades.push({
        name: dealerUpgrade.name,
        description: dealerUpgrade.description
    });
    
    elements.shop.classList.add('hidden');
    updateUI();
    elements.messageBox.textContent = `Раунд ${gameState.round}. Нажмите "Стрелять", чтобы начать.`;
    elements.shootBtn.disabled = false;
}

// Обработчики событий
elements.shootBtn.addEventListener('click', playerShoot);
elements.continueBtn.addEventListener('click', continueGame);
elements.restartBtn.addEventListener('click', initGame);

// Запуск игры
initGame();