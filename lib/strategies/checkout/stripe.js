import { Checkout } from './base'
import * as utils from '../../utils'

export class Stripe extends Checkout {
  constructor (context, config, customer_id) {
    super(context, config)
    this.customer_id = config.customer_id
  }

  async init () {
  }

  getSubscriptionMeta(subscription) {
    return subscription.metadata
  }

  async checkInvoicesForProduct (invoices, price, product) {
    if (!invoices || !price || !product) throw "Missing Required Arg"
    if (invoices && invoices.data) {
      loop1:
      for (let i = 0; i < invoices.data.length; i++) {
        console.log('i', i)
        if (invoices.data[i].lines.data) {
          console.log('LINES', invoices.data[i].lines.data)
          loop2:
          for (let l = 0; l < invoices.data[i].lines.data.length; l++) {
            console.log('l', l)
            const line = invoices.data[i].lines.data[l]
            console.log('lin', line)
            if (line.price.id == price && product == line.price.product) {
              console.log('i', i, 'l', l)
              console.log('BREAK')
              return product
            }
          }
        }
      }
    }
  }

  async addCard (cardToken) {
    const card = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_create_card`, this.token, {
      customer_id: this.customer_id,
      token: cardToken.token.id
    })
    return card
  }

  async customersRetrieve (id) {
    if (!id) {
      id = this.customer_id
    }
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_customers_retrieve`, this.token, { id })
    return response
  }

  async createCustomer () {
    const customerID = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_customers_create`, this.token, {
      email: this.email,
      metadata: {
        signup_url: this.route.path,
        role_id: []
      }
    }
    )
    return Promise.resolve(customerID)
  }

  async createPaymentIntent (meta) {
    const paymentIntent = await utils.Lambda.lambdaPost(`${this.apiUrl}purchase`, this.token, {
      email: meta.email,
      name: meta.name,
      customer_id: meta.customer_id,
      plan_index: meta.plan_index,
      amount: meta.amount
    })
    return Promise.resolve(paymentIntent)
  }

  // Must have an attached card on file
  async createSubscription (product) {
    const subIntent = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_subscriptions_create`, this.token, {
      customer_id: this.customer_id,
      ...product
      // plan_index: meta.plan_index,
      // amount: meta.amount
    })
    return Promise.resolve(subIntent)
  }

  async pricesList (params) {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_prices_list`, null, params)
    return response
  }

  async pricesRetrieve (id) {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_prices_retrieve`, null, { id })
    return response
  }

  async productsRetrieve (id) {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_products_retrieve`, null, { id })
    return response
  }

  async productsList (params) {
    const response = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_products_list`, this.token, params)
    return response
  }

  async subscriptionsList () {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_subscriptions_list`, this.token, {
      customer_id: this.customer_id
      // status: meta.status
    })
    return response
  }

  async paymentIntentsList () {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_paymentintents_list`, this.token, {
      customer_id: this.customer_id
      // status: meta.status
    })
    return response
  }

  async invoicesList () {
    const response = await utils.Lambda.lambdaGet(`${this.apiUrl}stripe_invoices_list`, this.token, {
      customer_id: this.customer_id
      // status: meta.status
    })
    return response
  }

  async getSubscription (meta) {
    const subscriptions = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_subscriptions_list`, this.token, {
      customer_id: this.customer_id,
      plan_index: meta.plan_index,
      status: meta.status
    })
    return Promise.resolve(subscriptions)
  }

  async checkoutSessionsCreate ({ line_items, success_path }) {
    const items = []
    let mode = 'payment'
    line_items.forEach((item) => {
      if (item.type == 'recurring') {
        mode = 'subscription'
      }
      items.push({
        price: item.id,
        quantity: item.quantity || 1
      })
    })
    console.log('items', items)
    const portal = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_checkout_sessions_create`, this.token, {
      customer_id: this.customer_id,
      success_url: this.baseUrl + success_path,
      cancel_url: this.baseUrl,
      line_items: items,
      customer_id: this.customer_id,
      customer_email: this.email,
      mode
    })
    return Promise.resolve(portal)
  }

  async invoicesCreate(meta) {
    const invoice = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_invoices_create`, this.token, {
      customer_id: this.customer_id,
      price: meta.price
    })
    return Promise.resolve(invoice)
  }

  async createCustomerPortalSession (meta) {
    const portal = await utils.Lambda.lambdaPost(`${this.apiUrl}stripe_billingportal_sessions_create`, this.token, {
      customer_id: this.customer_id,
      return_url: this.baseUrl + this.path
    })
    return Promise.resolve(portal)
  }
}
