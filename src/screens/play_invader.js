// ゲーム定数
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const INVADER_SIZE = 30;
const INVADER_SPACING = 10;
const ENEMY_SIZE = 40;
const LASER_WIDTH = 4;
const LASER_HEIGHT = 15;
const MISSILE_WIDTH = 4;
const MISSILE_HEIGHT = 15;

// ゲーム状態
let gameState = {
    level: 1,
    score: 0,
    invaders: [],
    enemies: [],
    lasers: [],
    missiles: [],
    direction: 1, // 1: 右, -1: 左
    moveTimer: 0,
    shootTimer: 0,
    enemyShootTimer: 0,
    isGameOver: false,
    isVictory: false,
    animationId: null
};

// レベル設定
const LEVEL_CONFIG = {
    1: { gridSize: 6, enemyCount: 3, enemySpeed: 3, moveInterval: 1000, shootInterval: 1500 },
    2: { gridSize: 5, enemyCount: 4, enemySpeed: 4, moveInterval: 800, shootInterval: 1200 },
    3: { gridSize: 4, enemyCount: 5, enemySpeed: 5, moveInterval: 600, shootInterval: 1000 },
    4: { gridSize: 3, enemyCount: 6, enemySpeed: 6, moveInterval: 400, shootInterval: 800 },
    5: { gridSize: 2, enemyCount: 7, enemySpeed: 7, moveInterval: 300, shootInterval: 600 }
};

// グローバルに関数を公開
window.startInvaderGame = startInvaderGame;
window.restartInvaderGame = restartInvaderGame;

// インベーダーグリッドの生成
function createInvaders() {
    const config = LEVEL_CONFIG[gameState.level];
    const gridSize = config.gridSize;
    const invaders = [];
    
    const totalWidth = gridSize * INVADER_SIZE + (gridSize - 1) * INVADER_SPACING;
    const startX = (GAME_WIDTH - totalWidth) / 2;
    const startY = 50;
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            invaders.push({
                x: startX + col * (INVADER_SIZE + INVADER_SPACING),
                y: startY + row * (INVADER_SIZE + INVADER_SPACING),
                row: row,
                col: col,
                alive: true
            });
        }
    }
    
    return invaders;
}

// 敵（防衛砲台）の生成
function createEnemies() {
    const config = LEVEL_CONFIG[gameState.level];
    const enemies = [];
    const spacing = GAME_WIDTH / (config.enemyCount + 1);
    
    for (let i = 0; i < config.enemyCount; i++) {
        enemies.push({
            x: spacing * (i + 1) - ENEMY_SIZE / 2,
            y: GAME_HEIGHT - ENEMY_SIZE - 20,
            alive: true
        });
    }
    
    return enemies;
}

// インベーダーの移動
function moveInvaders() {
    const config = LEVEL_CONFIG[gameState.level];
    let shouldDescend = false;
    
    // 端の検出
    for (let invader of gameState.invaders) {
        if (!invader.alive) continue;
        
        const nextX = invader.x + gameState.direction * (INVADER_SIZE + INVADER_SPACING / 2);
        if (nextX < 0 || nextX + INVADER_SIZE > GAME_WIDTH) {
            shouldDescend = true;
            break;
        }
    }
    
    if (shouldDescend) {
        // 降下して方向転換
        gameState.direction *= -1;
        for (let invader of gameState.invaders) {
            if (invader.alive) {
                invader.y += INVADER_SIZE / 2;
            }
        }
    } else {
        // 横移動
        for (let invader of gameState.invaders) {
            if (invader.alive) {
                invader.x += gameState.direction * (INVADER_SIZE + INVADER_SPACING / 2);
            }
        }
    }
    
    // 地面到達チェック（勝利条件）
    for (let invader of gameState.invaders) {
        if (invader.alive && invader.y + INVADER_SIZE > GAME_HEIGHT - 100) {
            victory();
        }
    }
}

// 最下列のインベーダーを取得
function getBottomRowInvaders() {
    const bottomInvaders = [];
    const aliveInvaders = gameState.invaders.filter(inv => inv.alive);
    
    // 各列の最下列のインベーダーを探す
    const columnMap = new Map();
    
    for (let invader of aliveInvaders) {
        const col = invader.col;
        if (!columnMap.has(col) || invader.row > columnMap.get(col).row) {
            columnMap.set(col, invader);
        }
    }
    
    return Array.from(columnMap.values());
}

