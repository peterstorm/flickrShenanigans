const { task } = require('folktale/concurrency/task')
const request = require('request')
const { compose, map, prop } = require('ramda')

const requestUrl = function(url) {
  return task(resolver => {
      request(url, (err, res, body) => {
            err ? resolver.reject(err) : resolver.resolve(body);
          })
   })
}

const call = requestUrl('https://api.flickr.com/services/feeds/photos_public.gne/?tags=cats&format=json&jsoncallback=?')

const url = 'https://api.flickr.com/services/feeds/photos_public.gne/?tags=cats&format=json&jsoncallback=?'
//call.run().listen({
//  onCancelled: () => { console.log('the task was cancelled') },
//    onRejected: (error) => { console.log('something went wrong') },
//    onResolved: (value) => { console.log(`The value is ${value}`) }
//});

const result = requestUrl(url).map(prop('items'))

result.run().listen({
  onResolved: x => console.log(x)
})
