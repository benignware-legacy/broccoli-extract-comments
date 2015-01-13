"use strict";

var fs = require('fs');
module.exports = {
  fromString: function(string) {
    var
      regexp = new RegExp(/(?:".*")|(?:'.*')|(?:\/\*+([\s\S|\n]*?)\*\/)|(?:\/\/[^\n$]*)/gim),
      match, matches, comments = [];
    
    while ((matches = regexp.exec(string)) !== null) {
      match = matches[0];
      if (!(match.indexOf('"') === 0 || match.indexOf("'") === 0)) {
        // comment
        comments.push({
          begin: regexp.lastIndex - match.length,
          end: regexp.lastIndex,
          raw: match,
          text: match.indexOf('//') === 0 ? match.replace(/^\/\/\s*/, "") : match.replace(/(?:^\/\*+\s*)|(?:\s*\*+\/)/gi, "").replace(/(?:^\s*\*+\s*)/gim, ""),
          type: match.indexOf('//') === 0 ? 'line' : 'block'
        });
      }
    }
    
    return comments;
  },
  fromFiles: function(files) {
    var
      comments = [],
      self = this;
    files.forEach(function(file) {
      var string = fs.readFileSync(file, "utf8");
      comments = comments.concat(self.fromString(string).map(function(comment) {
        comment.file = file;
        return comment;
      }));
    });
    return comments;
  }
};
