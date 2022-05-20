const express = require("express");


const app= express();
const bookRoute = require("./routes/books.route")
app.use(express.json());


app.use("/api/books", bookRoute);

const port  = 8080;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});