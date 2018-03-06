const Task = require('data.task')
const Either = require('data.either')
const request = require('request')
const { compose, curry, path, pipe, map, prop } = require('ramda')

// HELPER FUNCTIONS

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

// getJSON ::
const getJSON = url =>
  httpGet(url)
    .map(parse)
    .chain(eitherToTask)

const url = 'https://api.flickr.com/services/feeds/photos_public.gne/?tags=aww&format=json&nojsoncallback=1'



const extractPhotos = compose(map(prop('m')), map(prop('media')) ,prop('items'))

const photos  = compose(map(extractPhotos) ,getJSON)

const img = x => {
  let el = document.createElement('img');
  el.setAttribute('src', x);
  return el;
}

const makeImgs = compose(map(map(img)), photos)

const getElement = x => document.getElementById(x)

const setHtml = x => getElement('js-main').append(x)


makeImgs(url).fork(console.err, map(setHtml) )



