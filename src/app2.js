const { create, env } = require('sanctuary')
const { env: flutureEnv } = require('fluture-sanctuary-types')
const Future = require('fluture')
const S = create({ checkTypes: true, env: env.concat(flutureEnv)})

const { maybeToEither, at, is, get, compose, add } = S;

const addresses = [
  { street: 'Sandby', number: 3 },
  { street: 'Daldslandgade' }
]

const safeGetAddress = index => compose(maybeToEither('No address'), at(index))

const safeGetStreet = compose(maybeToEither('No street'), get(is(String), 'street'))

const result = safeGetAddress(0)(addresses).map(add(1))

console.log(result)
