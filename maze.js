const wallColor = 'rgba(0, 143, 19, 1)';
const mazeColor = 'rgba(66, 66, 66, 1)';
const rectWidth = 50;
var mazeWidth = 5;
var maze = [];

// all walls are listed as 2 cells, listed in the order of movement
var wallList = [];
//var cellList = [];
var startCell;
var canvas = document.getElementById('gameBoard');
var context = canvas.getContext('2d');

function initMaze() {
  for (let i = 0; i < mazeWidth; i++) {
    let row = [];
    for (let i = 0; i < mazeWidth; i++) {
      var cell = {
        north: null,
        east: null,
        south: null,
        west: null
      }
      row.push(cell);
    }
    maze.push(row);
  }
}

function primsAlgo() {
  let randWall = getRandNum(0, wallList.length);
  console.log(randWall);
  if (wallList[randWall].type === "horizontal") {
    wallList[randWall].northCell.south = wallList[randWall].southCell;
    wallList[randWall].southCell.north = wallList[randWall].northCell;
  } else if (wallList[randWall].type === "vertical") {
    wallList[randWall].westCell.east = wallList[randWall].eastCell;
    wallList[randWall].eastCell.west = wallList[randWall].westCell;
  }
}

function carvePaths() {
  startCell = getStartLoc();
  addWalls(startCell.row, startCell.col);
  primsAlgo();
  wallList = [];
  addWalls(startCell.row, startCell.col);
  if (wallList.length === 0) {
    return;
  } else {
    primsAlgo();
  }
}
//function addCells(row, col) {
//  let inThere = false;
//  for (let i = 0; i < cellList.length; i++) {
//    if (isEqual(cellList[i], maze[row][col])) {
//      inThere = true;
//    }
//  }
//  if (inThere === false) {
//    cellList.push(maze[row][col]);
//  }
//}
function addWalls(row, col) {
  let north = null;
  let east = null;
  let south = null;
  let west = null;
  if (maze[row][col].north === null) {
    north = {
      type: "horizontal",
      northCell: maze[row -1][col],
      southCell: maze[row][col],
    }
  } else {
    addWalls(row - 1, col);
  }
  if (maze[row][col].east === null) {
    east = {
      type: "vertical",
      eastCell: maze[row][col - 1],
      westCell: maze[row][col],
    }
  } else {
    addWalls(row, col - 1);
  }
  if (maze[row][col].south === null) {
    south = {
      type: "horizontal",
      northCell: maze[row][col],
      southCell: maze[row + 1][col],
    }
  } else {
    addWalls(row + 1, col);
  }
  if (maze[row][col].west === null) {
    west = {
      type: "vertical",
      eastCell: maze[row][col],
      westCell: maze[row][col + 1],
    }
  } else {
    addWalls(row, col + 1);
  }
  let newWalls = [];
  if (north !== null) {newWalls.push(north);}
  if (east !== null) {newWalls.push(east);}
  if (south !== null) {newWalls.push(south);}
  if (west !== null) {newWalls.push(west);}
  for (let i = 0; i < newWalls.length; i++) {
    let inThere = false;
    for (let j = 0; j < wallList.length; j++) {
      if (wallList[j].type === "vertical") {
        if (isEqual(wallList[j].northCell, newWalls[i].northCell) &&
            isEqual(wallList[j].southCell, newWalls[i].southCell)) {
          inThere = true;
        }
      } else if (wallList[j].type === "horizontal") {
        if (isEqual(wallList[j].eastCell, newWalls[i].eastCell) &&
            isEqual(wallList[j].westCell, newWalls[i].westCell)) {
          inThere = true;
        }
      }
    }
    if (inThere === false) {
      wallList.push(newWalls[i]);
    }
  }
  return;
}

