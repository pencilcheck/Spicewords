angular.module('starter.services', [])

.factory("Dictionary", function ($http) {
  return $http.get('https://spreadsheets.google.com/feeds/list/1PkvNQsLl6s5L8JUA_mbbv1nAwDtYVPxCVIqZYunUErw/od6/public/values?alt=json');
})

.factory("Spicer", function ($firebase, Dictionary, $http) {
  var probRef = new Firebase('https://spicewords.firebaseio.com/probability');
  var probObjs = $firebase(probRef);

  var probWS = 0.5;

  probObjs.$on('value', function (wrapper) {
    probWS = parseInt(wrapper.snapshot.value['probWS']);
  });

  var dict = {};
  Dictionary.success(function (data) {
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
  });

  return function (message) {
    var words = message.split(' ');
    var spiceWords = words.map(function (word) {
      if (Math.random() >= probWS && dict[word]) {
        return dict[word][Math.floor(Math.random() * (dict[word].length-1))]
      } else {
        return word;
      }
    });
    return spiceWords.join(' ');
  };
})
