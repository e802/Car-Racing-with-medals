var canvas, backgroundImage;

var gameState = 0;
var playerCount;
var allPlayers;
var distance = 0;
var database;

var form, player, game;

var cars, car1, car2, car3, car4;

var track, car1_img, car2_img, car3_img, car4_img;

var yVel = 0;

function preload() {
  track = loadImage("track.jpg");
  car1_img = loadImage("car1.png");
  car2_img = loadImage("car2.png");
  car3_img = loadImage("car3.png");
  car4_img = loadImage("car4.png");
  ground = loadImage("ground.png");
  bronze_img = loadImage("bronze.png");
  silver_img = loadImage("silver.png");
  gold_img = loadImage("gold.png");
  backgroundImg = loadImage("whiteback.jpg")
}

function setup() {
  canvas = createCanvas(displayWidth - 400, displayHeight - 200);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

  var btnGet = document.querySelector('button');


  btnGet.addEventListener('click', () => {
    var heading = createElement('h2');
    heading.html("Leaderboard");
    heading.position(displayWidth / 2 - 65, displayHeight / 2 - 250);
    heading.style('color', 'orange');
    canvas.remove();
    btnGet.remove();


    var players = [];

    for (let i = 1; i <= 4; i += 1) {
      let playersInfo = {};
      let playerRef = database.ref('players/player' + i);

      playerRef.child('name').on('value', (data) => {
        playersInfo.name = data.val();
      })
      playerRef.child('rank').on('value', (data) => {
        playersInfo.rank = data.val();
      })
      players.push(playersInfo);
    }

    players.sort(function (a, b) {
      if (a.rank < b.rank) return -1;
      if (a.rank > b.rank) return 1;
      return 0;
    });
    var rankingTableSection = document.querySelector('#tableSection');
    var headers = ['Name', 'Rank'];
    var table = document.createElement('table');
    var headerRow = document.createElement('tr');

    headers.forEach(headerText => {
      var header = document.createElement('th');
      var textNode = document.createTextNode(headerText);
      header.appendChild(textNode);
      headerRow.appendChild(header);
    });

    table.appendChild(headerRow);

    players.forEach(plr => {
      var row = document.createElement('tr');

      Object.values(plr).forEach(text => {
        var cell = document.createElement('td');
        var textNode = document.createTextNode(text);
        cell.appendChild(textNode);
        row.appendChild(cell);
      })

      table.appendChild(row);
    });

    rankingTableSection.appendChild(table);
  });

}


function draw() {

  if (playerCount === 4) {
    game.update(1);
  }
  if (gameState === 1) {
    clear();
    game.play();



  }
  if (gameState === 2 && player.rank === 4) {
    game.end();
    game.displayRanks();


  }

}
