(() => {

    function createPlayer(name, mark){
        const getName = () => name
        const setName = (newName) => name = newName
        const getMark = () => mark
        return { getName, setName, getMark}
}

    const Gameboard = (() => {
        const WIN_PATTERNS = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ]

        const gameboard = (new Array(9)).fill(null)
        const players = [
            createPlayer("Игрок 1", "X"),
            createPlayer("Игрок 2", "0")]


        let currentPlayerIndex = 0
        let currentPlayer = players[currentPlayerIndex]
        let gameEnded = false;
    
        const getGameBoard = () => gameboard
        const getPlayers = () => players
        const isGameEnded = () => gameEnded
        
        const changeCurrentPlayer = () => {
            currentPlayerIndex = 1 - currentPlayerIndex;
            currentPlayer = players[currentPlayerIndex]
        }

        const setMove = (idx) => {
            if(isNaN(idx) || (idx<0 || idx > 8) || gameboard[idx]) return false
            gameboard[idx] = currentPlayer.getMark()
            return true
        }

        const checkWinner = () => {

            const mark = currentPlayer.getMark()
            const won = WIN_PATTERNS.some(pattern => 
                pattern.every(i => gameboard[i] === mark)
            )
            if(won) return { winner: currentPlayer, draw: false }
            if(gameboard.every(item =>  item !== null)) return { winner: null, draw: true }
            return { winner: null, draw: false }
        }

        const setGameEnded = (flag) => gameEnded = flag

        const init = () => {
            gameboard.fill(null)
            currentPlayerIndex = 0
            currentPlayer = players[currentPlayerIndex]
            gameEnded = false;
        }

        return { getGameBoard, getPlayers, isGameEnded, changeCurrentPlayer, setMove, checkWinner, setGameEnded, init }
    })()

        const Controller = (() => {


            const move = (idx) => {
                if(Gameboard.isGameEnded()) return
                if(!Gameboard.setMove(idx)) return
                const winnerObj = Gameboard.checkWinner()
                UI.renderBoard()
                if(!winnerObj.winner && !winnerObj.draw){
                    Gameboard.changeCurrentPlayer()
                }
                else{
                    endGame(winnerObj)
                }
            }

            const newGame = (p1,p2) =>{
                Gameboard.init()
                const players = Gameboard.getPlayers()
                if(p1){
                    players[0].setName(p1)
                }
                if(p2){
                players[1].setName(p2)
                }
                UI.init(players)
            }

            const endGame = (winnerObj) => {
                Gameboard.setGameEnded(true)
                UI.showWinner(winnerObj)
                UI.disableBoard()
                UI.unlockInputs()
            }

            return { move, newGame, endGame }
        })()
 



    const UI = (() => {
        const gameField = document.querySelector(".field")
        const cells = document.querySelectorAll(".cell")
        const btn = document.querySelector(".new-game-btn")
        const player1 = document.querySelector("input#p1")
        const player2 = document.querySelector("input#p2")
        const player1Label = document.querySelector(".player1 h2")
        const player2Label = document.querySelector(".player2 h2")
        const winnerModal = document.querySelector(".winner")
        const winnerText = document.querySelector(".winner p")




        const renderBoard = () => {
            Gameboard.getGameBoard().forEach((item,idx) => {
                if(item){
                    cells[idx].textContent = item
                    cells[idx].classList.add("filled")
                }
                else{
                    cells[idx].textContent = ''
                    cells[idx].classList.remove("filled")
                }
            })
        }

        const disableBoard = () => {
            gameField.removeEventListener("click",clickCellHandler)
        }

        const unlockInputs = () => {
            player1.disabled = false
            player2.disabled = false
        }

        const clickCellHandler = (e) => {
            if(!e.target.classList.contains("cell")) return
            const idx = parseInt(e.target.dataset.id, 10)
            Controller.move(idx)
        }

        const newGameHandler = () => {
            const p1 = player1.value
            const p2 = player2.value
            Controller.newGame(p1,p2)
            renderBoard()


        }

        const showWinner = (winnerObj) => {
            if(winnerObj.winner){
                winnerText.textContent = `Победитель: ${winnerObj.winner.getName()}`
            }

            if(winnerObj.draw){
                winnerText.textContent = "Вы сыграли вничью"
            }
               
            winnerModal.style.display = "block"    
    
        }

        const init = (players) => {
            gameField.addEventListener("click",clickCellHandler)
            player1.disabled = true
            player2.disabled = true
            player1Label.textContent = players[0].getName()
            player2Label.textContent = players[1].getName()
            player1.value = ''
            player2.value = ''
            winnerText.textContent = ''
            winnerModal.style.display = "none";
        }

        btn.addEventListener("click", newGameHandler)



        return { renderBoard, showWinner, init, disableBoard, unlockInputs }
        
    })()



})()