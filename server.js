require('dotenv').config({path:"./config.env"});
const cors = require("cors");
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose
  .connect(`${process.env.DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("connected to Database !");
  })
  .catch((err) => {
    console.log("error in connecting to database", err);
  });
const errorHandler = require('./middleware/error');

app.use(cors());
app.use(express.json());
app.use('/api/auth',require('./routes/auth'));
app.use('/api/private',require('./routes/private'));
app.use(errorHandler);

app.get('/',(req,res)=>{
    res.send('Home');
})




const PORT = process.env.PORT;

const server = app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
})

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged error ${err}`);
    server.close(()=> process.exit(1));
})