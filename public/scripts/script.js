const score = document.querySelector(".score")
const players = document.querySelector(".players")
const stats = document.querySelector(".stats")

const scoreBlock = document.querySelector(".scoreboard")
const playersBlock = document.querySelectorAll(".team-players")
const statsBlock = document.querySelector(".stats-block")

const allBlocks = document.querySelectorAll(".nav-blocks")

if (window.screen.width >= 1440) {
    allBlocks.forEach(block => block.style.display = "block")
} else {
    allBlocks.forEach(block => block.style.display = "none")
    scoreBlock.style.display = "block"
}

score.addEventListener("click", () => showBlock(scoreBlock))
players.addEventListener("click", () => showBlock(playersBlock))
stats.addEventListener("click", () => showBlock(statsBlock))

function showBlock(block) {
    if (block === playersBlock) {
        for (let i = 0; i < playersBlock.length; i++) {
            if (playersBlock[i].style.display == "none") {
                playersBlock[i].style.display = "block"
            } else {
                playersBlock[i].style.display = "none"
            }
        }
        } else {
            if (block.style.display == "none") {
                block.style.display = "block"
            } else {
                block.style.display = "none"
        }
    }
    allBlocks.style.display = "none"
}


const socket = io();