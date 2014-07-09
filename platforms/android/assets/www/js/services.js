angular.module('starter.services', [])

.factory("Dictionary", function ($q, $http) {
  var defer = $q.defer();
  $http.get('https://spreadsheets.google.com/feeds/list/1PkvNQsLl6s5L8JUA_mbbv1nAwDtYVPxCVIqZYunUErw/od6/public/values?alt=json').success(function (data) {
    var dict = {};
    data.feed.entry.forEach(function (entry) {
      var spicewordKeys = Object.keys(entry).filter(function (key) {
        return key.indexOf('spiceword') > -1;
      });

      dict[entry['gsx$original']['$t']] = spicewordKeys.map(function (key) {
        return entry[key]['$t'];
      }).filter(function (value) {
        return value.length > 0;
      });
    });
    defer.resolve(dict);
  });
  return defer.promise;
})

.factory("Spicer", function ($firebase, Dictionary, $http) {
  var probRef = new Firebase('https://spicewords.firebaseio.com/probability');
  var probObjs = $firebase(probRef);

  var probWS = 0.5;

  probObjs.$on('value', function (wrapper) {
    probWS = parseInt(wrapper.snapshot.value['probWS']);
    console.log('new probWS');
    console.log(probWS);
  });

  probObjs.$on('child_changed', function (wrapper) {
    probWS = parseInt(wrapper.snapshot.value['probWS']);
    console.log('new probWS');
    console.log(probWS);
  });

  var dict = {};
  Dictionary.then(function (data) {
    dict = data;
  });

  return function (message) {
    var words = message.split(' ');
    var spiceWords = words.map(function (word) {
      //if (dict[word]) {
      if (Math.floor(Math.random() * 10) <= Math.floor(probWS * 10) && dict[word]) {
        return dict[word][Math.floor(Math.random() * (dict[word].length-1))]
      } else {
        return word;
      }
    });
    return spiceWords.join(' ');
  };
})
