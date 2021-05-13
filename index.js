const express = require('express')


const o_db = require('./ofisQueries')
const s_db = require('./sahaQueries')
const g_db = require('./geometryQueries')

var cors = require('cors');

const app =  express()
app.use(cors());
app.use(express.json());
const port = 2022

app.get('/', (request, response) => {
    response.json({ info: 'Geotech Map PİM projesi rest api' })
  })

app.get('/ofis', o_db.getOfisIsPlani)
app.post('/ofispost',o_db.insertOfis)
app.post('/ofisdel',o_db.delFromOfis )


app.get('/saha',s_db.getSahaIsPlani)
app.post('/sahapost',s_db.insertSaha)
app.post('/sahadel',s_db.delFromSaha )


app.post('/geo', g_db.ilSınır)

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})