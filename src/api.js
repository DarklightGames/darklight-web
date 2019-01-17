class Api {
  constructor(host) {
    this.host = host
  }

  get(path, params = null) {
    var url = new URL(this.host + '/' + path)
    if (params) {
      if ((params instanceof Object) === false) {
        throw 'Invalid type (' + typeof(params) + ') for parameters'
      }
      for (let key in params) {
        let value = params[key]
        if (typeof(value) === 'string' || typeof(value) === 'number') {
          url.searchParams.append(key, params[key])
        } else if (value instanceof Array) {
          value.forEach(x => url.searchParams.append(key + '[]', x))
        } else {
          throw 'Invalid type (' + typeof(value) + ') for parameter "' + key + '"'
        }
      }
    }
    console.log(url)
    return fetch(url, {
      mode: 'cors'
    })
  }
}

let host = 'http://46.101.44.19'  // TODO: gate this based on dev vs. prod
let api = new Api(host)

export default api;