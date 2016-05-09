export var mhAclModule = angular.module('mh.acl', [])
.constant(
  'mh-acl.config',
  {
    'loginPage': 'login'
  }
)
.provider('MhAcl', ['mh-acl.config', function(config) {
  var self = {};
  self.rights = false;
  self.rightsPromise = false;

  self.isGranted = (actions) => _.every(actions, (i) => _.includes(self.rights, i));
  self.isNotGranted = (actions) => !self.isGranted(actions);

  this.$get = ['$q', '$rootScope', '$state', function($q, $rootScope, $state) {
    var acl = {};

    acl.setRights = (rights) => self.rights = rights;
    acl.setRightsPromise = (rightsPromise) => {
      self.rightsPromise = rightsPromise;
      self.rightsPromise
        .then(
          (data) => {
            self.rights = data.roles;
            $rootScope.acl = acl;
          },
          () => {
            self.rights = [];
            $rootScope.acl = acl;
            $state.go(config.loginPage);
          }
        );

    };
    
   
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      //jshint unused:false
      if (self.rights === false) {
        /*if(toState.name !== config.loginPage) {
          event.preventDefault();
          $state.go(config.loginPage);
        }*/
        self.rightsPromise
        .then(
          (data) => {
            self.rights = data.roles;
            $rootScope.acl = acl;
            acl.changeState(event, toState);
          },
          () => {
            self.rights = [];
            $rootScope.acl = acl;
            acl.changeState(event, toState);
          }
        );
      } else { //we have a reponse from loopback and we can check whether the user is allowed to do that
        acl.changeState(event, toState);
      }
    });

    acl.changeState = (event, toState) => {
      if (!toState.acl || !toState.acl.needRights) {
        return acl;
      }
      var isGranted = self.isGranted(toState.acl.needRights);
      if (!isGranted) {
        event.preventDefault();
        if (config.loginPage !== toState.name) {
          $state.go(config.loginPage);
        }
      }
      if(isGranted && config.loginPage === toState.name) {
        event.preventDefault();
        $state.go('dashboard');
      }
    };

    acl.isLoggedOut = () => self.isNotGranted(['$authenticated']);
    acl.isLoggedIn = () => self.isGranted(['$authenticated']);
    acl.can = (action) => self.isGranted([action]);
    acl.canAll = (actions) => self.isGranted(actions);
    acl.canAny = (actions) =>  _.any(actions, (i) => _.includes(self.rights, i));

    return acl;

  }];
}]);