// this was made by me with help from a tutorial at https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
function isEqual(firstObj, secondObj) {

  // get the first objects type
  let type = Object.prototype.toString.call(firstObj);
  // if the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(secondObj)) {return false;}
  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) {return false;}
  // Compare the length of the length of the two items
  let firstObjLength = type === '[object Array]' ? firstObj.length : Object.keys(firstObj).length;
  let secondObjLength = type === '[object Array]' ? secondObj.length : Object.keys(secondObj).length;
  if (firstObjLength !== secondObjLength) {return false;}

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < firstObjLen; i++) {
      if (compare(firstObj[i], secondObj[i]) === false) {return false;}
    }
  } else {
    for (let key in firstObj) {
      if (firstObj.hasOwnProperty(key)) {
        if (compare(firstObj[key], secondObj[key]) === false) {return false;}
      }
    }
  }
  // if nothing failed, return true;
  return true;
}

function compare (item1, item2) {
  // get the object type
  var itemType = Object.prototype.toString.call(item1);

  // if an object or array, compare recursively
  if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
    if(!isEqual(item1, item2)) {return false};
  } else { // otherwise, do a simple comparison
    // if the two items are not the same type, return false
    if (itemType !== Object.prototype.toString.call(item2)) {return false;}
    // If it's a function, convert to a string and compare
    // otherwise, just compare
    if (itemType === '[object Function]') {
      if (item1.toString() !== item2.toString()) {return false;}
    } else {
      if (item1 !== item2) {return false;}
    }
  }
  return true;
}

function getStartLoc() {
  let min = 1;
  let max = mazeWidth - 1;
  let notFound = true;
  let row = Math.floor(Math.random()*(max-min+1)+min)
  let col = Math.floor(Math.random()*(max-min+1)+min)
  return {
          row: row,
          col: col
         }
}

function getRandNum(max, min) {
  let num = Math.floor(Math.random()*(max-min+1)+min)
  return num;
}

