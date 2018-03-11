const { create, env } = require('sanctuary')
const { env: flutureEnv } = require('fluture-sanctuary-types')
const Future = require('fluture')
const S = create({ checkTypes: true, env: env.concat(flutureEnv)})
const request = require('request')
const { compose, map } = require('ramda')
const url = 'https://api.flickr.com/services/feeds/photos_public.gne/?tags=aww&format=json&nojsoncallback=1'

const eitherToFuture = S.either(Future.reject, Future.of)

const safeParse = S.encaseEither(S.I, JSON.parse)

const getJSON = url =>
  Future((rej, res) =>
    void request(url, (error, response, body) =>
      error ? rej(error) : res(body)
))

const parsedJSON = url =>
  getJSON(url)
    .map(safeParse)
    .chain(eitherToFuture)

const extractPhotos = S.pipe([S.prop('items'), S.map(S.prop('media')), S.map(S.prop('m'))])

const getPhotos = S.pipe([parsedJSON, S.map(extractPhotos)])

// img :: Url -> IMG tag
const img = x => {
  let el = document.createElement('img');
  el.setAttribute('src', x);
  return el;
}

// makeImgs :: [Photos] -> [imgs]
const makeImgs = compose(map(map(img)), getPhotos)

const getElement = x => document.getElementById(x)

// setHtml :: [Photos] -> _
const setHtml = x => getElement('js-main').append(x)

// [Photos] -> DOM
makeImgs(url).fork(console.error, map(setHtml) )




