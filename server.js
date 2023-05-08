const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const portNumber = 5001;
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");

require("dotenv").config({ path: path.resolve(__dirname, '.env') })
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const db = process.env.MONGO_DB_NAME;
const collection = process.env.MONGO_COLLECTION;

app.use(bodyParser.urlencoded({extended:false}));
process.stdin.setEncoding("utf8");

app.get("/", (request, response) => { 
    response.render("index");
});
app.get("/search", (request, response) => { 
    response.render("search");
});
app.get("/reset", (request, response) => {
    response.render("reset");
})

app.post("/reset", (request, response) => {
    response.render("resetConfirmation", {count: 5});
})

app.listen(portNumber);