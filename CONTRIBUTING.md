# Contributing

Thank you for helping make myers-diff better!  Every contribution is appreciated.  If you plan to implement a new feature, please create an issue first, to make sure your work is not lost, but also so that the maintainers can get an idea of what you are planning.

## Documentation

Your changes must ensure that the documentation in REAMDE.md are up to date.

## Development

Code must have 100% code coverage to be accepted.

To run the unit-tests:

```bash
$ npm test
```

To run one test, you can find it in the source, and add `.only`, e.g.:

```js
it.only('should compare chars at end of string', function() {
```

To run the full build, including linting:

```bash
$ npm run build
```

## Code style

- Use tabs and use the same style that the rest of the module uses.
- With the exception of some iterators (e.g. `i`, do not use single-character variables).
