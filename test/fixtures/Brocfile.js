var extractComments = require('../..');

var commentsTree = extractComments('src', {
  /*copyLines: true,*/
  /*filter: function(comment) {
    return comment.indexOf('Hello') >= 0;
  },*/
  inputFiles: [
    '**.*'
  ],
  outputFile: 'comments.txt'
});

module.exports = commentsTree;