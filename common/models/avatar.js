var path = require('path');
var fs = require('fs');
var bunyan = require('bunyan');
var lwip = require('lwip');
var log = bunyan.createLogger({name: 'gem.avatar'});

module.exports = function(Avatar) {
  this.thumbSizes = {
    'xs': 50,
    's':  150,
    'm':  400,
    'l': 800
  };
  var self = this;
  /**
   * Create the container (=folder named by userId) if it doesn't exist
   */
  Avatar.beforeRemote('upload', function(ctx, res, next) {
    var personId = ctx.req.params.container;
    Avatar.getContainer(personId, function(err, container){
      if (err) { // Container doesn't exist
        Avatar.createContainer({name: personId}, function(err, container) {
          Avatar.app.models.Person.findById(personId, function(err, person) {
            person.hasAvatar = true;
            Avatar.app.models.Person.upsert(person, next);
          });
        });
      } else {
       Avatar.app.models.Person.findById(personId, function(err, person) {
          person.hasAvatar = true;
          Avatar.app.models.Person.upsert(person, next);
        });
      }
    });

  });

  /**
   * Check input file and create thumbnails
   */
  Avatar.afterRemote('upload', function(ctx, res, next) {
    var inputfile = res.result.files.file[0];
    var uploadPath = Avatar.app.datasources["uploads.avatar"].settings.root;
    var folderPath = path.join(uploadPath, inputfile.container);
    var filePath = path.join(folderPath, inputfile.name);
    if (inputfile.type != 'image/png' && inputfile.type != 'image/jpg' && inputfile.type != 'image/jpeg') {
      fs.unlinkSync(filePath);
      next(new Error('Wrong file type. Only jpg and png are supported.'));
      return;
    }
    //hacky callbacks
    //FIXME: use a async library or q
    this.createThumb(filePath, folderPath, 'xs',
      this.createThumb(filePath, folderPath, 's',
        this.createThumb(filePath, folderPath, 'm',
          this.createThumb(filePath, folderPath, 'l', function(err) { console.log(err); next();})
        )
      )
    )();
  });

  this.createThumb = function (filePath, folder, size, cb) {
    return function(err) {
      lwip.open(filePath, function(err, image) {
        console.log(err);
        if(image) {
          image.batch()
            .resize(self.thumbSizes[size])
            .writeFile(path.join(folder, size+".jpg"), cb);
        } else {
          cb();
        }
      });
    };
  };


};
