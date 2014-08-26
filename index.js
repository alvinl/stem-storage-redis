
module.exports = function (Stem) {

  var port  = Stem.config.redisPort || 6379,
      host  = Stem.config.redisHost || 'localhost',
      redis = require('redis').createClient(port, host);

  redis.on('ready', function () {

    redis.get('stem:' + Stem.config.username, function (err, data) {

      if (err)
        return Stem.log.error('Error fetching storage data from Redis:', err.message);

      if (data)
        Stem.storage._data = JSON.parse(data);

    });

    Stem.on('save', function (data) {

      redis.set('stem:' + Stem.config.username, JSON.stringify(data), function (err) {

        if (err)
          return Stem.log.error('Error saving storage data:', err.message);

      });

    });

  });

};
