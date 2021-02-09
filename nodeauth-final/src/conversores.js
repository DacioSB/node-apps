class Conversor {
  converter (data) {
    if (this.publicFields.indexOf('*') === -1) {
      data = this.filter(data)
    }
    if (this.contentType === 'json') {
      return this.toJson(data)
    }
  }

  toJson (data) {
    return JSON.stringify(data)
  }

  filter (data) {
    if (Array.isArray(data)) {
      data = data.map((post) => this.filterObject(post))
    } else {
      data = this.filterObject(data)
    }
    return data
  }

  filterObject (object) {
    const filteredObject = {}
    this.publicFields.forEach((field) => {
      if (Reflect.has(object, field)) {
        filteredObject[field] = object[field]
      }
    })
    return filteredObject
  }
}

class ConversorPost extends Conversor {
  constructor (contentType, extraFields = []) {
    super()
    this.contentType = contentType
    this.publicFields = ['titulo', 'conteudo'].concat(extraFields)
  }
}

class ConversorUsuario extends Conversor {
  constructor (contentType, extraFields = []) {
    super()
    this.contentType = contentType
    this.publicFields = ['nome'].concat(extraFields)
  }
}

module.exports = { ConversorPost, ConversorUsuario }
