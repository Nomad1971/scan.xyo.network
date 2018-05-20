/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Thursday, May 17, 2018 6:22 PM
 * @Email:  developer@xyfindables.com
 * @Filename: _transfer.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 3:30 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import $ from 'jquery'
import { Client } from 'xyo-client'

class Transfer {
  constructor () {
    this.client = new Client()
    this.client.detectWallets()
    this.section = $(`.section-transfer`)
    this.section.find(`.transfer`).click(() => this.transfer())
    this.refresh()
  }

  refresh () {
    this.section.find(`[name='from_wallet']`).val(this.client.getDAppAddress())
  }

  transfer () {
    const section = $(`.section-transfer`)
    const address = section.find(`[name='address']`).val()
    const amount = this.client.toBigInt(section.find(`[name='amount']`).val())
    console.log(`BN:${amount}`)
    const token = this.client.getToken()
    token.transfer(address, amount, { gasPrice: 10000000000 }, (_error, _result) => {
      if (_error) {
        console.log(`Error: ${_error}`)
      } else {
        console.log(`Success: ${_result}`)
      }
    })
  }
}

$(document).ready(() => {
  const section = $(`.section-transfer`)
  if (section && section.length > 0) {
    console.log(`section-transfer`)
    window.sections = window.sections || {}
    window.sections.transfer = new Transfer()
  }
})

export default Transfer
