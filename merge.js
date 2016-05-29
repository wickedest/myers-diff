"use strict";

var fs = require('fs'),
    mergely = require('./src/index'),
    diff = mergely.diff;

class Line {
    constructor (text) {
        this.text = text;
    }
}

class SinglePageDiff {
    constructor (changes) {
        this.changes = changes;
        this.lines = [];
        if (!this.changes.length) {
            return;
        }
        var i, change = this.changes[0], text;
        this.lhs_len = change.lhs.ctx.length;
        this.rhs_len = change.rhs.ctx.length;
        this.max = Math.max(this.lhs_len, this.rhs_len);
        for (i = 0; i < this.max; ++i) {
            if (i < this.lhs_len) {
                text = change.rhs.ctx.getLine(i);
                this.lines.push(text);
            }
        }
    }

    update () {
        var i;
        for (i = 0; i < this.lines.length; ++i) {
            console.log(this.lines[i]);
        }
    }
}

var changes = diff(
    'the quick red fox jumped\nover the lazy dog',
    'the quick brown fox jumped\nover the lazy cat',
    {
        compare: 'lines',
        output: 'RawFormat'
    }
);

var v = new SinglePageDiff(changes);
v.update();
