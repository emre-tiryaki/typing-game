import express from "express";

const words = express.Router();
const BASE_URL = "https://random-word-api.herokuapp.com/word";

//sadece route çalışıyor mu bakmak için
words.get("/health-check", (req, res) => res.send("word route is working"));

//istenen uzunlukta ve sayıda kelimeler döndürmesi için(free mode'da kullanılır)
words.get("/get-random-words", async (req, res) => {
  const length = req.query.length;
  const number = req.query.number || 1;

  let url = BASE_URL;

  if (length || number) url = url + "?";

  if (length) url = url + `length=${length}`;

  if (length && number) url = url + "&";

  if (number) url = url + `number=${number}`;

  try {
    const result = await fetch(url);
    const resultJSON = await result.json();
    res.status(200).send(resultJSON);
  } catch (error) {
    res.status(404).send(`fetch error: ${error}`);
  }
});

export default words;
