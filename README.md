# Redis storage
This plugin extends Stem's storage to persist it into Redis. Storage data is saved as a key in the format of `stem:$botUsername`

## Installation
1. `$ npm install git://github.com:alvinl/stem-storage-redis.git`
2. Add `stem-storage-redis` to the `plugins` array in your config

## Config
The following are the variables this plugin uses, change them as needed in your config file.

- `redisHost` - Redis host to connect to (defaults to `localhost`)
- `redisPort` - Redis port to connect to (defaults to default Redis port)
