document.body.style.backgroundImage = "url('./assets/images/background.png') "
document.body.style.backgroundSize = "cover";

// Pop up
var PopUp = document.createElement("div")
PopUp.classList.add("popup__overlay");
PopUp.classList.add("hidden");
document.body.appendChild(PopUp);
var information = document.createElement("div")
information.classList.add("information");
PopUp.appendChild(information);

var close = document.createElement("input")
close.type = "image"
close.src = "./assets/icons/285155608058211.png"
close.classList.add("close");
information.appendChild(close);

var message = document.createElement("div")
message.classList.add("message");
// message.innerText = `Вы решили головоломку за ${time.textContent.slice(6)} и ${field.getClicks()} шагов!`
information.appendChild(message);

PopUp.addEventListener("click", function (event) {
    e = event || window.event
    if (e.target == this) {
        PopUp.classList.add("hidden");
    }
    Start();
});
close.addEventListener("click", function (event) {
    event.preventDefault();
    PopUp.classList.add("hidden");
    Start();
});


myAudio = new Audio;
myAudio.src = "./assets/sound/Sound_05313.mp3";

// Header
var header = document.createElement("header");
header.setAttribute("id", "myHeader");
document.body.appendChild(header);

// Choose game size
var gameSize = document.createElement("div")
gameSize.classList.add("gameSize");
document.getElementById("myHeader").appendChild(gameSize);
gameSizeText = document.createTextNode('Игровое поле ')
gameSize.appendChild(gameSizeText);

var select = document.createElement("select"); // select size
select.setAttribute("id", "optionsSize");
gameSize.appendChild(select);

var data = ["3х3", "4х4", "5х5", "6х6", "7х7", "8х8"];
for (i = 0; i < data.length; i++) {
    let newOption = new Option(data[i], i + 3);
    select.append(newOption);
}
optionsSize.selectedIndex = 1;

//button new game with size
var newGame = document.createElement("button")
newGame.classList.add("newGameButton");
var buttonText = document.createTextNode("Start game");
newGame.appendChild(buttonText);
gameSize.appendChild(newGame);

newGame.addEventListener("click", function () {
    size = select.value;
    Stop()
    Start()
    startGame(size)
});


var gameInfo = document.createElement("div")
gameInfo.classList.add("gameInfo");
document.getElementById("myHeader").appendChild(gameInfo);
// Time
var time = document.createElement("time");
gameInfo.appendChild(time);

var base = 60;
var timer, dateObj, dh, dm, ds, ms;
var readout = '';
var h = 1,
    m = 1,
    tm = 1,
    s = 0,
    ts = 0,
    ms = 0,
    init = 0;

function ClearСlock() {
    clearTimeout(timer);
    h = 1;
    m = 1;
    tm = 1;
    s = 0;
    ts = 0;
    ms = 0;
    init = 0;
    output = '00:00:00';
    time.innerText = 'Times: ' + output;
}

function StartTime() {
    var cdateObj = new Date();
    var t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
    if (t > 999) s++;

    if (s >= (m * base)) {
        ts = 0;
        m++;
    } else {
        ts = parseInt((ms / 100) + s);
        if (ts >= base) ts = ts - ((m - 1) * base);
    }

    if (m > (h * base)) {
        tm = 1;
        h++;
    } else {
        tm = parseInt((ms / 100) + m);
        if (tm >= base) tm = tm - ((h - 1) * base);
    }

    if (ts > 0) {
        ds = ts;
        if (ts < 10) ds = '0' + ts;
    } else ds = '00';

    dm = tm - 1;
    if (dm > 0) {
        if (dm < 10) dm = '0' + dm;
    } else dm = '00';

    dh = h - 1;
    if (dh > 0) {
        if (dh < 10) dh = '0' + dh;
    } else dh = '00';

    output = dh + ':' + dm + ':' + ds;
    time.innerText = 'Times: ' + output;
    timer = setTimeout("StartTime()", 1);
}


function Start() { // function start/stop time
    if (init == 0) { // start
        ClearСlock();
        dateObj = new Date();
        StartTime();
        init = 1;
    }
}

function Stop() {
    if (init == 1) {
        clearTimeout(timer);
        init = 0;
    }
}


