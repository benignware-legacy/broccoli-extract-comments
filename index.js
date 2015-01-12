/**
 * broccoli-extract-comments
 * 
 * Extract comments from source files
 */
'use strict';

var fs = require('node-fs');
var path = require('path');
var pathCompleteExtname = require('path-complete-extname');
var BroccoliHelpers = require('broccoli-kitchen-sink-helpers');
var Writer = require('broccoli-writer');
var CachingWriter = require('broccoli-caching-writer');
var glob = require('glob');
var merge = require('deepmerge');
var extractComments = require('extract-comments');

function writeFile(file, buffer, mtime) {
  mtime = mtime || new Date().getTime();
  if (!fs.existsSync(path.dirname(file))) {
    fs.mkdirSync(path.dirname(file), '0777', true);
  }
  fs.writeFileSync(file, buffer);
  fs.utimesSync(file, mtime, mtime);
}

function BroccoliExtractComments(inputTree, options) {
  
  if (!(this instanceof BroccoliExtractComments)) {
    return new BroccoliExtractComments(inputTree, options);
  }
  
  // Init properties
  this.inputTree = inputTree;
  this.options = merge({
    allowNone: true,
    separator: '\n',
    filter: null,
    outputFile: 'comments.txt'
  }, options);
  
  // Setup during build
  this._environment = null;
}
BroccoliExtractComments.prototype = Object.create(Writer.prototype);
BroccoliExtractComments.prototype.constructor = Writer;
BroccoliExtractComments.prototype.description = 'broccoli-extract-comments';

BroccoliExtractComments.prototype.write = function (readPath, destDir) {
  
  var
    options = this.options,
    inputFiles = [];
   
  return readPath(this.inputTree).then(function (srcDir) {
    
    // Filter input files on order to allow none
    if (options.allowNone) {
      options.inputFiles.forEach(function (file) {
        if (glob.sync(file, {cwd: srcDir}).length > 0) {
          inputFiles.push(file);
        }
      });
    } else {
      inputFiles = options.inputFiles;
    }

    // Collect glob files
    try {
      inputFiles = BroccoliHelpers.multiGlob(inputFiles, {cwd: srcDir, allowNone: options.allowNone, nodir: true});
    } catch (e) {
      if (!options.allowNone) {
        throw e;
      }
    }
    
    //console.log("Source assets: ", JSON.stringify({files: inputFiles}, null, "  "));
    
    if (!inputFiles.length) {
      if (!options.allowNone) {
        throw("No valid input files found");
      }
      return;
    }
    
    var 
      output = [],
      comments = extractComments.fromFiles(inputFiles.map(function(file) { return path.join(srcDir, file);}));
      
    Object.keys(comments)
      // Fetch comments
      .forEach(function(file) {
        var fileComments = comments[file];
        output = output.concat(Object.keys(fileComments).map(function(index) {
          var
            comment = fileComments[index],
            use = true,
            contents = "";
          if (typeof options.filter === "function") {
            use = options.filter(comment.comment, comment.begin, comment.end, comment.type);
          }
          if (use) {
            if (options.copyLines) {
              contents = fs.readFileSync(file, "utf8");
              return contents.split("\n").slice(Math.max(comment.begin - 1, 0), comment.end).join("\n");
            }
            return comment.comment.trim();
          }
          return null;
        }))
      // Filter null values
      .filter(function(value) {
        if (value) {
          return true;
        }
        return false;
      });
    });
    if (options.outputFile) {
      writeFile(path.join(destDir, options.outputFile), output.join(options.separator));
    }
  });
};




module.exports = BroccoliExtractComments;