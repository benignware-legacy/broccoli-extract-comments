# broccoli-extract-comments
> Extract code comments from source files

This broccoli-plugin let's you extract code comments and write into an output-file.

Basic Usage
-----------

```js
// Brocfile.js
var extractComments = require('broccoli-extract-comments');

var commentsTree = extractComments('src', {
  inputFiles: [
    '**.*'
  ],
  outputFile: 'comments.txt'
});

module.exports = commentsTree;
```


### Options

#### options.allowNone
Type: `Boolean`
Default value: `false`

Allows for empty file paths in broccoli's globbing pattern

#### options.copyLines
Type: `Boolean`
Default value: `false`

Specifies whether to copy lines including comment tokens

#### options.filter
Type: `Function`
Default value: `null`

Specify a callback-function to filter desired comments, i.e.:

```js
function(comment) {
  return comment.indexOf('Hello') >= 0;
}
```

#### options.outputFile
Type: `String`
Default value: `"comments.txt"`

Specifies destination file for extracted comments

#### options.separator
Type: `String`
Default value: `"\n"`

Specifies separator for concatenated comments