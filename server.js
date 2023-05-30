import express from "express"
import bodyParser from "body-parser"
import * as path from "path"
import { createServer } from 'http'
import { Server } from 'socket.io'
import fetch from "node-fetch";

const server = express()
const http = createServer(server)
const io = new Server(http)
// Api url
const apiUrl = "https://ultitv-api.netlify.app/api/v2"
const localUrl = "http://localhost:5173/api/v2"

server.set("view engine", "ejs")
server.set("views", "./views")
server.set("port", process.env.PORT || 8000)

server.use(express.static(path.resolve('public')))
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}))

http.listen(server.get("port"), () => {
	console.log(`Application started on http://localhost:${server.get("port")}`)
});

io.on('connection', (socket) => {
	console.log('a user connected')

	socket.on('score update', (score) => {
		io.emit('score update', score)
	})

	socket.on('scoreboard update', (scoreboard) => {
		io.emit('scoreboard update', scoreboard)
	})

	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})

/* ---------------------------------- QR CODE --------------------------------- */

server.get('/qr', (req, res) => {
	res.render('qrcode')
})

/* ---------------------------------- Form for students --------------------------------- */

server.get('/studentsform', (req, res) => {
	res.render('QR_newplayer')
})

/* ---------------------------------- Index --------------------------------- */

server.get("/", async (req, res) => {
	const allGames = await dataFetch(`${apiUrl}/games`)
	res.render("index", { allGames })
})

/* ------------------------------- Commentate ------------------------------- */

server.get("/commentate", async (req, res) => {
    const gameData = await dataFetch(`${apiUrl}/games?id=111`)
    const playerData = await dataFetch(`${apiUrl}/players?orderBy=jerseyNumber&direction=ASC&first=100`)
    const gameStats = await dataFetch(`${apiUrl}/stats?id=111`)

    const allTeams = await dataFetch(`${apiUrl}/teams`)
    const questionData = await dataFetch(`${apiUrl}/questions?type=Player`)

    res.render("commentate", {
		gameData,
		playerData,
		gameStats,
		allTeams,
		questionData
    })
})

server.get("/commentate/:id", async (req, res) => {
    const gameData = await dataFetch(`${apiUrl}/games?id=${req.params.id}`)
    const playerData = await dataFetch(`${apiUrl}/players?orderBy=jerseyNumber&direction=ASC&first=100`)
    const gameStats = await dataFetch(`${apiUrl}/stats?id=${req.params.id}`)

    const allTeams = await dataFetch(`${apiUrl}/teams`);
    const questionData = await dataFetch(`${apiUrl}/questions?type=Player`)

    res.render("commentate", {
    gameData,
    playerData,
    gameStats,
    allTeams,
    questionData,
    })
})

/* ---------------------------------- Teams --------------------------------- */

server.get("/teams", async (req, res) => {
    const allTeams = await dataFetch(`${apiUrl}/teams`)
    res.render("teams", { allTeams })
})

server.get("/addteam", async (req, res) => {
    res.render("addteam")
})

/* --------------------------------- Players -------------------------------- */
server.get("/players", async (req, res) => {
    res.redirect("/teams")
})

server.get("/players/:id", async (req, res) => {
    const allPlayers = await dataFetch(`${apiUrl}/players?orderBy=jerseyNumber&direction=ASC&first=100`)

    const teamPlayers = allPlayers.players.filter(player => player.team.id === req.params.id)
    res.render("players", { teamPlayers })
})

server.get("/addplayer", async (req, res) => {
    const allTeams = await dataFetch(`${apiUrl}/teams`);
    res.render("addplayer", { allTeams })
})

/* ------------------------------ Player detail ----------------------------- */
server.get("/playerdetail/:id", async (req, res) => {
    const playerData = await dataFetch(`${apiUrl}/players?id=${req.params.id}`)

    res.render("playerdetail", { playerData })
})

/* ---------------------------------- Facts --------------------------------- */
server.get("/addfact/:id", async (req, res) => {
    const questionData = await dataFetch(`${apiUrl}/questions?type=Player`)
    const playerID = req.params.id

    res.render("addfact", { questions: questionData.questions, playerID })
})

/* -------------------------------- Questions ------------------------------- */
server.get("/addquestion", async (req, res) => {
    res.render("addquestion")
})

/* -------------------------------------------------------------------------- */
/*                                    Forms                                   */
/* -------------------------------------------------------------------------- */

server.get("/forms", async (req, res) => {
	const allTeams = await dataFetch(`${apiUrl}/teams`);
	const playerData = await dataFetch(`${apiUrl}/players?orderBy=jerseyNumber&direction=ASC&first=100`)
	const questionData = await dataFetch(`${apiUrl}/questions?type=Player`);

    res.render("forms", { allTeams, playerData, questionData })
})

/* ----------------------------- Add player form ---------------------------- */
server.post("/playerform", async (req, res) => {
	const postPlayerURL = apiUrl + "/players";
	req.body.jerseyNumber = Number(req.body.jerseyNumber);
	req.body.height = Number(req.body.height);

	postJson(postPlayerURL, req.body).then((data) => {
		let newPlayer = req.body;

		if (data.status == 200) {
			res.redirect("/");
			console.log("Status 200: Done!")
		} else if (data.status == 400) {
			const errormessage = `${data.message}`;
			const newteam = {
				error: errormessage,
				values: newPlayer
			};
			console.error("Status 400:" + errormessage);

		} else if (data.status == 500) {
			const errormessage = `${data.message}`;
			const newteam = {
				error: errormessage,
				values: newPlayer
			};
			console.error("Status 500:" + errormessage);
		}
	});

	res.redirect("/");
});

