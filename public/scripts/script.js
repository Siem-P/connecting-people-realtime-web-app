const socket = io();

// Form from html
const form = document.getElementById("addPointForm")

// Scoreboard
const scoreboardElement = document.getElementById("scoreboard")

// Listen for form submit
form.addEventListener("submit", (e) => {
    // GameScore data
    let team1Score = document.getElementById("scoredPointTeam1").innerText
    let team2Score = document.getElementById("scoredPointTeam2").innerText

    // Form data
    const teamScored = document.getElementById("scored").value
    const team1Id = document.getElementById("team1Id").value
    const team2Id = document.getElementById("team2Id").value
    const startedOnOffence = document.getElementById("startedOnOffence").value
    const startedOnDefence = document.getElementById("startedOnDefence").value
    const scoredBy = document.getElementById("scoredBy").value

    // Parse to int
    team1Score = parseInt(team1Score)
    team2Score = parseInt(team2Score)

    // Determine class
	// Team 1 Start offence && goal
	if (startedOnOffence === team1Id && teamScored === team1Id){
		team1Class = "hold"
	}

	// Team 1 Start offence && goal against
	if (startedOnOffence === team1Id && teamScored === team2Id){
		team1Class = "break"
	}

	// Team 1 Start defence && goal
	if (startedOnDefence === team1Id && teamScored === team1Id){
		team1Class = "broken"
	}

	// Team 1 Start defence && goal against
	if (startedOnDefence === team1Id && teamScored === team2Id){
		team1Class = "conceded"
	}

	// Team 2 Start offence && goal
	if (startedOnOffence === team2Id && teamScored === team2Id){
		team2Class = "hold"
	}

	// Team 2 Start offence && goal against
	if (startedOnOffence === team2Id && teamScored === team1Id){
		team2Class = "break"
	}

	// Team 2 Start defence && goal
	if (startedOnDefence === team2Id && teamScored === team2Id){
		team2Class = "broken"
	}

	// Team 2 Start defence && goal against
	if (startedOnDefence === team2Id && teamScored === team1Id){
		team2Class = "conceded"
	}

    // Check who scored and change score accordingly
    if(teamScored == team1Id){
        team1Score++

        let socketData = {
            team1Score: team1Score,
            team2Score: team2Score
        }

        let scoreboardData = `
            <div class='scoreboard-item'>
                <div class='scoreboard-team'>
                    <p>${scoredBy}</p>
                </div>
                <div class="point">
                    <p><span>${team1Score}</span>-<span>${team2Score}</span></p>
                </div>
                <div class="sb-class-icon">
                    <img src="/assets/${team1Class}.svg" alt="${team1Class} icon">
                </div>
            </div>
        `

        // Emit score update
        socket.emit("score update", socketData)

        // Emit scoreboard update
        socket.emit("scoreboard update", scoreboardData)
    }

    if(teamScored == team2Id){
        team2Score++

        let socketData = {
            team1Score: team1Score,
            team2Score: team2Score
        }

        let scoreboardData = `
            <div class='scoreboard-item sb-item-alt'>
                <div class="sb-class-icon sb-class-alt">
                    <img src="/assets/${team2Class}.svg" alt="${team2Class} icon">
                </div>
                <div class="point">
                    <p><span>${team1Score}</span>-<span>${team2Score}</span></p>
                </div>
                <div class='scoreboard-team sb-team-alt'>
                    <p sb-p-alt>${scoredBy}</p>
                </div>
            </div>
        `

        // Emit score update
        socket.emit("score update", socketData)
        // Emit scoreboard update
        socket.emit("scoreboard update", scoreboardData)
    }

    const formData = new FormData(form)
    const searchParams = new URLSearchParams(formData)

    // Form submit
    fetch(form.action, {
        method: form.method,
        body: searchParams
    })

    // Check formData contents
    for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }
    e.preventDefault()
})

socket.on("score update", (score) => {
    const scoreField1 = document.getElementById("scoredPointTeam1")
    const scoreField2 = document.getElementById("scoredPointTeam2")
    scoreField1.innerHTML = score.team1Score
    scoreField2.innerHTML = score.team2Score
})

socket.on("scoreboard update", (scoreboard) => {
    scoreboardElement.insertAdjacentHTML("beforeend", scoreboard)
})
