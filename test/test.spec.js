import fs from 'fs';
import chai from 'chai';
import myers from '../dist';

const expect = chai.expect,
    diff = myers.diff,
    formats = myers.formats;

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

        // lhs changed at index 0, del 1 line, to index 0
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(1);
        expect(change.lhs.ctx.getLine(change.lhs.at)).to.equal('the quick red fox jumped');

        // rhs changed at index 0, add 1 line, to index 0
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(1);
        expect(change.rhs.ctx.getLine(change.rhs.at)).to.equal('the quick brown fox jumped');

        expect(formats.GnuNormalFormat(changes)).to.equal(
            [
                '1c1',
                '< the quick red fox jumped',
                '---',
                '> the quick brown fox jumped',
                ''
            ].join('\n')
        );
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

        // lhs did not change
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(0);

        // rhs changed at index 0, add 1 line, to index 0
        expect(change.rhs.at).to.equal(1);
        expect(change.rhs.add).to.be.equal(1);

        expect(formats.GnuNormalFormat(changes)).to.equal(
            [
                '1a2',
                '> over the lazy dog',
                ''
            ].join('\n')
        );
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

        // lhs changed at at index 1, del 1 line, to index 1
        expect(change.lhs.at).to.equal(1);
        expect(change.lhs.del).to.be.equal(1);

        // rhs did not change
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(0);

        expect(formats.GnuNormalFormat(changes)).to.equal(
            [
                '2d1',
                '< over the hairy dog',
                ''
            ].join('\n')
        );
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

        // lhs changed at at index 2, del 1 line, to index 2
        expect(change.lhs.at).to.equal(2);
        expect(change.lhs.del).to.be.equal(1);

        // rhs changed at at index 2, add 1 line, to index 2
        expect(change.rhs.at).to.equal(2);
        expect(change.rhs.add).to.be.equal(1);

        change = changes[1];

        // lhs did not change
        expect(change.lhs.at).to.equal(4);
        expect(change.lhs.del).to.be.equal(0);

        // rhs changed at at index 4, add 1 line, to index 4
        expect(change.rhs.at).to.equal(4);
        expect(change.rhs.add).to.be.equal(1);

        change = changes[2];

        // lhs changed at at index 5, del 1 line, to index 5
        expect(change.lhs.at).to.equal(5);
        expect(change.lhs.del).to.be.equal(1);

        // rhs changed at at index 6, add 2 lines, to index 7
        expect(change.rhs.at).to.equal(6);
        expect(change.rhs.add).to.be.equal(2);

        change = changes[3];

        // lhs changed at at index 7, del 1 line, to index 5
        expect(change.lhs.at).to.equal(7);
        expect(change.lhs.del).to.be.equal(1);

        // rhs did not change
        expect(change.rhs.at).to.equal(8);
        expect(change.rhs.add).to.be.equal(0);

        // this is actually different from GNU diff and I think the
        // reason is shift_boundaries.
        expect(formats.GnuNormalFormat(changes)).to.equal(
            [
                '3c3',
                '< brown fox',
                '---',
                '> red fox',
                '5a5',
                '> jumped',
                '6c7,8',
                '< over the hairy',
                '---',
                '> over the lazy dog',
                '> ',
                '8d9',
                '< dog',
                ''
            ].join('\n')
        );
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

        // lhs changed at at index 0, del 2 line, to index 1
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(2);
        //expect(change.lhs.to).to.equal(1);

        // 2 line added at line 6
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(2);
    });
});

describe('#diff', function() {
    it('all added to rhs', function() {
        var changes = diff(
            '',
            'the\nquick\nred\nfox\njumped\nover\nthe\nlazy\ndog'
        );

        expect(changes.length).to.equal(1);

        let change = changes[0];

        // lhs changed at at index 0, del 1 line, to index 1
        expect(change.lhs.at).to.equal(0);
        expect(change.lhs.del).to.be.equal(0);

        // 2 line added at line 6
        expect(change.rhs.at).to.equal(0);
        expect(change.rhs.add).to.be.equal(9);
    });
});