/* ------------------------------ Add fact form ----------------------------- */
server.post("/factform", async (req, res) => {
	const postFactUrl = apiUrl + "/facts";

	postJson(postFactUrl, req.body).then((data) => {
		let newFact = req.body

		if (data.succes) {
			res.redirect("/?memberPosted=true")
		} else {
			const errormessage = `${data.message}`
			const newteam = {
				error: errormessage,
				values: newFact
			};
			console.error(errormessage)
		}
	});
	res.redirect(`/playerdetail/${req.body.reference}`)
});

/* ---------------------------- Add question form --------------------------- */
server.post("/questionform", async (req, res) => {
	const postQuestionUrl = apiUrl + "/questions";

	postJson(postQuestionUrl, req.body).then((data) => {
		let newQuestion = req.body;

		if (data.succes) {
			res.redirect("/?memberPosted=true");
		} else {
			const errormessage = `${data.message}`;
			const newquestion = {
				error: errormessage,
				values: newQuestion
			};
			console.error(errormessage);
		}
	});
	res.redirect("/addquestion");
});

/* ------------------------------ Add team form ----------------------------- */
server.post("/teamform", async (req, res) => {
	const postTeamURL = apiUrl + "/teams";
	req.body.seeding = Number(req.body.seeding);
	console.log(req.body);

	// For reference
	// req.body.facts = []
	// req.body.players = []

	postJson(postTeamURL, req.body).then((data) => {
		let newTeam = req.body;

		if (data.succes) {
			res.redirect("/?memberPosted=true");
		} else {
			const errormessage = `${data.message}: Mogelijk komt dit door de slug die al bestaat.`;
			const newteam = {
				error: errormessage,
				values: newTeam
			};
		}
	});
	res.redirect("/");
});

/* ------------------------------- Styleguide ------------------------------- */
server.get('/styleguide', (req, res) => {
	res.render('styleguide')
});

/* ---------------------------------- Point --------------------------------- */
server.post("/addpoint", async (req, res) => {
	const postPointUrl = apiUrl + "/stats"
	req.body.team1Score = Number(req.body.team1Score)
	req.body.team2Score = Number(req.body.team2Score)
	req.body.gameId = Number(req.body.gameId)

	// Determine class
	// Team 1 Start offence && goal
	if (req.body.startedOnOffence === req.body.team1Id && req.body.scored === req.body.team1Id){
		req.body.team1Class = "hold"
	}

	// Team 1 Start offence && goal against
	if (req.body.startedOnOffence === req.body.team1Id && req.body.scored === req.body.team2Id){
		req.body.team1Class = "break"
	}

	// Team 1 Start defence && goal
	if (req.body.startedOnDefence === req.body.team1Id && req.body.scored === req.body.team1Id){
		req.body.team1Class = "broken"
	}

	// Team 1 Start defence && goal against
	if (req.body.startedOnDefence === req.body.team1Id && req.body.scored === req.body.team2Id){
		req.body.team1Class = "conceded"
	}

	// Team 2 Start offence && goal
	if (req.body.startedOnOffence === req.body.team2Id && req.body.scored === req.body.team2Id){
		req.body.team2Class = "hold"
	}

	// Team 2 Start offence && goal against
	if (req.body.startedOnOffence === req.body.team2Id && req.body.scored === req.body.team1Id){
		req.body.team2Class = "break"
	}

	// Team 2 Start defence && goal
	if (req.body.startedOnDefence === req.body.team2Id && req.body.scored === req.body.team2Id){
		req.body.team2Class = "broken"
	}

	// Team 2 Start defence && goal against
	if (req.body.startedOnDefence === req.body.team2Id && req.body.scored === req.body.team1Id){
		req.body.team2Class = "conceded"
	}

	// Check for start on offence or defence
	if (req.body.startedOnOffence === req.body.team1Id){
		req.body.team1OorD = "O"
		req.body.team2OorD = "D"
	} else {
		req.body.team1OorD = "D"
		req.body.team2OorD = "O"
	}

	console.log(req.body)

	const postData = {
		"startedOnOffence": req.body.startedOnOffence,
		"startedOnDefence": req.body.startedOnDefence,
		"scored": req.body.scored,
		"team1Score": req.body.team1Score,
		"team2Score": req.body.team2Score,
		"scoredBy": req.body.scoredBy,
		"assistBy": req.body.assistBy,
		"team1Class": req.body.team1Class,
		"team2Class": req.body.team2Class,
		"team1OorD": req.body.team1OorD,
		"team2OorD": req.body.team2OorD,
		"stat": req.body.stat
	}

	postJson(postPointUrl, postData).then((data) => {
		let newPoint = postData

		if (data.status == 200) {
			res.redirect("/commentate/" + req.body.gameId)
			console.log("Status 200: Done!")
		} else if (data.status == 400) {
			const errormessage = `${data.message}`
			const newPointMsg = {
				error: errormessage,
				values: newPoint
			}
			console.error("Status 400:" + errormessage)
		} else if (data.status == 500) {
			const errormessage = `${data.message}`
			const newPointMsg = {
				error: errormessage,
				values: newPoint
			}
			console.error("Status 500:" + errormessage)
		}
	})

	// res.redirect("/commentate/" + req.body.gameId)
})

/* -------------------------------------------------------------------------- */
/*                               Other functions                              */
/* -------------------------------------------------------------------------- */

/* ---------------------------- Api call function --------------------------- */
async function dataFetch(url) {
	const data = await fetch(url)
		.then((response) => response.json())
		.catch((error) => error);
	return data;
}

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
	console.log(2, JSON.stringify(body));
	return await fetch(url, {
			method: "post",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json"
			},
		})
		.then((response) => response.json())
		.catch((error) => error);
}