// Moves
var moves = document.createElement("div");
moves.classList.add("moves");
moves.innerText = 'Moves: 0';
gameInfo.appendChild(moves);

// Sound
var soundButton = document.createElement("input") //кнопка звука
soundButton.classList.add("soundButton");
soundButton.src = "./assets/icons/3643734-high-sound-speaker-voice-volume_113403.png";
soundButton.type = "image";
gameInfo.appendChild(soundButton);

soundButton.addEventListener("click", () => { //переключатель звука
    sound = !sound
    if (sound) {
        soundButton.src = "./assets/icons/3643734-high-sound-speaker-voice-volume_113403.png";
    } else {
        soundButton.src = "./assets/icons/3643732-mute-sound-speaker-voice-volume_113439.png";
    }
});

var sound = true

// localStorage.clear()
//Best result
function BestScore(steps, spendTime) {
    var now = new Date();
    if (localStorage.length < 10) {
        now = now.toString()
        localStorage.setItem(now, [spendTime,steps])
    } else {
        var max = localStorage.getItem(localStorage.key(0)).slice(0, 9);
        for (i = 1; i < localStorage.length; ++i) {
            var myKey = localStorage.key(i);
            if (localStorage.getItem(myKey).slice(0, 9) > max) {
                max = localStorage.getItem(myKey).slice(0, 9);
                var maxLocaleStorageKey = myKey
            }
        }
        if (spendTime <= max) {
            localStorage.removeItem(maxLocaleStorageKey);
            localStorage.setItem(now,[spendTime,steps])
        }
    }
    updateBestResult()
}


var canvas = document.createElement("canvas") // игровое поле
canvas.width = 320;
canvas.height = 320;
var context = canvas.getContext("2d");
document.body.appendChild(canvas);
Start()
startGame(4)

function startGame(size) {
    moves.innerText = "Moves: 0";
    var cellSize = canvas.width / size;

    var field = new game(size); // создаём объект пятнашек
    field.mix(2000); // перемешиваем

    field.setCellView(function (x, y) { // параметры для кубиков
        context.fillStyle = "rgb(250, 185, 91)";
        context.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
    });
    field.setNumView(function () {
        context.font = "bold " + (cellSize / 2.5) + "px CENTURY GOTHIC";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#002137";
    });
    context.fillStyle = "#002137";
    context.fillRect(0, 0, canvas.width, canvas.height);
    field.draw(context, cellSize);

    function event(x, y) {
        field.move(x, y);
        context.fillStyle = "#002137";
        context.fillRect(0, 0, canvas.width, canvas.height);
        field.draw(context, cellSize);
        if (field.victory()) { // если головоломка сложена, то заново перемешиваем
            Stop();
            // alert("Вы решили головоломку за" + time.textContent.slice(6) + " и " + field.getClicks() + " шагов!");
            message.innerText = `Вы решили головоломку за ${time.textContent.slice(6)} и ${field.getClicks()} шагов!`
            BestScore(field.getClicks(), time.textContent.slice(6))
            PopUp.classList.remove("hidden");

            field.mix(2000);
            context.fillStyle = "#002137";
            context.fillRect(0, 0, canvas.width, canvas.height);
            field.draw(context, cellSize);
        }
    }

    canvas.addEventListener('mousedown', function (e) { // обрабатываем клики мышью
        var x = (e.pageX - canvas.offsetLeft) / cellSize | 0;
        var y = (e.pageY - canvas.offsetTop) / cellSize | 0;
        event(x, y);
        if (sound) {
            myAudio.currentTime = 0;
            myAudio.play()
        }
        moves.innerText = "Moves: " + field.getClicks(); //считаем шаги
    });
    field.ondragstart = function () {
        return false;
    };
    // canvas.addEventListener('mousedown',function(e) { // обрабатываем касания пальцем
    // 	var x = (e.touches[0].pageX - canvas.offsetLeft) / cellSize | 0;
    // 	var y = (e.touches[0].pageY - canvas.offsetTop)  / cellSize | 0;
    // 	event(x, y);
    // });
}



