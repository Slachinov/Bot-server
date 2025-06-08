const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Привет с сервера на Render!')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Сервер запущен')
})
