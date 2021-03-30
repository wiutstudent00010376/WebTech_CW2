const fs = require('fs')
const path = require('path')

const express = require("express")
const router = express.Router()

const Validator = require("../services/validators")
const DbContext = require("../services/db")
const root = require("../utils").root;
const getCollection = require("../utils").getCollection;

const dbc = new DbContext()
const v = new Validator()
dbc.useCollection("db.json")

router.get("/", (req, res) => {
  dbc.getAll(
    records => res.render("all_todos", { todos: records }),
    () => res.render("all_todos", { todos: null })
  )
})

router.get("/create-todo", (req, res) => {
  res.render("create_todo", {})
});

router.post("/create-todo", (req, res) => {
  if (v.isValid(req.body)) {
    dbc.saveOne(req.body, () => res.render("create_todo", { success: true }))
  } else {
    res.render("create_todo", { error: true, success: false })
  }
})

router.get('/:id/delete', (req, res) => {
  dbc.deleteOne(
    req.params.id, 
    () => res.redirect('/todos')),
    () => res.sendStatus(500)
})

router.get("/:id/archive", (req, res) => {
  fs.readFile(getCollection('db.json'), (err, data) => {
    if (err) res.sendStatus(500)

    const todos = JSON.parse(data)
    const todo = todos.filter(todo => todo.id == req.params.id)[0]
    const todoIdx = todos.indexOf(todo)
    const splicedTodo = todos.splice(todoIdx, 1)[0]
    splicedTodo.archive = true
    todos.push(splicedTodo)

    fs.writeFile(getCollection('todos.json'), JSON.stringify(todos), err => {
      if (err) res.sendStatus(500)

      res.redirect('/todos')
    })
    
  })
})

router.get("/:id", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("todo_detail", { todo: record }),
    () => res.sendStatus(404)
  )
})

module.exports = router;

