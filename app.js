const path = require("path");
const fs = require('fs');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// routes
const todos = require("./routes/todos");
const comments = require("./routes/comments");
const getCollection = require("./utils").getCollection;

// serving static files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setting template engine
app.set("view engine", "pug");

//Basic REST API
app.get("/api/v1/todos", (req,res) => {
  fs.readFile("./database/todos.json", (err, data) => {
    if(err) throw err

    const todos = JSON.parse(data)

    res.json(todos)
  })
})


// todos urls
app.use("/todos", todos);
app.use("/comments", comments);

app.get("/", (req, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

// listen for requests :)
const listener = app.listen(8000, () => {
  console.log(`App is listening on port  http://localhost:8000`);
});
