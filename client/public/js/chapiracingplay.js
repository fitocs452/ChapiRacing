const calcCollition = (player, object) => {
    // Image runner is 66px width and Xpos is the middle so
    // we have a left and right range.

    // Same for the object, the object is 126px
    // Can't be less than 0
    let leftPlayerX = ((x - 63) <= 0) ? 0 : (x - 63);
    // Can't be more than 761
    let rightPlayerX = ((x + 63) <= 0) ? 761 : (x + 63);

    // Can't be less than 0
    let leftObjectX = ((x - 63) <= 0) ? 0 : (x - 63);
    // Can't be more than 761
    let rightObjectX = ((x + 63) <= 0) ? 761 : (x + 63);

    if (leftObjectX === leftPlayerX && rightObjectX <= rightPlayerX) {
        return true;
    }

    if (leftObjectX >= leftPlayerX && leftObjectX <= rightPlayerX) {
        return true;
    }

    if (leftObjectX <= leftPlayerX && rightObjectX >= leftPlayerX) {
        return true;
    }
}

let firstTime = true;
let firstRender = true;
const playState = (callbackPlay) => {
    let canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 761;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
      bgReady = true;
    };
    bgImage.src = "client/public/images/mapa.jpg";
    //bgImage.src = "images/mapa.jpg";

    // Team 1 car image
    var team1CarReady = true;
    var team1CarImage = new Image();
    team1CarImage.onload = function () {
      team1CarReady = true;
    };
    team1CarImage.src = "client/public/images/blue_car.jpeg";
    //team1CarImage.src = "images/blue_car.jpeg";

    // Team 2 car image
    var team2CarReady = true;
    var team2CarImage = new Image();
    team2CarImage.onload = function () {
      team2CarReady = true;
    };
    team2CarImage.src = "client/public/images/green_car.png";
    //team2CarImage.src = "images/green_car.png";

    // Team 2 car image
    var bomber1Ready = true;
    var bomber1Image = new Image();
    bomber1Image.onload = function () {
      bomber1Ready = true;
    };
    bomber1Image.src = "client/public/images/bomber.png";
    //bomber1Image.src = "images/bomber.png";

    // Team 2 car image
    var bomber2Ready = true;
    var bomber2Image = new Image();
    bomber2Image.onload = function () {
      bomber2Ready = true;
    };
    bomber2Image.src = "client/public/images/bomber2.png";
    //bomber2Image.src = "images/bomber2.png";

    let initialHeight = 0.05*(window.innerHeight);
    // let stepHeight = (window.innerHeight - 0.30*window.innerHeight) / 4;
    let carYPosition = (window.innerHeight - 0.18*window.innerHeight)

    let client = {
        id: '',
        game_id: '',
        localplayer: 2,
        players: [
            {
                number: 1,
                team: -1,
                x: 390,
                teamSelected: false,
                type: '',
                points: 0
            }, {
                number: 2,
                team: -1,
                x: 390,
                teamSelected: false,
                type: '',
                points: 0
            }, {
                number: 3,
                team: -1,
                x: 390,
                teamSelected: false,
                type: '',
                points: 0
            }, {
                number: 4,
                team: -1,
                x: 390,
                teamSelected: false,
                type: '',
                points: 0
            }
        ],
        speed: 700
    };
    socket.emit('prepareState');
    socket.on('getNewState', (data) =>  {
        client.players = data.players;
    });
    socket.emit('requestState');

    let playerIndex = 0;
    var keysDown = {};
    // Team1 - car attributes
    var team1Car = {
        speed: 375, // Car speed
        points: 0
    }

    // Team2 - car attributes
    var team2Car = {
        speed: 375, // Car speed
        points: 0
    }

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    var setUpGame = function () {
        team1Car.x = 65;
        team1Car.y = carYPosition;

        // Throw the monster somewhere on the screen randomly
        team2Car.x = 450;
        team2Car.y = carYPosition;
    };

    // Update game objects
    var update = function (modifier) {
        // If team 1:
        //  leftLimit: 10, rightLimit: 300
        // If team 2:
        //  leftLimit: 395, rightLimit: 685
        let team1 = (client.players[playerIndex].team === 1) ? true : false;
        let isRunner = (client.players[playerIndex].type === 'car') ? true : false;

        // Si es del equipo2 y es corredor o si es del equipo 1 y es bomber
        let windowLeftLimit = 395;
        let windowRightLimit = 650;
        // Si es del equipo1 y es corredor o si es del equipo 2 y es bomber
        if ((team1 && isRunner) || (!team1 && !isRunner)) {
            windowLeftLimit = 10;
            windowRightLimit = 250;
        }
        // Left key
        if (37 in keysDown) {
            client.players[playerIndex].x -= client.speed * modifier;
            // Definimos el limite para que no se salga de la pantalla
            // a la izquierda
            if (client.players[playerIndex].x <= windowLeftLimit) {
                client.players[playerIndex].x = windowLeftLimit;
            }
        }

        // Right key
        if (39 in keysDown) {
            client.players[playerIndex].x += client.speed * modifier;
            if (client.players[playerIndex].x >= windowRightLimit) {
                client.players[playerIndex].x = windowRightLimit;
            }
        }
        // setTimeout(update, 5000);
    };

    let indexPlayersToDraw = {
        team1: {
            bomber: 0,
            runner: 0
        },
        team2: {
            bomber: 0,
            runner: 0
        }
    };
    // Draw everything
    var render = function () {
        let team1Car = {
            x: client.players[indexPlayersToDraw.team1.runner].x
        };

        let team2Car = {
            x: client.players[indexPlayersToDraw.team2.runner].x
        };

        let team1Bomber = {
            x: client.players[indexPlayersToDraw.team1.bomber].x
        };

        let team2Bomber = {
            x: client.players[indexPlayersToDraw.team2.bomber].x
        };

        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }

        if (team1CarReady) {
            ctx.drawImage(
                team1CarImage,
                team1Car.x,
                carYPosition
            );
        }

        if (team2CarReady) {
            ctx.drawImage(
                team2CarImage,
                team2Car.x,
                carYPosition
            );
        }

        if (bomber1Ready) {
            ctx.drawImage(
                bomber1Image,
                team1Bomber.x,
                initialHeight
            );
        }

        if (bomber2Ready) {
            ctx.drawImage(
                bomber2Image,
                team2Bomber.x,
                initialHeight
            );
        }
    };

    const calculatePlayersIndexToRender = () => {
        for (let i = 0; i < client.players.length; i++) {
            let player = client.players[i];
            // console.log(player);
            if (player.team === 1) {
                if (player.type === 'car') {
                    indexPlayersToDraw.team1.runner = player.number - 1;
                } else {
                    indexPlayersToDraw.team1.bomber = player.number - 1;
                }
            } else if (player.team === 2) {
                if (player.type === 'car') {
                    indexPlayersToDraw.team2.runner = player.number - 1;
                } else {
                    indexPlayersToDraw.team2.bomber = player.number - 1;
                }
            }
        }
    }

    const updatePlayersPosition = (data) => {
        for (let i = 0; i < data.players.length; i++) {
            client.players[data.players[i].number-1].x = data.players[i].x;
        }
        // console.log(client.players);
        calculatePlayersIndexToRender();
    }

    // The main game loop
    let mainPlayGame = function () {
        // console.log(client.players);
        var now = Date.now();
        var delta = now - then;

        // SetUp print de mapa
        update(delta / 1000);
        render();
        then = now;
        let player = client.players[playerIndex];
        // get players position
        socket.on('receiveUpdate', (data) => {
             updatePlayersPosition(data);
        });
        //send client player position
         socket.emit('playerUpdate', { 
            player
         });
        setTimeout(function(){}, 15000);
        // Request to do this again ASAP
        requestAnimationFrame(mainPlayGame);
    };

    // Cross-browser support for requestAnimationFrame
    const w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    let then = Date.now();

    //connect to lobby
    // socket.on('onconnected', (data) => 
    let data = getState().client;
    console.log('getState');
    console.log(data);
    console.log(client);

    client.localplayer = data.localplayer;
    client.id = data.id;
    client.game_id = data.game_id;
    playerIndex = client.localplayer - 1;
    let player = client.players[playerIndex];
    render();
    //send client player position
     socket.emit('playerUpdate', { 
        player
     });
    calculatePlayersIndexToRender();

    //socket.emit('getPlayerType', {});
    mainPlayGame();
}
