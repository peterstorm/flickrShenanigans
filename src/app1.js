const { result, concurrency: { task } } = require('folktale')
const request = require('request')
const { compose, map, prop } = require('ramda')
const url = 'https://api.flickr.com/services/feeds/photos_public.gne/?tags=aww&format=json&nojsoncallback=1'

const safeParse = json => result.try(_ => JSON.parse(json))

const resultToTask = result => {
  return result.matchWith({
    Ok: ({ value }) => task.of(value),
    Error: ({ value }) => task.rejected(value)
  })
}

const getUrl = task.fromNodeback(request)

const responseBody = response => response.body

const flickrItems =
  getUrl(url)
    .map(responseBody)
    .chain(x => resultToTask(safeParse(x)))

const results = compose(map(prop('items')), flickrItems)

results.run().listen({
  onResolved: x => console.log(x)
})
// extractPhotos :: JSON -> [Photos]
//const extractPhotos = compose(map(prop('m')), map(prop('media')) ,prop('items'))

// photos :: JSON -> [Photos]
//const photos = compose(map(extractPhotos), flickrItems)
//
//// img :: Url -> IMG tag
//const img = x => {
//  let el = document.createElement('img');
//  el.setAttribute('src', x);
//  return el;
//}
//
//// makeImgs :: [Photos] -> [imgs]
//const makeImgs = compose(map(map(img)), photos)
//
//const getElement = x => document.getElementById(x)
//
//// setHtml :: [Photos] -> _
//const setHtml = x => getElement('js-main').append(x)
//
//// [Photos] -> DOM
//makeImgs(url).run().listen({
//  onCancelled: _ => console.log('task was cancelled',
//  onRejected: error => console.log(error),
//  onResolved: x => map(setHtml,x),
//})



