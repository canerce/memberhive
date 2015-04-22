var _ = require('lodash');
module.exports = function(Person) {
  Person.search = function(value, cb) {
    Person.find({
      where: {
        or: [
          {firstName: {like: `%${value}%`}},
          {middleName: {like: `%${value}%`}},
          {lastName: {like: `%${value}%`}},
          {nickName: {like: `%${value}%`}},
          {prefix: {like: `%${value}%`}},
          {suffix: {like: `%${value}%`}}
        ]
      },
      limit: 10
    }, function(err, persons) {
      cb(null, persons);
    });
  };

  Person.trash = function(personId, cb) {

    // Need to reset the default scope because of https://github.com/strongloop/loopback/issues/1018
    var defaultScope = Person.defaultScope;
    Person.defaultScope = function(){};

    Person.upsert({id:personId, 'deleted': true}, function(err, obj){
      cb(null, '');
    });

    // Restore the default scope
    Person.defaultScope = defaultScope;
  };

  /**
   * Set the Account's email property to the same value as the Person's email.
   * We have this redundancy since Account has it's own email field (inheritet from the Loopback model), but
   * there might be Persons without an Account, but they still need the email field
   *
   * So we need to make sure the email field is always the same in both places.
   */
  Person.observe('after save', function(ctx, next) {
    if (!ctx.instance) { // Single model has been updated
      next();
      return;
    }
    Person.app.models.Account.findById(ctx.instance.id, function(err, account) {
      if (account === null) { // Person has no account - that's ok
        next();
        return;
      }
      account.email = ctx.instance.email;
      account.save(function(err, result) {
        next();
      });
    })
  });

  Person.remoteMethod(
    'search',
    {
      accepts: {
        arg: 'value',
        type: 'string',
        required: true
      },
      returns: {
        arg: 'results',
        type: 'array'
      }
    }
  );

  Person.remoteMethod(
    'trash',
    {
      accepts: {
        arg: 'id',
        type: 'int',
        required: true
      }
    }
  );
  Person.simpleInsert = function(person, cb) {

    Person.upsert(_.pick(person, _.keys(Person.definition.properties)), function(err, obj) {
      if(person.homeAddress !== undefined) {
        var addr = obj.homeAddress.build(person.homeAddress);
        obj.homeAddress.create(addr);
      } 
      if(person.workAddress !== undefined) {
        var addr = obj.workAddress.build(person.workAddress);
        obj.workAddress.create(addr);
      } 
      if(person.postalAddress !== undefined) {
        var addr = obj.postalAddress.build(person.postalAddress);
        obj.postalAddress.create(addr);
      }
      cb(null, obj);
    });

  };

  Person.remoteMethod(
    'simpleInsert',
    {
      accepts: {
        arg: 'person',
        type: 'object',
        required: true
      }
    }
  );
  
  
  Person.tags = function(text, cb) {
    var personCollection = Person.getDataSource().connector.collection(Person.modelName);
    personCollection.distinct('tags', function(err, tags) {
      if(err) {
        cb(err, null);
      } else {
        var t = tags;
        if(text !== undefined) {
          t = _.filter(tags, function(tag) {return _.includes(tag.text, text);});
        }
        t = _.map(t, function(data) {return data.text});
        cb(null, t);
      }
    });
  };

  Person.remoteMethod(
    'tags',
    {
      accepts: {
        arg: 'text',
        type: 'string',
      },
      returns: {
        arg: 'data',
        type: 'array'
      }
    }
  );
  /*Person.afterRemote('find', function (ctx, person, next) {
    console.log(typeof ctx.args.filter);
    if(ctx.args && ctx.args.filter){
      var filter = JSON.parse(ctx.args.filter);
      console.log(filter);
      if(filter && _.indexOf(filter.include, 'addresses') !== -1) {
        ctx.result.forEach(function (result) {
          console.log(result.addresses);
        });
      }
    }
    next();
  });*/
};
