const Task = require('data.task')
const Either = require('data.either')
const request = require('request')
const { compose, curry, path, pipe, map, prop } = require('ramda')

// HELPER FUNCTIONS
const url = 'https://api.flickr.com/services/feeds/photos_public.gne/?tags=aww&format=json&nojsoncallback=1'

const trace = x => { console.log(x); return x }

// httpGet :: Url -> Task Error JSON
const httpGet = url =>
  new Task((rej, res) =>
    request(url, (error, response, body) =>
      error ? rej(error) : res(body)))

// parse :: String -> Either Left Right(JSON)
const parse = Either.try(JSON.parse)

// eitherToTask :: Either a b -> Task e r
const eitherToTask = e =>
  e.fold(Task.rejected, Task.of)

// getJSON :: Url = Task Error JSON
const getJSON = url =>
  httpGet(url)
    .map(parse)
    .chain(eitherToTask)

// APP

// extractPhotos :: JSON -> [Photos]
const extractPhotos = compose(map(prop('m')), map(prop('media')) ,prop('items'))

// photos :: JSON -> [Photos]
const photos  = compose(map(extractPhotos) ,getJSON)

// img :: Url -> IMG tag
const img = x => {
  let el = document.createElement('img');
  el.setAttribute('src', x);
  return el;
}

// makeImgs :: [Photos] -> [imgs]
const makeImgs = compose(map(map(img)), photos)

const getElement = x => document.getElementById(x)

// setHtml :: [Photos] -> _
const setHtml = x => getElement('js-main').append(x)

// [Photos] -> DOM
makeImgs(url).fork(console.err, map(setHtml) )



