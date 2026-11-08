// Express.js Intro - write your server here.
// Run it with: node index.js   (stop it with Ctrl + C)

const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Part 1 - GET /greet
app.get("/greet", (req, res) => {
    const time = new Date().toISOString();

    res.json({
        msg: "hi from get endpoint " + time
    });
});

// Part 2 - GET /greet/:name
app.get("/greet/:name", (req, res) => {
    const name = req.params.name;

    console.log("i got name: " + name);

    res.json({
        msg: "got name: " + name
    });
});

// Part 2 - GET /test
app.get("/test", async (req, res) => {
    const name = "Bob";

    try {
        const response = await fetch(
            `http://localhost:${PORT}/greet/${name}`
        );

        const data = await response.json();

        if (data.msg === "got name: " + name) {
            res.json({ result: "ok" });
        } else {
            res.json({ result: "fail" });
        }
    } catch (error) {
        res.json({ result: "fail" });
    }
});

// Part 3 - POST /action
app.post("/action", async (req, res) => {
    const body = req.body;

    if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        Object.keys(body).length !== 1 ||
        !["joke", "cat fact"].includes(body.action)
    ) {
        return res.status(400).json({
            msg: "body is malformed"
        });
    }

    try {
        if (body.action === "joke") {
            const response = await fetch(
                "https://v2.jokeapi.dev/joke/Any?type=single&safe-mode"
            );

            const data = await response.json();

            let joke;

            if (data.type === "single") {
                joke = data.joke;
            } else {
                joke = data.setup + " " + data.delivery;
            }

            return res.json({
                joke: joke.toUpperCase()
            });
        }

        if (body.action === "cat fact") {
            const response = await fetch(
                "https://api.thecatapi.com/v1/images/search?limit=11",
                {
                    headers: {
                        "x-api-key": process.env.CAT_API_KEY || ""
                    }
                }
            );

            const data = await response.json();

            return res.json({
                length: String(data.length)
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: "server error"
        });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
