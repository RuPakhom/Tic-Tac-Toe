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
    
        const getGameBoard = () => gameboard
        const getPlayers = () => players
        
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
            if(won) return currentPlayer
            if(gameboard.every(item =>  item !== null)) return -1
            return false
        }

        const init = () => {
            gameboard.fill(null)
            currentPlayerIndex = 0
            currentPlayer = players[currentPlayerIndex]
        }

        return { getGameBoard, getPlayers, changeCurrentPlayer, setMove, checkWinner, init }
    })()

        const Controller = (() => {

            const move = (idx) => {
                if(!Gameboard.setMove(idx)) return
                const winner = Gameboard.checkWinner()
                UI.renderBoard()
                if(!winner){
                    Gameboard.changeCurrentPlayer()
                }
                else{
                    UI.showWinner(winner)
                }
            }

            const newGame = (p1,p2) =>{
                Gameboard.init()
                const players = Gameboard.getPlayers()
                players[0].setName(p1)
                players[1].setName(p2)
                UI.init(players)
            }

            return { move, newGame }
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




        const renderBoard = function(){
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

        const clickCellHandler = (e) => {
            if(!e.target.classList.contains("cell")) return
            const idx = e.target.dataset.id.toString();
            Controller.move(idx)
        }

        const newGameHandler = () => {
            const p1 = player1.value || "Игрок 1"
            const p2 = player2.value || "Игрок 2"
            Controller.newGame(p1,p2)
            renderBoard()


        }

        const showWinner = (winner) => {
            if(winner){
                gameField.removeEventListener("click",clickCellHandler)
                player1.disabled = false
                player2.disabled = false
                if(winner === -1){
                    winnerText.textContent = "Вы сыграли вничью"
                }
                else{
                    winnerText.textContent = `Победитель: ${winner.getName()}`
                }
                winnerModal.style.display = "block"
                
            }
        }

        const init = (players) => {
            gameField.addEventListener("click",clickCellHandler)
            player1.disabled = true
            player2.disabled = true
            player1Label.textContent = players[0].getName()
            player2Label.textContent = players[1].getName()
            player1.value = ''
            player2.value = ''
            winnerModal.style.display = "none";
        }

        btn.addEventListener("click", newGameHandler)



        return { renderBoard, showWinner, init }
        
    })()



})()