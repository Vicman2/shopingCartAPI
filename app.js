const express = require('express');

const mongoose = require('mongoose');

const userRouter = require("./routes/userRoutes")
const adminRouter = require("./routes/adminRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


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