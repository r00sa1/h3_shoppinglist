const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const config = require("./config")

const port = 3001

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  try {
    const connection = await mysql.createConnection(config.db) //yhdistää tietokantaan
    const [result] = await connection.execute("select * from item") //tehdään sql-kysely. result-sisältää tietueen, joka tässä tapauksessa select-kyselyn kautta saadaan
    if (!result) result = [] //jos resultissa ei ole tulosta eli tietokannan taulu on tyhjä, laitetaan arvoksi tyhjä tietokanta

    res.status(200).json(result) //jos menee läpi, niin vastaa näin. trycatch- estää sovelluksen kaatumisen, vaikka tietokanta ei vastaisi
  } catch (err) {
    res.status(500).json({ error: err.message }) //palauttaa jsonina tekstin
  }
})

app.post("/new", async function (req, res) {
  try {
    const connection = await mysql.createConnection(config.db)
    const [result] = await connection.execute(
      "insert into item (description, amount) values (?, ?) ",
      [req.body.description, req.body.amount],
    )
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port)