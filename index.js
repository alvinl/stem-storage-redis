
module.exports = function (stem) {

  var port  = stem.config.redisPort || 6379,
      pass  = stem.config.redisPass || null,
      host  = stem.config.redisHost || 'localhost',
      redis = require('redis').createClient(port, host, { auth_pass: pass });

  redis.get('stem:storage:' + stem.config.username, function (err, storageData) {

    if (err)
      return stem.log.error('Error fetching storage data from Redis.', err.message);

    // No storage data found
    else if (!storageData)
      return stem.storage.load({});

    // Parse and load storage data
    try {

      /**
       * Json parsed data from Redis
       * @type {Object}
       */
      var parsedStorageData = JSON.parse(storageData);

      stem.storage.load(parsedStorageData);

    } catch (err) {

      return stem.log.error('Failed to parse storage data from Redis.', err.message);

    }

    // Save changes to Redis
    stem.storage.on('change', function (data) {

      var encodedData;

      try {

        encodedData = JSON.stringify(data);

      } catch (err) {

        return stem.log.error('Error encoding data.', err.message);

      }

      redis.set('stem:storage:' + stem.config.username, encodedData, function (err) {

        if (err)
          return stem.log.error('Error saving storage data.', err.message);

      });

    });

  });

};
