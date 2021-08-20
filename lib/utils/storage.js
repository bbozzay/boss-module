export class Storage {
  constructor ({ $auth }) {
    this.$auth = $auth
  }

  addToStorage (key, val, cb) {
    try {

      const st = this.$auth.$storage.setUniversal(key, val)
      if (cb) {
        cb(val)
      }
      // console.log("st", st)
      return st
    } catch(err) {
      console.log("addToStorage", err)
    }
  }

  getFromStorage (key) {
    return this.$auth.$storage.getUniversal(key)
  }

  removeFromStorage (key, cb) {
    const st = this.$auth.$storage.removeUniversal(key)
    if (cb) {
      cb(key)
    }
    return st
  }
}
