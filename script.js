const levels = [
  [['red', 'blue'], ['blue', 'red'], [], []],
  [['green', 'red', 'red'], ['green', 'blue', 'blue'], [], []],
  [['green', 'red', 'yellow'], ['yellow', 'red', 'green'], ['blue', 'blue', 'yellow'], [], []],
  [['red', 'blue', 'green', 'yellow'], ['yellow', 'green', 'red', 'blue'], [], []],
  [['orange', 'orange', 'blue'], ['blue', 'purple', 'purple'], ['green', 'green', 'red'], ['red', 'orange', 'blue'], [], []],
  // Add more levels progressively with complexity...
];

let currentLevel = 0;
const gameContainer = document.getElementById('game');
const levelInfo = document.getElementById('level-info');
const resetBtn = document.getElementById('reset');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

function createTube(colors = []) {
  const tube = document.createElement('div');
  tube.classList.add('tube');
  tube.dataset.colors = JSON.stringify(colors);

  colors.forEach(color => {
    const block = document.createElement('div');
    block.classList.add('color');
    block.style.background = color;
    tube.appendChild(block);
  });

  tube.addEventListener('click', () => handleTubeClick(tube));
  return tube;
}

let selectedTube = null;

function handleTubeClick(tube) {
  if (!selectedTube) {
    selectedTube = tube;
    tube.style.borderColor = 'gold';
  } else if (tube === selectedTube) {
    tube.style.borderColor = '#333';
    selectedTube = null;
  } else {
    tryPour(selectedTube, tube);
    selectedTube.style.borderColor = '#333';
    selectedTube = null;
  }
}

function tryPour(fromTube, toTube) {
  const fromColors = JSON.parse(fromTube.dataset.colors);
  const toColors = JSON.parse(toTube.dataset.colors);

  if (fromColors.length === 0 || toColors.length === 4) return;

  const colorToPour = fromColors[fromColors.length - 1];
  let amountToPour = 1;

  for (let i = fromColors.length - 2; i >= 0; i--) {
    if (fromColors[i] === colorToPour) amountToPour++;
    else break;
  }

  let pourable = 0;
  for (let i = 0; i < amountToPour && toColors.length < 4; i++) {
    if (toColors.length === 0 || toColors[toColors.length - 1] === colorToPour) {
      fromColors.pop();
      toColors.push(colorToPour);
      pourable++;
    } else {
      break;
    }
  }

  if (pourable > 0) {
    updateTube(fromTube, fromColors);
    updateTube(toTube, toColors);
    checkWin();
  }
}

function updateTube(tube, colors) {
  tube.innerHTML = '';
  tube.dataset.colors = JSON.stringify(colors);
  colors.forEach(color => {
    const block = document.createElement('div');
    block.classList.add('color');
    block.style.background = color;
    tube.appendChild(block);
  });
}

function checkWin() {
  const tubes = document.querySelectorAll('.tube');
  const isWin = [...tubes].every(tube => {
    const colors = JSON.parse(tube.dataset.colors);
    return colors.length === 0 || colors.every(c => c === colors[0]);
  });

  if (isWin) {
    setTimeout(() => alert('🎉 Level Complete!'), 200);
  }
}

function loadLevel(level) {
  gameContainer.innerHTML = '';
  levelInfo.innerText = `Level ${currentLevel + 1}`;
  level.forEach(colors => {
    const tube = createTube(colors.slice());
    gameContainer.appendChild(tube);
  });
}

resetBtn.onclick = () => loadLevel(levels[currentLevel]);
prevBtn.onclick = () => {
  if (currentLevel > 0) {
    currentLevel--;
    loadLevel(levels[currentLevel]);
  }
};
nextBtn.onclick = () => {
  if (currentLevel < levels.length - 1) {
    currentLevel++;
    loadLevel(levels[currentLevel]);
  }
};

loadLevel(levels[currentLevel]);
