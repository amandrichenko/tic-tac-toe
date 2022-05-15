/*global gameUrls */

window.addEventListener('load', function load() {
  //
  ;('use strict')
  const startGame = document.querySelector('.startGame')
  const mainGame = document.querySelector('.mainGame')
  const createGameBtn = document.querySelector('.createGame')
  const statusMessage = document.querySelector('.status-message') // их два
  const statusMessage2 = document.querySelectorAll('.status-message')
  const existingGames = document.querySelector('.existing-games')
  const newGameBtn = document.querySelector('.newGame')
  const fieldsD = document.querySelector('.field')
  let row
  let cell
  let ws
  let xhr
  let pst
  const rqst = {
    register: 'd',
  }
  const rqst2 = {
    register: '',
  }
  let pstStartGame
  let obj
  let temp
  const status = {
    side: '',
    move: '',
  }
  let li
  let i
  let j
  let liD
  let registerString
  let gameId
  let registerInGame2
  const ul = document.querySelector('ul')
  let registerString2
  let g1
  const g1Rqst = {
    move: '',
  }
  let win
  let longRqst
  let resp
  const resdp3 = 2
  const resdcececp = 1
  const xxxx = resdp3 + resdcececp
  console.log(xxxx)
  let putRqst
  let gameLogic = {
    player1: '',
    player2: '',
    currentMove: 'x',
  }
  let playerId
  let currentClick
  let cell1111
  let g3Obj
  let error
  let mess
  const webSocket = new WebSocket(gameUrls.list)

  // Получили команду через WebSocket на начало игры
  function startGameFunc(playerID, gameID) {
    // N1 вывести в .status-message сообщение "Ожидаем начала игры" и отключить кнопку "Создать игру"
    statusMessage.innerHTML = 'Ожидаем начала игры'
    createGameBtn.disabled = true
    // N2 отправить POST запрос с содержимым вида {player: 'PLAYER_ID', game: 'GAME_ID'} по адресу gameUrls.gameReady, где PLAYER_ID - ID полученный на шаге W3, а GAME_ID - ID полученный на шаге C3
    pstStartGame = new XMLHttpRequest()
    pstStartGame.open('POST', gameUrls.gameReady)
    obj = {
      player: '',
      game: '',
    }
    obj.player = playerID
    obj.game = gameID
    playerId = obj.player
    pstStartGame.setRequestHeader('Content-Type', 'application/json')
    pstStartGame.send(JSON.stringify(obj))
    pstStartGame.addEventListener('readystatechange', function pstStartGameFunc() {
      if (pstStartGame.readyState !== 4) return
      // N3 если в ответ на POST запрос из N2 получен код ответа 410 (Gone) - вывести в div .status-message сообщение "Ошибка старта игры: другой игрок не ответил"
      if (pstStartGame.status === 410) {
        statusMessage.innerHTML = 'Ошибка старта игры: другой игрок не ответил'
        return
      }
      if (pstStartGame.status !== 410 && pstStartGame.status !== 200) {
        // N4 если запрос из N2 провалился с кодом, отличным от 410 - вывести в div .status-message сообщение "Неизвестная ошибка старта игры"
        statusMessage.innerHTML = 'Неизвестная ошибка старта игры'
        return
      }
      /* N5 если запрос из N2 завершился успешно, то Вам прийдет ответ от сервера: { side: 'x' } или { side: 'o' }, который говорит о том,
       на какой стороне вы играете. Скройте блок startGame, покажите блок mainGame */
      temp = JSON.parse(pstStartGame.responseText)
      status.side = temp.side
      startGame.style.display = 'none'
      mainGame.style.display = 'block'
      gameLogic.player1 = status.side
      if (gameLogic.player1 === 'x') {
        gameLogic.player2 = 'o'
      }
      if (gameLogic.player1 === 'o') {
        gameLogic.player2 = 'x'
      }
    })
  }

  // После загрузки страницы, вы должны установить подключение через WebSocket  по адресу gameUrls.list (W0)
  // WebSocket connection
  webSocket.onopen = function wsOpen() {}
  webSocket.onmessage = function wsMessage(event) {
    ws = JSON.parse(event.data)
    if (ws.action === 'add') {
      /* W1 { action: 'add', id: '345678' } - добавить в список "Существующие игры" (ul с классом "existing-games") игру с id "345678".
       Выводите список существующих игр в виде тега li в котором содержится id игры */
      li = document.createElement('li')
      li.innerHTML = ws.id
      existingGames.appendChild(li)
    }
    if (ws.action === 'remove') {
      // W2 { action: 'remove', id: '345678' } - удалить из списка "Существующие игры" игру с id "345678". Она просто должна исчезнуть
      liD = document.querySelectorAll('li')
      for (i = 0; i < liD.length; i++) {
        if (liD[i].innerHTML === ws.id) {
          existingGames.removeChild(liD[i])
        }
      }
    }
    if (ws.action === 'startGame') {
      /* W3 {action: 'startGame', id: 'PLAYER_ID'} - сервер зовет вас на игру на которую вы регистрировались командой register.
       Ваш ID -  "PLAYER_ID" (в дальнейшем это будет использоваться как PLAYER_ID), подробности ниже */
      startGameFunc(ws.id, gameId)
    }
    if (ws.error) {
      // W4 {error: 'message' } - вы делаете что-то не так и вебсервер сообщает вам об этом.;
      // ДУБЛИРУЕТСЯ ПУНКТ C4 если на любом из 2 предыдущих шагов возникла ошибка - вывести в div с классом "status-message" сообщение "Ошибка создания игры" и включить кнопку "Создать игру"
      statusMessage.innerHTML = 'Ошибка создания игры'
      createGameBtn.disabled = false
    }
  }
  webSocket.onclose = function wsClose() {}
  // End WebSocket connection
  // Нажатие на кнопку createGame
  createGameBtn.addEventListener('click', function createGame() {
    // C1 отключить кнопку "Создать игру" (disabled)
    createGameBtn.disabled = true
    // C2 отправить POST запрос на сервер по адресу gameUrls.newGame, в ответ вы получите результат следующего вида: {yourId: 'YOUR_ID'}.
    xhr = new XMLHttpRequest()
    xhr.open('POST', gameUrls.newGame)
    xhr.addEventListener('readystatechange', function xhrPOST() {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) {
        // C4 если на любом из 2 предыдущих шагов возникла ошибка - вывести в div с классом "status-message" сообщение "Ошибка создания игры" и включить кнопку "Создать игру"
        statusMessage.innerHTML = 'Ошибка создания игры'
        createGameBtn.disabled = false
        return
      }
      pst = JSON.parse(xhr.responseText)
      gameId = pst.yourId
      console.log('в ответ прилетел созданный game room id <-- ' + gameId)
      // C3 отправить по WebSocket строку вида {register: "GAME_ID"} где GAME_ID - ID полученный вами на сервере с предыдущего шага
      rqst.register = pst.yourId
      registerString = JSON.stringify(rqst)
      webSocket.send(registerString)
    })
    xhr.send()
  })
  /* J1 У вас есть вариант присоединения к существующей игре. Выводите список игр в списке (тегами li). При клике по элементу списка - отправьте запрос register также как в сценарии С3.
   (Это присоединение к существующей игре). При создании новой игры вы увидите свою же игру в списке игр - можете ее убирать или не убирать из списка
   Перефразирую процесс подключения. Клик по "новая игра", создает "игровую комнату". GAME_ID - это ID игровой комнаты.
   Когда вы выполняете команду register: GAME_ID вы говорите "Сервер, я хочу учавствовать в игре с ID GAME_ID".
   Как только таких участников двое - игра стартует, сервер генерирует вам ID игроков (PLAYER_ID) и присылает Вам. Поэтому оба игрока получат разные ID в этот момент.
   */
  ul.addEventListener('click', function registerInGameFunc(e) {
    registerInGame2 = e.target
    rqst2.register = registerInGame2.innerHTML
    gameId = registerInGame2.innerHTML
    registerString2 = JSON.stringify(rqst2)
    webSocket.send(registerString2)
  })
  /*
   Игра ведется в поле 10х10 (можно генерировать в любой удобный для Вас момент). Игра начинается с чистого поля и хода крестика.
   */
  // "Удобный момент"
  for (i = 0; i < 10; i++) {
    row = document.createElement('div')
    row.classList.add('row')
    fieldsD.appendChild(row)
    for (j = 0; j < 10; j++) {
      cell = document.createElement('div')
      cell.classList.add('cell')
      row.appendChild(cell)
    }
  }
  // Логика игры
  /* Если сейчас же не ваш ход, то вы должны выполнять Long-Polling GET запрос на адрес gameUrls.move. */
  function subscribe(url) {
    longRqst = new XMLHttpRequest()
    longRqst.onreadystatechange = function longRqstFunc() {
      if (longRqst.readyState !== 4) return
      if (longRqst.status === 200) {
        /* H2 В случае получения ответа - если в ответе содержится поле move - выполнить ход другого игрока в эту клетку.
         Если в ответе сервера содержится поле win (может принимать значения 'x' либо 'o') - вывести в .status-message сообщение, которое лежит в поле win. Игра выиграна кем-то.
         */
        resp = JSON.parse(longRqst.responseText)
        if (resp.move) {
          currentClick = +resp.move - +1
          cell1111 = document.querySelectorAll('.cell')
          cell1111[currentClick].classList.add(gameLogic.currentMove) // Ход другого игрока
          if (gameLogic.currentMove === 'x') {
            gameLogic.currentMove = 'o'
          } else {
            gameLogic.currentMove = 'x'
          }
        }
        if (resp.win) {
          statusMessage2[1].innerHTML = resp.win
        }
      } else {
        /* H1 В случае провала запроса - немедленно повторить запрос (это же Long Polling) */
        subscribe(url)
      }
    }
    longRqst.open('GET', url, true)
    longRqst.setRequestHeader('Game-ID', gameId)
    longRqst.setRequestHeader('Player-ID', playerId)
    longRqst.setRequestHeader('Content-Type', 'application/json')
    longRqst.send()
  }

  fieldsD.addEventListener('click', function fieldsClick(ee) {
    currentClick = ee.target
    /* Ведение игры обеспечивается следующей логикой. Если сейчас Ваш ход, то при клике по ячейке вы должны выполнить следующие действия:*/
    /*  G1 отправить POST запрос с содержимым вида { move: 2 } и заголовками Game-ID GAME_ID и Player-ID PLAYER_ID (где GAME_ID и PLAYER_ID ровно те ID,
     которые получены вами ранее) по адресу gameUrls.move. 2 - номер клетки, в которую выполняется ход. Нумерация от 1 до 100.*/
    if (gameLogic.player1 === gameLogic.currentMove) {
      g1 = new XMLHttpRequest()
      g1.open('POST', gameUrls.move)
      g1.setRequestHeader('Game-ID', gameId)
      g1.setRequestHeader('Player-ID', playerId)
      g1.setRequestHeader('Content-Type', 'application/json')
      g1Rqst.move =
        +Array.prototype.indexOf.call(document.querySelectorAll('.cell'), ee.target) + +1
      g1.send(JSON.stringify(g1Rqst))
      g1.addEventListener('readystatechange', function handleClick() {
        if (g1.readyState !== 4) return
        if (g1.status !== 200) {
          /* G3 В случае провала запроса G1 вывести сообщение в .status-message либо содержимое поля message ответа, либо, если такого нет - текст "Неизвестная ошибка".
           Прекратить выполнение любой логики, связанной с игрой кроме кнопки newGame */
          g3Obj = JSON.parse(g1.responseText)
          if (g3Obj.message) {
            statusMessage2[1].innerHTML = g3Obj.message
          } else {
            statusMessage2[1].innerHTML = 'Неизвестная ошибка'
          }
          // Останавливаем логику игры
          fieldsD.removeEventListener('click', fieldsClick)
          gameLogic = {
            player1: '',
            player2: '',
            currentMove: '',
          }
        }
        /* G2 В случае ответа 200 на G1 поставить соответствующий крестик либо нолик по ячейке, по которой кликнули.
         Если в ответе сервера содержится поле win (может принимать значения 'x' либо 'o') - вывести в .status-message сообщение, которое лежит в поле win. Игра выиграна кем-то. */
        ee.target.classList.add(gameLogic.currentMove)
        subscribe(gameUrls.move)
        if (gameLogic.currentMove === 'x') {
          gameLogic.currentMove = 'o'
        } else {
          gameLogic.currentMove = 'x'
        }
        win = JSON.parse(g1.responseText)
        if (win.win) {
          statusMessage2[1].innerHTML = win.win
        }
      })
    }
  })
  if (gameLogic.player1 !== gameLogic.currentMove) {
    subscribe(gameUrls.move)
  }
  // B1 Кнопка .newGame должна иметь текст "Сдаться" если игра еще не выиграна кем-то и не произошла неизвестная ошибка.  В противном случае кнопка должна иметь текст "Новая игра"
  if (!status.win) {
    newGameBtn.innerHTML = 'Сдаться'
  } else if (error) {
    newGameBtn.innerHTML = 'Сдаться'
  } else {
    newGameBtn.innerHTML = 'Новая игра'
  }
  // B2 При нажатии на кнопку "Новая игра" необходимо скрыть .mainGame и показать .startGame
  newGameBtn.addEventListener('click', function newGameClickFunc() {
    if (newGameBtn.innerHTML === 'Сдаться') {
      // B3 При нажатии на кнопку "Сдаться", необходимо выполнить PUT-запрос по адресу gameUrls.surrender.
      putRqst = new XMLHttpRequest()
      putRqst.open('PUT', gameUrls.surrender)
      putRqst.send()
      putRqst.addEventListener('readystatechange', function putRqstFunc() {
        if (putRqst.readyState !== 4) return
        if (putRqst.status !== 200) {
          /* B5 При провале запроса B3 - вывести сообщение в .status-message либо содержимое поля message ответа, либо, если такого нет - текст "Неизвестная ошибка".
           Прекратить выполнение любой логики, связанной с текущей игрой кроме кнопки newGame. */
          if (mess) {
            statusMessage.innerHTML = mess
          } else {
            statusMessage.innerHTML = 'Неизвестная ошибка'
            // Прекратить выполнение любой огики кроме кнопки newGame
            const fieldsClick = 0 // Added just to follow linting rules
            fieldsD.removeEventListener('click', fieldsClick)
            gameLogic = {
              player1: '',
              player2: '',
              currentMove: '',
            }
          }
          return
        }
        // B4 При получении ответа 200 на B3 - скрыть .mainGame и показать .startGame
        startGame.style.display = 'block'
        mainGame.style.display = 'none'
      })
    }
    startGame.style.display = 'block'
    mainGame.style.display = 'none'
    createGameBtn.disabled = false
  })
})