// インベーダーのレーザー発射
function shootLaser() {
    const bottomInvaders = getBottomRowInvaders();
    if (bottomInvaders.length === 0) return;
    
    // ランダムに選んで発射
    const shooter = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
    
    gameState.lasers.push({
        x: shooter.x + INVADER_SIZE / 2 - LASER_WIDTH / 2,
        y: shooter.y + INVADER_SIZE,
        active: true
    });
}

// 敵のミサイル発射
function shootMissile() {
    const config = LEVEL_CONFIG[gameState.level];
    const aliveEnemies = gameState.enemies.filter(e => e.alive);
    if (aliveEnemies.length === 0) return;
    
    let targetX = GAME_WIDTH / 2; // デフォルト
    
    // AIレベルに応じた狙撃
    if (gameState.level === 1) {
        // ランダム射撃
        const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        targetX = shooter.x + ENEMY_SIZE / 2;
    } else if (gameState.level === 2) {
        // 最下列を狙う
        const bottomInvaders = getBottomRowInvaders();
        if (bottomInvaders.length > 0) {
            const target = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
            targetX = target.x + INVADER_SIZE / 2;
        }
    } else {
        // レベル3以上：予測射撃
        const bottomInvaders = getBottomRowInvaders();
        if (bottomInvaders.length > 0) {
            const target = bottomInvaders[Math.floor(Math.random() * bottomInvaders.length)];
            targetX = target.x + INVADER_SIZE / 2 + gameState.direction * 30;
        }
    }
    
    // targetXに最も近い敵が発射
    let shooter = aliveEnemies[0];
    let minDist = Math.abs(shooter.x - targetX);
    
    for (let enemy of aliveEnemies) {
        const dist = Math.abs(enemy.x - targetX);
        if (dist < minDist) {
            minDist = dist;
            shooter = enemy;
        }
    }
    
    gameState.missiles.push({
        x: shooter.x + ENEMY_SIZE / 2 - MISSILE_WIDTH / 2,
        y: shooter.y,
        active: true
    });
}

// 弾の更新
function updateProjectiles() {
    const config = LEVEL_CONFIG[gameState.level];
    
    // レーザーの移動
    for (let laser of gameState.lasers) {
        if (!laser.active) continue;
        laser.y += 5;
        
        // 画面外
        if (laser.y > GAME_HEIGHT) {
            laser.active = false;
        }
        
        // 敵との衝突判定
        for (let enemy of gameState.enemies) {
            if (!enemy.alive) continue;
            
            if (checkCollision(
                laser.x, laser.y, LASER_WIDTH, LASER_HEIGHT,
                enemy.x, enemy.y, ENEMY_SIZE, ENEMY_SIZE
            )) {
                enemy.alive = false;
                laser.active = false;
                gameState.score += 100 * gameState.level;
                updateUI();
                
                // 全滅チェック
                if (gameState.enemies.every(e => !e.alive)) {
                    levelComplete();
                }
                break;
            }
        }
    }
    
    // ミサイルの移動
    for (let missile of gameState.missiles) {
        if (!missile.active) continue;
        missile.y -= config.enemySpeed;
        
        // 画面外
        if (missile.y < 0) {
            missile.active = false;
        }
        
        // インベーダーとの衝突判定
        for (let invader of gameState.invaders) {
            if (!invader.alive) continue;
            
            if (checkCollision(
                missile.x, missile.y, MISSILE_WIDTH, MISSILE_HEIGHT,
                invader.x, invader.y, INVADER_SIZE, INVADER_SIZE
            )) {
                invader.alive = false;
                missile.active = false;
                
                // 全滅チェック
                if (gameState.invaders.every(inv => !inv.alive)) {
                    gameOver();
                }
                break;
            }
        }
    }
    
    // 非アクティブな弾を削除
    gameState.lasers = gameState.lasers.filter(l => l.active);
    gameState.missiles = gameState.missiles.filter(m => m.active);
}

// 衝突判定
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

