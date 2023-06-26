// Configurações do jogo
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.width = 800;
var height = canvas.height = 600;

// Variáveis para controlar o estado das teclas de giro
var rotateLeft = false;
var rotateRight = false;

// Objeto jogador
var player = {
  x: width / 2,
  y: height / 2,
  size: 20,
  angle: 0,
  speed: 3,
  bullets: [],
  destroyedAsteroids: 0
};

// Array de asteroides
var asteroids = [];

// Variável para verificar se o jogo acabou
var gameover = false;

// Função para desenhar o jogador
function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
  ctx.restore();
}

// Função para atualizar a posição do jogador
function updatePlayer() {
  // Girar o jogador no sentido da tecla pressionada
  if (rotateLeft) {
    player.angle -= Math.PI / 180 * 5; // Girar 5 graus para a esquerda
  } else if (rotateRight) {
    player.angle += Math.PI / 180 * 5; // Girar 5 graus para a direita
  }

  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;

  // Verificar os limites da tela
  if (player.x > width) player.x = 0;
  else if (player.x < 0) player.x = width;

  if (player.y > height) player.y = 0;
  else if (player.y < 0) player.y = height;
}

// Função para desenhar os tiros
function drawBullets() {
  for (var i = 0; i < player.bullets.length; i++) {
    var bullet = player.bullets[i];
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(bullet.x, bullet.y, 4, 4);
  }
}

// Função para atualizar a posição dos tiros
function updateBullets() {
  for (var i = player.bullets.length - 1; i >= 0; i--) {
    var bullet = player.bullets[i];
    bullet.x += Math.cos(bullet.angle) * bullet.speed;
    bullet.y += Math.sin(bullet.angle) * bullet.speed;

    // Remover tiros que saíram da tela
    if (bullet.x < 0 || bullet.x > width || bullet.y < 0 || bullet.y > height) {
      player.bullets.splice(i, 1);
    }
  }
}

// Função para desenhar os asteroides
function drawAsteroids() {
  for (var i = 0; i < asteroids.length; i++) {
    var asteroid = asteroids[i];
    ctx.fillStyle = "#cccccc";
    ctx.beginPath();
    ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Função para atualizar a posição dos asteroides
function updateAsteroids() {
  // Gerar asteroides continuamente
  if (asteroids.length < 5) {
    generateAsteroid();
  }

  for (var i = asteroids.length - 1; i >= 0; i--) {
    var asteroid = asteroids[i];
    asteroid.x += asteroid.velocityX;
    asteroid.y += asteroid.velocityY;

    // Verificar os limites da tela
    if (asteroid.x > width + asteroid.radius) asteroid.x = -asteroid.radius;
    else if (asteroid.x < -asteroid.radius) asteroid.x = width + asteroid.radius;

    if (asteroid.y > height + asteroid.radius) asteroid.y = -asteroid.radius;
    else if (asteroid.y < -asteroid.radius) asteroid.y = height + asteroid.radius;

    // Verificar colisão com a nave
    var dx = asteroid.x - player.x;
    var dy = asteroid.y - player.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < asteroid.radius + player.size / 2) {
      // Colisão detectada! Game over
      gameover = true;
    }
  }

  // Lógica de colisão entre asteroides e tiros
  for (var i = asteroids.length - 1; i >= 0; i--) {
    var asteroid = asteroids[i];

    for (var j = player.bullets.length - 1; j >= 0; j--) {
      var bullet = player.bullets[j];

      var dx = asteroid.x - bullet.x;
      var dy = asteroid.y - bullet.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < asteroid.radius) {
        // Colisão detectada! Remover asteroide e tiro
        asteroids.splice(i, 1);
        player.bullets.splice(j, 1);

        // Incrementar contador de asteroides destruídos
        player.destroyedAsteroids++;
      }
    }
  }
}

// Função para criar um tiro
function shoot() {
  var bullet = {
    x: player.x + Math.cos(player.angle) * player.size,
    y: player.y + Math.sin(player.angle) * player.size,
    angle: player.angle,
    speed: 5
  };

  player.bullets.push(bullet);
}

// Função para gerar um asteroide
function generateAsteroid() {
  var asteroid = {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 30 + 10,
    velocityX: Math.random() * 2 - 1,
    velocityY: Math.random() * 2 - 1
  };

  asteroids.push(asteroid);
}

// Função para desenhar o jogo
function draw() {
  // Limpar o canvas
  ctx.clearRect(0, 0, width, height);

  // Desenhar o jogador
  drawPlayer();

  // Desenhar os tiros
  drawBullets();

  // Desenhar os asteroides
  drawAsteroids();

  // Desenhar contador de asteroides destruídos
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText("Asteroides destruídos: " + player.destroyedAsteroids, 10, 20);

  // Tela de game over
  if (gameover) {
    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", width / 2 - 80, height / 2);
  }

  // Chamar a função novamente após um intervalo de tempo
  requestAnimationFrame(draw);
}

// Eventos de teclado para controlar o estado das teclas de giro
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 37) { // Esquerda
    rotateLeft = true;
  } else if (event.keyCode === 39) { // Direita
    rotateRight = true;
  } else if (event.keyCode === 32) { // Barra de espaço
    shoot();
  }
});

document.addEventListener("keyup", function(event) {
  if (event.keyCode === 37) { // Esquerda
    rotateLeft = false;
  } else if (event.keyCode === 39) { // Direita
    rotateRight = false;
  }
});

// Função para iniciar o jogo
function startGame() {
  // Gerar os asteroides
  for (var i = 0; i < 5; i++) {
    generateAsteroid();
  }

  // Iniciar o loop do jogo
  gameLoop();
}

// ...

// Variável para verificar se o jogo acabou
var gameover = false;

// Função para reiniciar o jogo
function restartGame() {
  // Reiniciar as variáveis do jogador e asteroides
  player.x = width / 2;
  player.y = height / 2;
  player.angle = 0;
  player.bullets = [];
  player.destroyedAsteroids = 0;
  asteroids = [];
  gameover = false;

  // Gerar os asteroides novamente
  for (var i = 0; i < 5; i++) {
    generateAsteroid();
  }
}

// Evento de teclado para reiniciar o jogo
document.addEventListener("keydown", function(event) {
  if (event.keyCode === 13 && gameover) { // Enter
    restartGame();
  }
});

// ...

// Tela de game over
if (gameover) {
  ctx.fillStyle = "#ffffff";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", width / 2 - 80, height / 2);
  ctx.fillText("Pressione Enter para jogar novamente", width / 2 - 200, height / 2 + 40);
}

// ...

// Iniciar o jogo
startGame();


// Função principal do loop do jogo
function gameLoop() {
  // Verificar se o jogo acabou
  if (!gameover) {
    // Atualizar a posição do jogador
    updatePlayer();

    // Atualizar a posição dos tiros
    updateBullets();

    // Atualizar a posição dos asteroides
    updateAsteroids();
  }

  // Desenhar o jogo
  draw();

  // Chamar a função novamente após um intervalo de tempo
  setTimeout(gameLoop, 1000 / 60);
}

// Iniciar o jogo
startGame();
