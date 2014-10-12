
module.exports = function (Stem) {

  var port  = Stem.config.redisPort || 6379,
      host  = Stem.config.redisHost || 'localhost',
      redis = require('redis').createClient(port, host);

  // Wait until Redis is ready to start taking commands
  redis.on('ready', function () {

    // Fetch previous storage
    redis.get('stem:' + Stem.config.username, function (err, data) {

      if (err)
        return Stem.log.error('Error fetching storage data from Redis:', err.message);

      var parsedData;

      try {

        parsedData = JSON.parse(data);

      } catch (err) {

        return Stem.log.error('Failed to parse data.', err.message);

      }

      // If previous storage was found, parse it and initialize it
      if (data)
        Stem.storage.load(parsedData);

    });

    // Save new data to redis
    Stem.storage.on('change', function (data) {

      var encodedData;

      try {

        encodedData = JSON.stringify(data);

      } catch (err) {

        return Stem.log.error('Error encoding data.', err.message);

      }

      redis.set('stem:' + Stem.config.username, encodedData, function (err) {

        if (err)
          return Stem.log.error('Error saving storage data:', err.message);

      });

    });

  });

};
