"use strict"

const moment = require('moment');
const {v4: uuidv4 } = require('uuid');
const { Parser } = require ('@json2csv/plainjs');

class Comment {
    constructor(author, message, date) {
        this.author = author;
        this.message = message;
        this.date = (date)?date:moment().format();
    }
}

class Metric {
    constructor(name, desc, value) {
        this.name = name;
        this.description = desc;
        this.value = (value)?value:null;
    }
}

class Question {
    constructor(question, answer, comments, metrics) {
        this.question = question;
        this.answer = (answer)?answer:'NA';
        this.comments = Array.isArray(metrics)?metrics:new Array();
        this.metrics = Array.isArray(metrics)?metrics:new Array();
    }
    set metric(m) {
        if (m instanceof Metric) this.metrics.push(m);
        else throw new Error("Type-Error: Metric");
    }
    set comment(c) {
        if (c instanceof Comment) this.comments.push(c);
        else throw new Error("Type-Error: Comment");
    }
}


class QuestionDoc {
    constructor(id, name, author, questions, desc) {
        this.id = id?uuidv4():id;
        this.name = name;
        this.author = author;
        this.questions = Array.isArray(questions)?questions:new Array();
        this.description = desc;
        this.date = moment().format();
        this.updated = moment().format();
    }
    set question(q) {
        if (q instanceof Question) this.questions.push(q);
        else throw new Error("Type-Error: Question");
    }
}

function questionForm(name, author) {
    return new QuestionDoc(uuidv4(), name, author);
}

function loadQuestionForm(obj) {
    return Object.assign(new QuestionDoc(), obj);
}

function loadAnswerForm(obj) {
    return Object.assign(new AnswerDoc(), obj);
}

function exportCSV(obj) {
    return new Parser().parse(obj);
}

exports.Comment = Comment;
exports.Metric = Metric;
exports.Question = Question;
exports.QuestionDoc = QuestionDoc;

exports.questionForm = questionForm;
exports.loadQuestionForm = loadQuestionForm;
exports.exportCSV = exportCSV;


const InputType = {
    email: 'Email',
    date: 'Date',
    name: 'Name',
    para: 'Para',
    number: 'Number',
    option: 'Option',
    toggle: 'Toggle',
    text: 'Text'
}

class Option {
    constructor(value, label) {
        this.value = value;
        this.label = label;
    }
}

class Shape {
    constructor(name, type, value, required, options) {
        this.name = name;
        this.type = InputType[type]?InputType[type]:InputType['text'];
        this.options = (Array.isArray(options))?options:new Array();
        this.value = value;
        this.required = required;
    }
    set option(o) {
        if (o instanceof Option) this.options.push(o);
        else throw new Error("Type-Error: Option");
    }
}

class Form {
    constructor(shapes) {
        this.shapes = (Array.isArray(shapes))?shapes:new Array();
    }
    set shape(s) {
        if (s instanceof Shape) this.shapes.push(s);
        else throw new Error("Type-Error: Shape");
    }
}

exports.Option = Option;
exports.Shape = Shape;
exports.Form = Form;

