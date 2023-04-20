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
    constructor(question, metrics) {
        this.question = question;
        this.metrics = Array.isArray(metrics)?metrics:new Array();
    }
    set metric(m) {
        if (m instanceof Metric) this.metric.push(m);
        else throw new Error("Type-Error: Metric");
    }
}

class Reply extends Question {
    constructor(question, metrics, reply, comments, date) {
        super(question, metrics);
        this.reply = reply;
        this.comments = (Array.isArray(comments))?comments:new Array();
        this.date = (date)?moment().format():date;
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

class AnswerDoc {
    constructor (qid, qname, name, author, replies) {
        this.id = uuidv4();
        this.qid = qid;
        this.qname = qname;
        this.name = name;
        this.author = author;
        this.replies = Array.isArray(replies)?replies:new Array();
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

/* ---- */

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


exports.Reply = Reply;
exports.Comment = Comment;
exports.Metric = Metric;
exports.Question = Question;
exports.QuestionDoc = QuestionDoc;
exports.AnswerDoc = AnswerDoc;

exports.questionForm = questionForm;
exports.loadQuestionForm = loadQuestionForm;
exports.loadAnswerForm = loadAnswerForm;
exports.exportCSV = exportCSV;
