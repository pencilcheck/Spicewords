angular.module('starter.filters', [])

.filter('timestamp', function () {
  return function (timestamp) {
    return moment(timestamp).format('h:mm a');
  };
})

