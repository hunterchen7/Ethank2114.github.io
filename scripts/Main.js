var randInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var randColor = function() {
  let r = randInt(0, 255);
  let g = randInt(0, 255);
  let b = randInt(0, 255);

  return "rgb(" + r.toString() + ", "+ g.toString() + ", " + b.toString() + ")"; 
}

// create set with all divisors of num
var divsOf = function(num) {
  let set = new Set();
  for(var i = 1; i < num; i++) {
    if(num % i == 0) {
      set.add(i);
    }
  }
  return set;
}

var drawRect = function(x, y, width, height, color) {
  frame.fillStyle = color
  frame.fillRect(x, y, width, height)
}

// VARIABLES //

const canvas = document.getElementById("canvas");
const frame = canvas.getContext("2d");

var tileSize = 10;
var numSeeds = 5;
var speed = 10;
var seedColor = "random";
var mixingStrength = 25;

const backgroundColor = "rgb(33, 33, 33)";

var map = [];
var seeds = [];


var intervalPointer;

// VARIABLES //

var printCanvas = function() {
  var img = new Image();
  saveAs(canvas.toDataURL(), "canvas.png"); // from FileSaver.js
}

var populateMap = function() {
  map = [];
  for(var x = 0; x < canvas.width / tileSize; x++) {
    let temp = [];
    for(var y = 0; y < canvas.height / tileSize; y++) {
      temp.push({x:x, y:y, color:backgroundColor});
    }
    map[x] = temp;
  }
}

var clearMap = function() {
  //console.log(tileSize);
  for(var x = 0; x < canvas.width / tileSize; x++) {
    for(var y = 0; y < canvas.height / tileSize; y++) {
      map[x][y].color = backgroundColor;
    }
  }
}

var populateSeeds = function() {
  seeds = [];

  for(var i = 0; i < numSeeds; i++) {

    let num1 = randInt(0, Math.floor(canvas.width / tileSize) - 1);
    let num2 = randInt(0, Math.floor(canvas.height / tileSize) - 1);

    seeds.push(map[num1][num2]);
    map[num1][num2].color = (seedColor == "random") ? randColor() : seedColor;//"rgb(235, 52, 186)";
  }
}

var refresh = function() {

  clearInterval(intervalPointer);

  if(speed > 0) {
    intervalPointer = setInterval(iterate, speed);

    populateMap();
    populateSeeds();
    drawMap();

  } else {
    populateMap();
    populateSeeds();

    while(seeds.length > 0) {
      iterate();
    }

    drawMap();
  }
}


let w = divsOf(canvas.width);
let h = divsOf(canvas.height);
var divsOfScreen = new Set();

h.forEach(function(num) {
  if(w.has(num)) {
    divsOfScreen.add(num);
  };
});

w.forEach(function(num) {
  if(h.has(num)) {
    divsOfScreen.add(num);
  };
});

//console.log(divsOfScreen);

var pushChanges = function() {

  // Tile Size // 
  let newTileSize = parseInt(document.getElementById("tileSizeInput").value);
  while(!divsOfScreen.has(newTileSize)) {
    newTileSize++;
  }
  tileSize = newTileSize;

  // Number of Seeds //
  let newNumSeeds = document.getElementById("numSeedsInput").value;
  numSeeds = newNumSeeds;

  // Speed //
  let newSpeed = document.getElementById("speedInput").value;
  speed = newSpeed;
  
  // Seed Color //
  let newSeedColor = document.getElementById("seedColorInput").value;
  seedColor = newSeedColor;

  // Color Mixing Strength //
  let newMixingStrength = document.getElementById("mixingStrengthInput").value;
  mixingStrength = newMixingStrength;

  // refresh //
  refresh();
}

var drawMap = function() {
  map.forEach(function(array) {
    //console.log(array);
    array.forEach(function(e) {
      //console.log(e);
      drawRect(e.x * tileSize, e.y * tileSize, tileSize, tileSize, e.color);
    })
  });
}

var mixColor = function(oldString, strength) {

  let rgb = oldString.substring(4, oldString.length - 1).replace(/ /g, '').split(',');
  let shift = randInt(-1 * strength, strength);
  
  let part = randInt(0, 2);
  rgb[part] = (parseInt(rgb[part]) + shift).toString();

  //rgb[0] = (parseInt(rgb[0]) + randInt(-1 * strength, strength)).toString();
  //rgb[1] = (parseInt(rgb[1]) + randInt(-1 * strength, strength)).toString();
  //rgb[2] = (parseInt(rgb[2]) + randInt(-1 * strength, strength)).toString();

  return "rgb(" + rgb[0].toString() + ", "+ rgb[1].toString() + ", " + rgb[2].toString() + ")";  


}

let grid = [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}];

var iterate = function() {
  let temp = [];
  seeds.forEach(function(s) {

    let adj = [];

    // select random number of neighbours to check
    for(var i = 0; i < grid.length; i++) {
      if(randInt(0, 1) < 1) {
        adj.push(grid[i]);
      }
    }

    // spread color to chosen neighbours
    for(var i = 0; i < adj.length; i++) {

      if(s.x + adj[i].x < 0 || s.y + adj[i].y < 0) {
        continue;
      }
      if(s.x + adj[i].x >= canvas.width / tileSize || s.y + adj[i].y >= canvas.height / tileSize) {
        continue;
      }

      let current = map[s.x + adj[i].x][s.y + adj[i].y];

      if(current.color == backgroundColor) {
        temp.push(current);
        current.color = mixColor(s.color, mixingStrength);
        drawRect(current.x * tileSize, current.y * tileSize, tileSize, tileSize, current.color); // changed
      }
    }

    for(var i = 0; i < grid.length; i++) {

      if(s.x + grid[i].x < 0 || s.y + grid[i].y < 0) {
        continue;
      }
      if(s.x + grid[i].x >= canvas.width / tileSize || s.y + grid[i].y >= canvas.height / tileSize) {
        continue;
      }

      if(map[s.x + grid[i].x][s.y + grid[i].y].color == backgroundColor) {
        temp.push(s);
      }
    }

  });

  seeds = temp;
  //drawMap(); // changed
}

populateMap();
refresh();
intervalPointer = setInterval(iterate, speed);

//console.log(divsOf(1024));
