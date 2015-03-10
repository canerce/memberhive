angular.module('formatFilters', [])
  .filter('temperature', function() {
  return function(item) {
    return item.toPrecision(1) + ' °C';
  };
});


angular.module('dateFilters', [])
  .filter('fromNow', function() {
    return function(date, removeSuffix) {
      return moment(date).fromNow(removeSuffix);
    };
  });

angular.module('contactFilters', [])
  .filter('formatFacebookUrl', function() {
    return function(item) {
      return `https://facebook.com/${item}`;
    };
  })
  .filter('formatSkypeUrl', function() {
    return function(item) {
      return `skype:${item}`;
    };
  });
