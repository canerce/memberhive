var path = require('path');
var fs = require('fs');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'gem.avatar'});

module.exports = function(Avatar) {
  var self = this;

  this.uploadPath = './uploads/avatar/';
  this.thumbSizes = {
    'xs': 50,
    's':  150,
    'm':  400,
    'l': 800
  };

  /**
   * Create the container (=folder named by userId) if it doesn't exist
   */
  Avatar.beforeRemote('upload', function(ctx, res, next) {
    console.log("before remote upload");
    var personId = ctx.req.params.container;
    Avatar.getContainer(personId, function(err, container){
      if (err && err.code == 'ENOENT') { // Container doesn't exist
        Avatar.createContainer({name: personId}, function(err, container) { next();});
        console.log("container created");
      } else {
         next();
      }
    });
   
  });

  /**
   * Check input file and create thumbnails
   */
  Avatar.afterRemote('upload', function(ctx, res, next) {
    console.log("after remote");
    var inputfile = res.result.files.file[0];

    var folder = path.join(self.uploadPath, inputfile.container);
    var originalfile = path.join(folder, inputfile.name);
    var copyfile = path.join(folder, 'copy.jpg');

    // Weird bug: When trying to create thumbnails from `originalfile`, thumbnails will be kaputt.
    // When operating on `copyfile`, it works, whyever.
    // https://github.com/strongloop/loopback-component-storage/issues/56
    // https://github.com/strongloop/loopback-component-storage/issues/58
    fs.createReadStream(originalfile).pipe(fs.createWriteStream(copyfile));

    if (inputfile.type != 'image/png' && inputfile.type != 'image/jpg' && inputfile.type != 'image/jpeg') {
      fs.unlinkSync(originalfile);
      fs.unlinkSync(copyfile);
      next(new Error('Wrong file type. Only jpg and png are supported.'));
      return;
    }

    Object.keys(self.thumbSizes).forEach(function(size) {
      lwip.open(copyfile, function(err, image) {
        if (err) {
          log.error(err);
          next(new Error('Could not read image file.'));
          return;
        }
        image.batch()
          .resize(self.thumbSizes[size])
          .writeFile(path.join(folder, size+".jpg"), function(err) {
            if (err) {
              log.error(err);
              next(new Error('Could not create image thumbnails.'));
            }
          });
      });
    });
    next();
  });


};
