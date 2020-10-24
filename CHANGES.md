# Changes

## 2.0.0
Major interface change.

* chore: updated dependencies
* chore: updated documenation
* major: changed main export from default named export (i.e. it is not necessary to use`require('myers-diff').default`) to 
* major: no longer building browser bundled source
* major: dropped bower support
* major: added `getPart` to lhs/rhs change items for easier access (than `ctx`).
* major: removed `ctx` from lhs/rhs change items (this is now not part of the public interface).
* minor: added `changed` function for easier comparison
* minor: lhs/rhs items now have `pos`, `text`, and `length`

## 1.x
Initial release.