// レンダリング
function render() {
    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';
    
    // インベーダーの描画
    for (let invader of gameState.invaders) {
        if (!invader.alive) continue;
        
        const elem = document.createElement('div');
        elem.className = 'invader';
        elem.style.left = invader.x + 'px';
        elem.style.top = invader.y + 'px';
        gameArea.appendChild(elem);
    }
    
    // 敵の描画
    for (let enemy of gameState.enemies) {
        if (!enemy.alive) continue;
        
        const elem = document.createElement('div');
        elem.className = 'enemy';
        elem.style.left = enemy.x + 'px';
        elem.style.top = enemy.y + 'px';
        gameArea.appendChild(elem);
    }
    
    // レーザーの描画
    for (let laser of gameState.lasers) {
        if (!laser.active) continue;
        
        const elem = document.createElement('div');
        elem.className = 'laser';
        elem.style.left = laser.x + 'px';
        elem.style.top = laser.y + 'px';
        gameArea.appendChild(elem);
    }
    
    // ミサイルの描画
    for (let missile of gameState.missiles) {
        if (!missile.active) continue;
        
        const elem = document.createElement('div');
        elem.className = 'missile';
        elem.style.left = missile.x + 'px';
        elem.style.top = missile.y + 'px';
        gameArea.appendChild(elem);
    }
}

// UIの更新
function updateUI() {
    document.getElementById('score-value').textContent = gameState.score;
    document.getElementById('level-value').textContent = gameState.level;
    
    const aliveInvaders = gameState.invaders.filter(inv => inv.alive).length;
    const totalInvaders = gameState.invaders.length;
    document.getElementById('invaders-value').textContent = `${aliveInvaders}/${totalInvaders}`;
    
    const aliveEnemies = gameState.enemies.filter(e => e.alive).length;
    const totalEnemies = gameState.enemies.length;
    document.getElementById('enemies-value').textContent = `${aliveEnemies}/${totalEnemies}`;
}

// ゲームオーバー
function gameOver() {
    gameState.isGameOver = true;
    cancelAnimationFrame(gameState.animationId);
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('game-over-message').textContent = '侵略失敗...';
    document.getElementById('final-score').textContent = gameState.score;
}

// 勝利
function victory() {
    gameState.isVictory = true;
    cancelAnimationFrame(gameState.animationId);
    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('game-over-message').textContent = '地球侵略成功！';
    document.getElementById('final-score').textContent = gameState.score;
}

// レベルクリア
function levelComplete() {
    if (gameState.level >= 5) {
        // 全レベルクリア
        gameState.isVictory = true;
        cancelAnimationFrame(gameState.animationId);
        document.getElementById('game-over').classList.remove('hidden');
        document.getElementById('game-over-message').textContent = `全レベルクリア！`;
        document.getElementById('final-score').textContent = gameState.score;
    } else {
        // 次のレベルへ
        gameState.level++;
        gameState.score += 500;
        initLevel();
    }
}

// レベル初期化
function initLevel() {
    gameState.invaders = createInvaders();
    gameState.enemies = createEnemies();
    gameState.lasers = [];
    gameState.missiles = [];
    gameState.direction = 1;
    gameState.moveTimer = 0;
    gameState.shootTimer = 0;
    gameState.enemyShootTimer = 0;
    updateUI();
}

// メインゲームループ
let lastTime = 0;
function gameLoop(currentTime) {
    if (gameState.isGameOver || gameState.isVictory) return;
    
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    const config = LEVEL_CONFIG[gameState.level];
    
    // インベーダーの移動
    gameState.moveTimer += deltaTime;
    if (gameState.moveTimer >= config.moveInterval) {
        moveInvaders();
        gameState.moveTimer = 0;
    }
    
    // インベーダーの射撃
    gameState.shootTimer += deltaTime;
    if (gameState.shootTimer >= config.shootInterval) {
        shootLaser();
        gameState.shootTimer = 0;
    }
    
    // 敵の射撃
    gameState.enemyShootTimer += deltaTime;
    if (gameState.enemyShootTimer >= config.shootInterval * 0.8) {
        shootMissile();
        gameState.enemyShootTimer = 0;
    }
    
    // 弾の更新
    updateProjectiles();
    
    // 描画
    render();
    
    gameState.animationId = requestAnimationFrame(gameLoop);
}

// ゲーム開始
function startInvaderGame() {
    console.log('Invader Game starting...');
    
    // ゲーム状態のリセット
    gameState.level = 1;
    gameState.score = 0;
    gameState.isGameOver = false;
    gameState.isVictory = false;
    
    if (gameState.animationId) {
        cancelAnimationFrame(gameState.animationId);
    }
    
    // レベル初期化
    initLevel();
    
    // ゲームオーバー表示を隠す
    document.getElementById('game-over').classList.add('hidden');
    
    // ゲームループ開始
    lastTime = performance.now();
    gameState.animationId = requestAnimationFrame(gameLoop);
    
    console.log('Invader Game started!');
}

// ゲーム再スタート
function restartInvaderGame() {
    startInvaderGame();
}

