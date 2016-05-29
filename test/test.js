"use strict";

var fs = require('fs'),
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    myers = require('../src/index'),
    formats = require('../src/formats'),
    diff = myers.diff;

describe('#diff', function() {
    it('illegal argument "lhs"', function() {
        expect(diff).to.throw(Error, /illegal argument 'lhs'/);
    });
});

describe('#diff', function() {
    it('illegal argument "rhs"', function() {
        expect(diff.bind(diff, 'lhs')).to.throw(Error, /illegal argument 'rhs'/);
    });
});

describe('#diff', function() {
    it('one line, no changes', function() {
        var changes = diff(
            'the quick red fox jumped',
            'the quick red fox jumped'
        );
        expect(changes.length).to.equal(0);
    });
});

describe('#diff', function() {
    it('two lines, no changes', function() {
        var changes = diff(
            'the quick red fox jumped\nover the lazy dog',
            'the quick red fox jumped\nover the lazy dog'
        );
        expect(changes.length).to.equal(0);
    });
});

describe('#diff', function() {
    it('one line changed', function() {
        var changes = diff(
            'the quick red fox jumped', 
            'the quick brown fox jumped'
        );

        expect(changes.length).to.equal(1);
        var change = changes[0];

        // 1 line deleted at line 0
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(1);
        expect(change.lhs.ctx.getLine(change.lhs.at)).to.equal('the quick red fox jumped');

        // 1 line added at line 0
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(1);
        expect(change.rhs.ctx.getLine(change.rhs.at)).to.equal('the quick brown fox jumped');
    });
});

describe('#diff', function() {
    it('one line added', function() {
        var changes = diff(
            'the quick red fox jumped', 
            'the quick red fox jumped\nover the lazy dog'
        );

        expect(changes.length).to.equal(1);
        var change = changes[0];

        // 0 line deleted at line 1
        expect(change.lhs.at).to.equal(1);
        expect(change.lhs.del).to.be.equal(0);

        // 1 line added at line 1
        expect(change.rhs.at).to.equal(1);
        expect(change.rhs.add).to.be.equal(1);
    });
});

describe('#diff', function() {
    it('one line removed', function() {
        var changes = diff(
            'the quick red fox jumped\nover the hairy dog',
            'the quick red fox jumped'
        );

        expect(changes.length).to.equal(1);
        var change = changes[0];

        // 1 line deleted at line 1
        expect(change.lhs.at).to.equal(1);
        expect(change.lhs.del).to.be.equal(1);

        // 0 line added at line 1
        expect(change.rhs.add).to.be.equal(0);
        expect(change.rhs.at).to.equal(1);
    });
});

describe('#diff', function() {
    it('multi lines', function() {
        var changes = diff(
            'the quick\n\nbrown fox\n\n\nover the hairy\n\ndog',
            'the quick\n\nred fox\n\njumped\n\nover the lazy dog\n\n'
        ), change;

        expect(changes.length).to.equal(4);

        change = changes[0];

        // 1 line deleted at line 2
        expect(change.lhs.at).to.equal(2);
        expect(change.lhs.del).to.be.equal(1);
        // 1 line added at line 2
        expect(change.rhs.at).to.equal(2);
        expect(change.rhs.add).to.be.equal(1);

        change = changes[1];

        // 0 line deleted at line 4
        expect(change.lhs.at).to.equal(4);
        expect(change.lhs.del).to.be.equal(0);
        // 1 line added at line 4
        expect(change.rhs.at).to.equal(4);
        expect(change.rhs.add).to.be.equal(1);

        change = changes[2];

        // 1 line deleted at line 5
        expect(change.lhs.at).to.equal(5);
        expect(change.lhs.del).to.be.equal(1);
        // 2 line added at line 6
        expect(change.rhs.at).to.equal(6);
        expect(change.rhs.add).to.be.equal(2);

        change = changes[3];

        // 1 line deleted at line 7
        expect(change.lhs.at).to.equal(7);
        expect(change.lhs.del).to.be.equal(1);
        // 0 line added at line 9
        expect(change.rhs.at).to.equal(9);
        expect(change.rhs.add).to.be.equal(0);
    });
});


describe('#diff', function() {
    it('all lines have only changes', function() {
        var changes = diff(
            'the quick red fox jumped\nover the hairy dog', 
            'the quick brown fox jumped\nover the lazy dog'
        ), change;

        expect(changes.length).to.equal(1);

        change = changes[0];

        // 1 line deleted at line 5
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(2);
        // 2 line added at line 6
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(2);
    });
});

describe('#diff', function() {
    it('many lines repeat', function() {
        var changes = diff(
            fs.readFileSync('./test/resources/moons_lhs.txt', 'utf-8'),
            fs.readFileSync('./test/resources/moons_rhs.txt', 'utf-8')
        );
        formats.GnuNormalFormat(changes).should.equal(
            fs.readFileSync('./test/resources/moons.diff', 'utf-8')
        );
    });
});

describe('#diff', function() {
    it('compare words start-string', function() {
        var changes = diff(
            'the quick red fox jumped',
            'The quick red fox jumped',
            {compare: 'words'}
        ), change;

        expect(changes.length).to.equal(1);

        change = changes[0];

        // 1 word deleted at pos 0
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(1);
        // 1 word added at pos 0
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(1);
    });
});

describe('#diff', function() {
    it('compare words mid-string', function() {
        var changes = diff(
            'the quick red fox jumped',
            'the quick brown fox jumped',
            {compare: 'words'}
        ), change;

        expect(changes.length).to.equal(1);

        change = changes[0];

        // 1 word deleted at pos 2
        expect(change.lhs.at).to.equal(2);
        expect(change.lhs.del).to.be.equal(1);
        // 1 word added at pos 2
        expect(change.rhs.at).to.equal(2);
        expect(change.rhs.add).to.be.equal(1);

    });
});

describe('#diff', function() {
    it('compare words end-string', function() {
        var changes = diff(
            'the quick red fox jumped',
            'the quick red fox swam',
            {compare: 'words'}
        ), change;

        expect(changes.length).to.equal(1);

        change = changes[0];

        // 1 word deleted at pos 4
        expect(change.lhs.at).to.equal(4);
        expect(change.lhs.del).to.be.equal(1);
        // 1 word added at pos 4
        expect(change.rhs.at).to.equal(4);
        expect(change.rhs.add).to.be.equal(1);

        expect(change.lhs.ctx.getLine(change.lhs.at)).to.equal('jumped');
        expect(change.rhs.ctx.getLine(change.rhs.at)).to.equal('swam');
    });
});

describe('#diff', function() {
    it('compare words end-string', function() {
        var changes = diff(
            'the quick red fox jumped',
            'the quick red fox swam',
            {compare: 'chars'}
        ), change;

        expect(changes.length).to.equal(2);

        change = changes[0];

        // 2 char deleted at pos 18
        expect(change.lhs.at).to.equal(18);
        expect(change.lhs.del).to.be.equal(2);
        // 3 char added at pos 18
        expect(change.rhs.at).to.equal(18);
        expect(change.rhs.add).to.be.equal(3);

        change = changes[1];

        // 3 char deleted at pos 21
        expect(change.lhs.at).to.equal(21);
        expect(change.lhs.del).to.be.equal(3);
        // 0 char added at pos 22
        expect(change.rhs.at).to.equal(22);
        expect(change.rhs.add).to.be.equal(0);

    });
});
