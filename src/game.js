class Game {
    constructor() {
        this.player = document.getElementById('player');
        this.gameArea = document.getElementById('game-area');
        this.hpFill = document.querySelector('.hp-fill');
        this.gameOverScreen = document.getElementById('game-over');
        
        this.playerX = 375;
        this.playerSpeed = 5;
        this.hp = 100;
        this.fires = [];
        this.fireSpawnInterval = 1000;
        this.isGameOver = false;
        
        this.keys = {
            ArrowLeft: false,
            ArrowRight: false
        };
        
        this.setupEventListeners();
        this.gameLoop();
        this.startSpawningFires();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }
    
    movePlayer() {
        if (this.keys.ArrowLeft && this.playerX > 0) {
            this.playerX -= this.playerSpeed;
        }
        if (this.keys.ArrowRight && this.playerX < this.gameArea.clientWidth - 50) {
            this.playerX += this.playerSpeed;
        }
        this.player.style.left = `${this.playerX}px`;
    }
    
    spawnFire() {
        const fire = document.createElement('div');
        fire.className = 'fire';
        fire.style.left = `${Math.random() * (this.gameArea.clientWidth - 30)}px`;
        fire.style.top = '0px';
        this.gameArea.appendChild(fire);
        
        this.fires.push({
            element: fire,
            y: 0,
            speed: 2 + Math.random() * 2
        });
    }
    
    updateFires() {
        for (let i = this.fires.length - 1; i >= 0; i--) {
            const fire = this.fires[i];
            fire.y += fire.speed;
            fire.element.style.top = `${fire.y}px`;
            
            // 衝突判定
            if (this.checkCollision(fire)) {
                this.hp -= 10;
                this.updateHPBar();
                this.gameArea.removeChild(fire.element);
                this.fires.splice(i, 1);
                
                if (this.hp <= 0) {
                    this.gameOver();
                }
            }
            // 画面外に出た炎を削除
            else if (fire.y > this.gameArea.clientHeight) {
                this.gameArea.removeChild(fire.element);
                this.fires.splice(i, 1);
            }
        }
    }
    
    checkCollision(fire) {
        const playerRect = this.player.getBoundingClientRect();
        const fireRect = fire.element.getBoundingClientRect();
        
        return !(playerRect.right < fireRect.left || 
                playerRect.left > fireRect.right || 
                playerRect.bottom < fireRect.top || 
                playerRect.top > fireRect.bottom);
    }
    
    updateHPBar() {
        this.hpFill.style.width = `${this.hp}%`;
    }
    
    gameOver() {
        this.isGameOver = true;
        this.gameOverScreen.classList.remove('hidden');
        clearInterval(this.fireSpawnTimer);
    }
    
    gameLoop() {
        if (!this.isGameOver) {
            this.movePlayer();
            this.updateFires();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    startSpawningFires() {
        this.fireSpawnTimer = setInterval(() => {
            if (!this.isGameOver) {
                this.spawnFire();
            }
        }, this.fireSpawnInterval);
    }
}

function restartGame() {
    location.reload();
}

// ゲーム開始
window.addEventListener('load', () => {
    new Game();
});
