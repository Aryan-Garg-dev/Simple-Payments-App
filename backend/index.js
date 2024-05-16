const express = require("express");
const rootRouter = require("./routes/index")
const bodyParser = require("body-parser");
const cors = require("cors")

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", rootRouter);


app.listen(PORT, ()=>{
    console.log(`App is listening to the port: ${PORT}`)
})

