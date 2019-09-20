const express = require('express');
const mongoose = require('mongoose');
const config = require('config')

const userRouter = require("./routes/userRoutes")
const adminRouter = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
if(!config.get('sendGridApi')){
    console.error("Fatal Error: jwt private key is not defined");
    process.exit(1)
}


const port = process.env.PORT || 7000

mongoose.connect("mongodb://localhost/client", { useNewUrlParser: true,  useUnifiedTopology: true  })
    .then(() => {
        console.log("Connected to MongoDb");
    })
    .catch((err) => {
        console.log('An error occured while trying to connect to mongo db', err)
    })



app.use("/user", userRouter);
app.use("/admin", adminRouter)

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`);
})