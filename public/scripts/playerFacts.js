const modal = document.querySelectorAll(".fact-dialog")
const playerCard = document.querySelectorAll(".player-card")
const closeBtn = document.querySelectorAll(".close-dialog")



for (let i = 0; i < modal.length; i++) {
    // Open modal when player card is clicked
    playerCard[i].addEventListener("click", () => {
        modal[i].showModal()
    })

    // Close modal when close button is clicked
    closeBtn[i].addEventListener("click", () => {
        modal[i].close()
    })

    // Check for click outside modal
    window.addEventListener("click", (e) => {
        // If an element outside of the modal is clicked
        if (e.target == modal[i]) {
            // Close modal
            modal[i].close()
        }
    })
    
}