kaboom({
  fullscreen: true,
  clearColor: [0.2, 0.7, 1, 1],
  global: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("ground", "block.png");
loadSprite("ground_SHHHH", "block.png");
loadSprite("blue_block", "block_blue.png");
loadSprite("star", "star.png");
loadSprite("mario_mamareya", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("rarrr", "dino.png");
loadSprite("peach", "princes.png");
loadSprite("lucky_block", "surprise.png");
loadSprite("bob", "spongebob.png");
loadSprite("coin", "coin.png");
loadSprite("ev_mushroom", "evil_mushroom.png");
loadSprite("loop", "loop.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("zad", "z.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("E", "e (3).jpg");

loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
let min = 0;
let seconds = 0;
let score = 0;

setInterval(() => {
  seconds++;
}, 1000);

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obj");

  let timerText = add(text("00:" + seconds));
  let scorelabel = add([text("score: " + score)]);

  const map = [
    "                              =                          ",
    "                              =                          ",
    "                              =                          ",
    "                              =                          ",
    "                              =                          ",
    "                              =                          ",
    "                              =      =                   ",
    "                                     =                   ",
    "                                     =                   ",
    "                           ====      =                   ",
    "                              =      =                   ",
    "                        @     =      =                   ",
    "                              =      =                   ",
    "                           *  =      =                   ",
    "                              =      =                   ",
    "                        @     =      =                   ",
    "                              =      =                   ",
    "                           @  =      =                   ",
    "                              =      ==!===              ",
    "                        *     =      S    =              ",
    "                           @  =      S    =        ^     ",
    "                      e       S      Srp                 ",
    "            ===================  =============   ===========================",
    "                                                         ",
    "                                                @        ",
    "                                                         ",
    "                                 @   @@@   @@@@          ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                                         ",
    "                                      =                   ",
    "                                      =                   ",
    // "                      =====      =                    ",
    "              E    E    E    E    E    E    E    E       ",
    "                                                         ",
    "                                                         ",
  ];

  const mapsymbols = {
    width: 20,
    height: 20,
    "=": [sprite("ground"), solid()],
    S: [sprite("ground_SHHHH")],
    "+": [sprite("mario_mamareya"), solid()],
    "-": [sprite("mushroom"), solid()],
    "*": [sprite("lucky_block"), solid(), "lucky"],
    "!": [sprite("lucky_block"), solid(), "unlucky"],
    "%": [sprite("lucky_block"), solid()],
    p: [sprite("peach"), solid()],
    r: [sprite("rarrr"), solid()],
    "#": [sprite("bob"), solid()],
    "^": [sprite("pipe"), solid(), "pipe"],
    E: [sprite("E"), solid()],
    $: [sprite("blue_block"), solid()],
    "@": [sprite("unboxed"), solid(), "unboxed"],
    m2: [sprite("mushroom"), solid(), body(), "mushroom"],
    "~": [sprite("coin"), "coins"],
    e: [sprite("ev_mushroom"), solid(), body(), "ev_mushroom"],
  };

  const gameLevel = addLevel(map, mapsymbols);
  let move_speed = 120;
  const player = add([
    sprite("mario_mamareya"),
    solid(),
    pos(300, 0),
    body(),
    origin("bot"),
    big(),
  ]);
  keyDown("d", () => {
    player.move(move_speed, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(300);
      play("jump");
    }
  });

  keyDown("a", () => {
    player.move(-move_speed, 0);
  });
  player.on("headbump", (obj) => {
    if (obj.is("lucky")) {
      destroy(obj);
      gameLevel.spawn("@", obj.gridPos);
      gameLevel.spawn("~", obj.gridPos.sub(0, 1));
    }
    if (obj.is("unlucky")) {
      destroy(obj);
      gameLevel.spawn("@", obj.gridPos);
      gameLevel.spawn("m2", obj.gridPos.sub(0, 1));
    }
  });

  action("mushroom", (obj) => {
    obj.move(50, 0);
  });

  action("ev_mushroom", (obj) => {
    obj.move(50, 0);
  });

  player.collides("coins", (obj) => {
    destroy(obj);
    score += 5;
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
    player.biggify(15);
    move_speed = move_speed + 120;
  });

  player.collides("pipe", () => {
    go("win");
  });

  player.collides("rarrr", (obj) => {
    destroy(obj);
    gameLevel.spawn("coins", obj.gridPos.sub(0, 1));
  });
  const FALL_DOWN = 1180;
  player.action(() => {
    camPos(player.pos);
    destroy(timerText);
    scorelabel.pos = player.pos.sub(400, 180);
    scorelabel.text = "score: " + score;
    timerText = add(text("00:" + seconds));
    timerText.pos = player.pos.sub(400, 200);

    console.log(player.pos.y);
    if (player.pos.y >= FALL_DOWN) {
      go("lose");
    }
  });
  let isJumping = false;

  player.collides("ev_mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
    } else {
      go("lose");
    }
  });

  player.action(() => {
    isJumping = !player.grounded();
  });

  // stop
});

scene("lose", () => {
  add([
    text("game over", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  add([
    text("space to restart", 20),
    origin("center"),
    pos(width() / 2, height() / 2 + 200),
  ]);

  keyDown("space", () => {
    go("game");
    seconds = 0;
    score = 0;
  });

  // stop
});

scene("win", () => {
  add([
    text("you won\n (ya wo)", 60),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
});

start("game");
