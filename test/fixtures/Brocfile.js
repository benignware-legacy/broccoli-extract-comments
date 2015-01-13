var extractComments = require('../..');

var commentsTree = extractComments('src', {
  /*filter: function(comment) {
    return comment.text.indexOf('Hello World!') >= 0;
  },*/
  /*raw: true,*/
  inputFiles: [
    '**.*'
  ],
  outputFile: 'comments.txt'
});

module.exports = commentsTree;