describe('#diff', function() {
    it('many lines repeat', function() {
        var changes = diff(
            fs.readFileSync('./test/resources/moons_lhs.txt', 'utf-8'),
            fs.readFileSync('./test/resources/moons_rhs.txt', 'utf-8')
        );
        expect(formats.GnuNormalFormat(changes)).to.equal(
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
        // 0 char added at pos 21
        expect(change.rhs.at).to.equal(21);
        expect(change.rhs.add).to.be.equal(0);

    });
});

describe('#diff', function() {
    describe('compare chars', function() {
        it('compare change chars start-string', function() {
            var changes = diff(
                'the quick red fox jumped',
                'The quick red fox jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(0);
            expect(change.lhs.del).to.be.equal(1);

            expect(change.rhs.at).to.equal(0);
            expect(change.rhs.add).to.be.equal(1);
        });

        it('compare change chars end-string', function() {
            var changes = diff(
                'the quick red fox jumped',
                'the quick red fox Jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(18);
            expect(change.lhs.del).to.be.equal(1);

            expect(change.rhs.at).to.equal(18);
            expect(change.rhs.add).to.be.equal(1);
        });

        it('compare change chars mid-string', function() {
            var changes = diff(
                'the quick red fox jumped',
                'the quick RED fox jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(10);
            expect(change.lhs.del).to.be.equal(3);

            expect(change.rhs.at).to.equal(10);
            expect(change.rhs.add).to.be.equal(3);
        });

        it('compare add chars start-string', function() {
            var changes = diff(
                'the quick red fox jumped',
                '*the quick red fox jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(0);
            expect(change.lhs.del).to.be.equal(0);

            expect(change.rhs.at).to.equal(0);
            expect(change.rhs.add).to.be.equal(1);
        });

        it('compare add chars end-string', function() {
            var changes = diff(
                'the quick red fox jumped',
                'the quick red fox jumped*',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(23);
            expect(change.lhs.del).to.be.equal(0);

            expect(change.rhs.at).to.equal(24);
            expect(change.rhs.add).to.be.equal(1);
        });

        it('compare del chars start-string', function() {
            var changes = diff(
                '*the quick red fox jumped',
                'the quick red fox jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(0);
            expect(change.lhs.del).to.be.equal(1);

            expect(change.rhs.at).to.equal(0);
            expect(change.rhs.add).to.be.equal(0);
        });

        it('compare del chars end-string', function() {
            var changes = diff(
                'the quick red fox jumped*',
                'the quick red fox jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(1);

            change = changes[0];

            expect(change.lhs.at).to.equal(24);
            expect(change.lhs.del).to.be.equal(1);

            expect(change.rhs.at).to.equal(23);
            expect(change.rhs.add).to.be.equal(0);
        });

        it('compare chars', function() {
            var changes = diff(
                'the quick red fox jumped',
                'the quick orange fox jumped',
                {compare: 'chars'}
            ), change;

            expect(changes.length).to.equal(3);

            // adds an 'o' to the rhs
            expect(changes[0].lhs.at).to.equal(10);
            expect(changes[0].lhs.del).to.be.equal(0);
            expect(changes[0].rhs.at).to.equal(10);
            expect(changes[0].rhs.add).to.be.equal(1);

            // adds an 'ang' to the rhs
            expect(changes[1].lhs.at).to.equal(11);
            expect(changes[1].lhs.del).to.be.equal(0);
            expect(changes[1].rhs.at).to.equal(12);
            expect(changes[1].rhs.add).to.be.equal(3);

            // deletes a 'd' from the lhs
            expect(changes[2].lhs.at).to.equal(12);
            expect(changes[2].lhs.del).to.be.equal(1);
            expect(changes[2].rhs.at).to.equal(16);
            expect(changes[2].rhs.add).to.be.equal(0);
        });
    });
});
