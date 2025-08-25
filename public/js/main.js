const btnPlayGame = document.getElementById('playBtn')
const btnCredits = document.getElementById('creditsBtn')
const btnExit = document.getElementById('exitBtn')

// section menu_game
const sectionMenugame = document.getElementById('menu_game') 
// section adventencias
const sectionPrecaution = document.getElementById('precaution')

btnPlayGame.addEventListener('click', () =>{
    sectionPrecaution.style.display = 'flex'
    sectionMenugame.style.display = 'none'
})