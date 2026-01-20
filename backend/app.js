const express = require('express')
const app = express()
// const db = require('./db/knex')
const cors = require("cors");
const path = require('path');

app.use(express.json())
app.use(cors())

const usersRouter = require('./routes/usersRoutes')
const authRouter = require('./routes/authRouter')
const uploadRouter = require('./routes/uploadRouter')
const categoryRouter = require('./routes/categoryRouter')
const admin = require('./routes/adminRouter')
const evaluatee = require('./routes/evaluateeRouter')
const evaluator = require('./routes/evaluatorRoutes')


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/health', (req, res) => {
  console.log(req.query)
  res.send({
    status: 'OK',
    data: req.query
  })
})

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/cat", categoryRouter);
app.use("/api/admin", admin);
app.use("/api/evaluatee", evaluatee);
app.use("/api/evaluator", evaluator)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get('/api/list', (req, res) => { 
//   let data = db.select('*').from('users')
//   console.log(data)
//   res.json({ message: 'list Data endpoint',
//     data: data
//    })
//   })


module.exports = app;