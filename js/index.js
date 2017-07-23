// CANVAS SETUP

var game = new fabric.Canvas('game');
game.getContext('2d');

game.setDimensions({
  height: window.innerHeight,
  width: window.innerWidth,
})

// CHARACTER

let dude = new fabric.Rect({
  left: 100,
  top: window.innerHeight/2 - 50,
  width: 50,
  height: 50,
  fill: 'red',
})

game.add(dude)

function moveDude(difference) {
  let options = {
    duration: 10,
    onChange: game.renderAll.bind(game),
    easing: fabric.util.ease.easeInQuad(),
  }
  let position = dude.getTop() + difference;
  if (position > 0 && position < window.innerHeight) {
    dude.animate('top', position, options)
  }
}

function detectHit() {
  dude.setFill('black')
  let sound = new Audio('./audio/hit.mp3');
  sound.play();
  window.setTimeout(() => dude.setFill('red'), 200)
}

function generateObstacle() {
  let width = 50;
  let speed = 5000;
  let minHeight = window.innerHeight / 3;
  let maxHeight = minHeight * 2;
  let topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
  let bottomHeight = window.innerHeight - topHeight;
  let topObstacle = new fabric.Rect({
    left: window.innerWidth,
    top: 0,
    height: topHeight - 50,
    width,
    fill: 'blue',
  });
  let bottomObstacle = new fabric.Rect({
    left: window.innerWidth,
    top: topHeight + 50,
    height: bottomHeight,
    width,
    fill: 'yellow',
  });
  game.add(topObstacle);
  game.add(bottomObstacle);
  let options = {
    duration: speed,
    onChange: () => {
      let topIntersect = topObstacle.intersectsWithObject(dude, true, true);
      let bottomIntersect = bottomObstacle.intersectsWithObject(dude, true, true);
      if (topIntersect || bottomIntersect) detectHit();
      return game.renderAll.bind(game)();
    },
    onComplete: () => {
      game.remove(topObstacle);
      game.remove(bottomObstacle);
    },
    easing: fabric.util.ease.easeInCubic(),
  };
  topObstacle.animate('left', -width, options);
  bottomObstacle.animate('left', -width, options);
}

window.setInterval(generateObstacle, 2000)

// EVENT LISTENERS

function handleKeyDown(e) {
  if (e.keyCode === 38) {
    // move up
    moveDude(-10);
  } else if (e.keyCode === 40) {
    // move down
    moveDude(10);
  }
}

window.addEventListener("keydown", handleKeyDown)

