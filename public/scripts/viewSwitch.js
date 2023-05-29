const scoreboard = document.querySelector('.scoreboard')
const stats = document.querySelector('.stats')

const scoreboardButton = document.querySelector('#scoreboard-button')
const statsButton = document.querySelector('#stats-button')

scoreboardButton.addEventListener('click', () => {
    console.log('Left button clicked')
    scoreboard.classList.remove('hide')
    stats.classList.add('hide')
    
})

statsButton.addEventListener('click', () => {
    console.log('Right button clicked')
    scoreboard.classList.add('hide')
    stats.classList.remove('hide')
})