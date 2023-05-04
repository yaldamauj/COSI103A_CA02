const express = require("express");
const router = express.Router();
const path = require('path');
const APIKEY = process.env.APIKEY;
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: APIKEY,
});
const openai = new OpenAIApi(configuration);

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}


async function getResponse(text){
  const gptResponse = await openai.createCompletion({
    prompt: text, 
    max_tokens: 64,
    n: 1,
    temperature: 0.5,
    frequency_penalty: 0,
    presence_penalty: 0,
    model: "text-davinci-003",
  })
  return gptResponse.data.choices[0].text;
}


// Route for song summary 
router.get("/index/song", (req, res) => {
  res.render("song");
});

router.post("/index/song", async (req, res) => {
  const prompt = "Explain lyrics and meaning this BTS song: " + req.body.prompt;
  const result = await getResponse(prompt);
  res.render("song", { result });
});

// Route for generating summary for a random BTS song
router.get("/index/random", (req, res) => {
  res.render("random");
});

router.post("/index/random", async (req, res) => {
  const prompt = "Pick a BTS song and summarize the meaning and lyrics, make sure it has the theme of "  + req.body.prompt;
  const ran = await getResponse(prompt);
  res.render("random", { ran });
});

module.exports = router;