function game(quantity) {
    var cellView = null;
    var numView = null;
    var clicks = 0;

    function newGame() { // начальное (выиграшное) состояние поля 
        var arr = []
        for (i = 0; i < quantity; ++i) {
            arr[i] = [];
            for (j = 0; j < quantity; ++j) {
                if (i + j != 2 * (quantity - 1))
                    arr[i][j] = i * quantity + j + 1;
                else
                    arr[i][j] = 0;
            }
        }
        return arr
    }
    var arr = newGame();
    var solution = newGame();

    function getNull() { // узнать пустую клетку
        for (var i = 0; i < quantity; i++) {
            for (var j = 0; j < quantity; j++) {
                if (arr[j][i] === 0) {
                    return {
                        "x": i,
                        "y": j
                    };
                }
            }
        }
    };

    this.getClicks = function () {
        return clicks;
    };

    this.move = function (x, y) {
        var nullX = getNull().x;
        var nullY = getNull().y;
        if (((x - 1 == nullX || x + 1 == nullX) && y == nullY) || ((y - 1 == nullY || y + 1 == nullY) && x == nullX)) {
            arr[nullY][nullX] = arr[y][x];
            arr[y][x] = 0;
            clicks++;
        }
    };

    this.victory = function () {
        var res = true;
        for (var i = 0; i < quantity; i++) {
            for (var j = 0; j < quantity; j++) {
                if (solution[i][j] != arr[i][j]) {
                    res = false;
                }
            }
        }
        return res;
    };

    this.mix = function (stepCount) {
        var x, y;
        for (var i = 0; i < stepCount; i++) {
            var nullX = getNull().x;
            var nullY = getNull().y;
            switch (Math.round(3 * Math.random())) {
                case 0:
                    if (nullX != 0) {
                        x = nullX - 1;
                        y = nullY;
                    }
                    break;
                case 1:
                    if (nullY != quantity - 1) {
                        x = nullX;
                        y = nullY + 1;
                    }
                    break;
                case 2:
                    if (nullX != quantity - 1) {
                        x = nullX + 1;
                        y = nullY;
                    }
                    break;
                case 3:
                    if (nullY != 0) {
                        x = nullX;
                        y = nullY - 1;
                    }
            }
            this.move(x, y);
        }
        clicks = 0;
    };

    this.setCellView = function (func) {
        cellView = func;
    };

    this.setNumView = function (func) {
        numView = func;
    };

    this.draw = function (context, size) {
        for (var i = 0; i < quantity; i++) {
            for (var j = 0; j < quantity; j++) {
                if (arr[i][j] > 0) {
                    if (cellView !== null) {
                        cellView(j * size, i * size);
                    }
                    if (numView !== null) {
                        numView();
                        context.fillText(arr[i][j], j * size + size / 2, i * size + size / 2);
                    }
                }
            }
        }
    };
}


// LocalStorage
var BestResult = document.createElement("div")
BestResult.classList.add("BestResult");
document.body.appendChild(BestResult);
var BestResultTitle = document.createElement("div")
BestResultTitle.classList.add("title");
BestResultTitle.innerText = `Best resault (time)`
BestResult.appendChild(BestResultTitle);
var ul = document.createElement('ul');
ul.setAttribute("id", "myUl");
BestResult.append(ul);
for (i = 1; i < localStorage.length; ++i) {
    let li = document.createElement('li');
    var myKey = localStorage.key(i);
    li.textContent = `time:${localStorage.getItem(myKey).slice(0, 9)}  moves ${localStorage.getItem(myKey).slice(10)}`;
    ul.append(li)
}

function updateBestResult() {
    document.getElementById("myUl").remove();
    // console.log('locale', localStorage)
    var ul = document.createElement('ul');
    ul.setAttribute("id", "myUl");
    BestResult.append(ul);
    for (i = 0; i < localStorage.length; ++i) {
        
        let li = document.createElement('li');
        var myKey = localStorage.key(i);
        li.textContent = `time:${localStorage.getItem(myKey).slice(0, 9)}  moves ${localStorage.getItem(myKey).slice(10)}`;
        ul.append(li)
        // console.log(i,localStorage.getItem(myKey).slice(0, 9))
    }

}