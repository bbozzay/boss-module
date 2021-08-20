import { Storage } from './storage'

export class Cart extends Storage {
  constructor (ctx) {
    super(ctx)
    // console.log("Cart", this)
  }

  set basket (items) {
    return this.addToStorage('cart_basket', items)
  }

  get basket () {
    return this.getFromStorage('cart_basket')
  }

  clear (cb) {
    return this.removeFromStorage('cart_basket', cb)
  }

  add (item, cb) {
    if (this.debug) {
      console.log('Add to cart', item)
    }
    cb = cb ? cb.bind(null, item) : null
    return this.addToStorage('cart_basket', !this.basket ? [item] : [...this.basket, item], cb)
  }

  addMultiple (items, cb) {
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        this.add(items[i], cb)
      }
    }
  }
}
