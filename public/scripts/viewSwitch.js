const scoreboard = document.querySelector('.scoreboard')
const scoreInput = document.querySelector('.score-input')

const scoreboardButton = document.querySelector('#scoreboard-button')
const scoreInputButton = document.querySelector('#score-input-button')

scoreboardButton.addEventListener('click', () => {
    console.log('Left button clicked')
    scoreboard.classList.remove('hide')
    scoreInput.classList.add('hide')

})

scoreInputButton.addEventListener('click', () => {
    console.log('Right button clicked')
    scoreboard.classList.add('hide')
    scoreInput.classList.remove('hide')
})