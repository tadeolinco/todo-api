const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./todo.model');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

mongoose.connect('mongodb://localhost/todo-test', function(err) {
    if (err) console.log('Error connecting to database');
    else console.log('Success in connecting to database');
});

app.get('/todos', (req, res) => {
    Todo.find({}, (err, todos) => {
        return res.json(todos);
    });
});

app.get('/todos/:id', (req, res) => {
    Todo.findOne({ _id: req.params.id }, (err, todo) => {
        return res.json(todo);
    });
});

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: false
    });
    todo.save((err, newTodo) => {
        return res.json(newTodo);
    });
});

app.put('/todos/:id', (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
        todo.text = req.body.text;
        todo.completed = req.body.completed;

        todo.save((err, newTodo) => {
            return res.json(newTodo);
        });
    });
});

app.delete('/todos/:id', (req, res) => {
    Todo.findOneAndRemove({ _id: req.params.id }, (err, todo) => {
        return res.json(null);
    });
});

app.delete('/todos', (req, res) => {
    Todo.remove({}, err => {
        return res.json(null);
    });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