CanvasRenderingContext2D.prototype.clear = function() {
  this.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(elapsedTime) {
    processInput(elapsedTime);
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
}

function processInput(elapsedTime) {
}
function update(elapsedTime) {
}

function render() {
  context.clear();
  for (let i = 0; i < mazeWidth; i++) {
    for(let j = 0; j < mazeWidth; j++) {
      paintRect(i, j);
    }
  }
}

function paintRect(col, row) {
  context.fillStyle = mazeColor;
  context.fillRect(row * rectWidth, col * rectWidth, rectWidth, rectWidth )
  if(maze[row][col].north == null) {
    context.strokeStyle = wallColor;
    context.moveTo(col * rectWidth, row * rectWidth);
    context.lineTo((col + 1) * rectWidth, row * rectWidth);
    context.stroke()
  }
  if(maze[row][col].east == null) {
    context.strokeStyle = wallColor;
    context.moveTo((col + 1) * rectWidth, row * rectWidth);
    context.lineTo((col + 1) * rectWidth, (row + 1) * rectWidth);
    context.stroke()
  }
  if(maze[row][col].south == null) {
    context.strokeStyle = wallColor;
    context.moveTo(col * rectWidth, (row + 1) * rectWidth);
    context.lineTo((col + 1) * rectWidth, (row + 1) * rectWidth);
    context.stroke()
  }
  if(maze[row][col].west == null) {
    context.strokeStyle = wallColor;
    context.moveTo(col * rectWidth, row * rectWidth);
    context.lineTo(col * rectWidth, (row + 1) * rectWidth);
    context.stroke()
  }
}

initMaze();
carvePaths();
performance.now();
gameLoop();









//const numObs = 15;
//const boardWidth = 50;
//const rectWidth = 10;
//const snakeGrowth = 3;
//const wall = 'w';
//const food = 'f';
//const obs = 'o';
//const empty = 'e';
//
//const emptyColor = 'rgba(120, 43, 13, 1)';
//const wallColor = 'rgba(66, 66, 66, 1)';
//const snakeColor = 'rgba(46, 93, 40, 1)';
//const foodColor = 'rgba(158, 0, 0, 1)';
//const obsColor = 'rgba(110, 91, 48, 1)';
//
//var gameOver = false;
//var board = [];
//var nextInput;
//var currentDir = null;
//var input = [];
//var moveRate = 150;
//var lastMoveStamp = 0;
//var snakeLength = 1;
//var highScores = [];
//
//// Setting up the game board empty
//
//function getRandLoc() {
//  let min = 1;
//  let max = boardWidth - 1;
//  let notFound = true;
//  let row = Math.floor(Math.random()*(max-min+1)+min)
//  let col = Math.floor(Math.random()*(max-min+1)+min)
//  while(notFound) {
//    if (board[row][col] != empty) {
//      row = Math.floor(Math.random()*(max-min+1)+min)
//      col = Math.floor(Math.random()*(max-min+1)+min)
//    } else {
//      notFound = false;
//    }
//  }
//  return {
//          row: row,
//          col: col
//         }
//}
//
//function populateBoard() {
//  gameOver = false;
//  board = [];
//  snakeLength = 1;
//  currentDir = null;
//  nextInput = null;
//  input = [];
//  for (let i = 0; i < boardWidth; i++) {
//    let row = [];
//    for( let j = 0; j < boardWidth; j++) {
//      if ( i == 0 || i == boardWidth - 1 || j == 0 || j == boardWidth - 1) {
//        row.push(wall);
//      } else {
//        row.push(empty);
//      }
//    }
//    board.push(row);
//  }
//  for (let i = 0; i < numObs; i++) {
//    let coords = getRandLoc();
//    board[coords['row']][coords['col']] = obs;
//  }
//  let coords = getRandLoc();
//  board[coords['row']][coords['col']] = 0;
//  coords = getRandLoc();
//  board[coords['row']][coords['col']] = food;
//}
//
//populateBoard();
//
//var canvas = document.getElementById('gameBoard');
//var context = canvas.getContext('2d');
//
//CanvasRenderingContext2D.prototype.clear = function() {
//  this.clearRect(0, 0, canvas.width, canvas.height);
//}
//
//function gameLoop(elapsedTime) {
//  if (gameOver === false) {
//    processInput(elapsedTime);
//    update(elapsedTime);
//  }
//    render();
//    requestAnimationFrame(gameLoop);
//}
//
//performance.now();
//gameLoop();
//
//function processInput(elapsedTime) {
//    nextInput = input.pop();
//    input = []
//    input.push(nextInput);
//}
//function update(elapsedTime) {
//  if(elapsedTime - lastMoveStamp >= moveRate){
//    lastMoveStamp = elapsedTime
//    let obj = findNextDir();
//    let row = obj.nextRow;
//    let col = obj.nextCol;
//    let prevCol = obj.prevCol;
//    let prevRow = obj.prevRow;
//    let nextDir = obj.nextDir;
//    if (board[row][col] != empty &&
//        board[row][col] != food  &&
//        board[row][col] !== 0
//    ) {
//      // game over
//      highScores.push(snakeLength);
//      highScores.sort((a, b) => b - a);
//      while (highScores.length > 5) {
//        highScores.pop();
//      }
//      gameOver = true;
//    } else if (board[row][col] == food) {
//      // move the snake
//      // move the tails
//      // replace the food
//      for(let i = 0; i < snakeGrowth; i++) {
//        snakeLength++;
//      }
//      inchSnake(row, col);
//      let newFood = getRandLoc();
//      currentDir = nextDir;
//      board[newFood.row][newFood.col] = food;
//    } else if (board[row][col] == empty){
//      // move the snake
//      inchSnake(row, col);
//      currentDir = nextDir;
//    }
//    }
//}
//
//function findNextDir() {
//  for (let i = 0; i < boardWidth; i++) {
//    for(let j = 0; j < boardWidth; j++) {
//      if(board[i][j] === 0) {
//        let row;
//        let col;
//        let nextDir;
//        if (nextInput == 'up') {
//          if (currentDir == 'down') {
//            nextDir = currentDir
//            row = 1 + i;
//            col = j;
//          } else {
//            nextDir = nextInput
//            row = i - 1;
//            col = j;
//          }
//        } else if (nextInput == 'down') {
//          if (currentDir == 'up') {
//            nextDir = currentDir
//            row = i - 1;
//            col = j;
//          } else {
//            nextDir = nextInput
//            row = 1 + i;
//            col = j;
//          }
//        } else if (nextInput == 'left') {
//          if (currentDir == 'right') {
//            nextDir = currentDir
//            row = i;
//            col = 1 + j ;
//          } else {
//            nextDir = nextInput
//            row = i;
//            col = j - 1;
//          }
//        } else if (nextInput == 'right') {
//          if (currentDir == 'left') {
//            nextDir = currentDir
//            row = i;
//            col = j - 1;
//          } else {
//            nextDir = nextInput
//            row = i;
//            col = 1 + j ;
//          }
//        } else if (currentDir == null) {
//          row = i;
//          col = j;
//        }
//        return {
//                nextDir: nextDir,
//                nextRow: row,
//                nextCol: col,
//                prevRow: i,
//                prevCol: j,
//               }
//      }
//    }
//  }
//}
//
//function render() {
//  context.clear();
//  for (let i = 0; i < boardWidth; i++) {
//    for(let j = 0; j < boardWidth; j++) {
//      if(board[i][j] == empty) {
//        paintRect(i, j, emptyColor);
//      } else if(board[i][j] == wall) {
//        paintRect(i, j, wallColor);
//      } else if(typeof board[i][j] == "number") {
//        paintRect(i, j, snakeColor);
//      } else if(board[i][j] == obs) {
//        paintRect(i, j, obsColor);
//      } else if(board[i][j] == food) {
//        paintRect(i, j, foodColor);
//      }
//    }
//  }
//  let score = document.getElementById('score');
//  score.textContent = snakeLength;
//  let highScoreDiv = document.getElementById('highscores');
//  while (highScoreDiv.firstChild) {
//    highScoreDiv.removeChild(highScoreDiv.firstChild);
//  }
//  for (let i = 0; i < highScores.length; i++) {
//    let newHighScore = document.createElement('div');
//    newHighScore.textContent = highScores[i];
//    highScoreDiv.appendChild(newHighScore);
//  }
//}
//
//function paintRect(col, row, color) {
//        context.fillStyle = color;
//        context.fillRect(row * rectWidth, col * rectWidth, rectWidth, rectWidth )
//}
//
//function checkInput (e) {
//  e = e || window.event;
//  if ( e.keyCode == '38') {
//    input.push('up');
//  } else if ( e.keyCode == '40') {
//    input.push('down');
//  } else if ( e.keyCode == '37') {
//    input.push('left');
//  } else if ( e.keyCode == '39') {
//    input.push('right');
//  }
//
//}
//
//document.onkeypress = checkInput;
//
//function inchSnake(row, col) {
//  board[row][col] = -1;
//  for(let i = 0; i < boardWidth; i++) {
//    for(let j = 0; j < boardWidth; j++) {
//      if(typeof board[i][j] === "number") {
//        board[i][j]++;
//        if(board[i][j] >= snakeLength) {
//          board[i][j] = empty;
//        }
//      }
//    }
//  }
//}
//
//function paintRect(col, row, color) {
//        context.fillStyle = color;
//        context.fillRect(row * rectWidth, col * rectWidth, rectWidth, rectWidth )
//        if (color == snakeColor || color == obsColor || color == foodColor) {
//          context.strokeStyle = "#000000";
//          context.strokeRect(row * rectWidth, col * rectWidth, rectWidth, rectWidth )
//        }
//}
//
//function checkInput (e) {
//  e = e || window.event;
//  if ( e.keyCode == '38') {
//    input.push('up');
//  } else if ( e.keyCode == '40') {
//    input.push('down');
//  } else if ( e.keyCode == '37') {
//    input.push('left');
//  } else if ( e.keyCode == '39') {
//    input.push('right');
//  }
//}
//
//document.onkeypress = checkInput;
