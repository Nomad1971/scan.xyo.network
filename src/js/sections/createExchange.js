/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Thursday, May 17, 2018 6:22 PM
 * @Email:  developer@xyfindables.com
 * @Filename: _transfer.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 10:15 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import $ from 'jquery'
import { Client } from 'xyo-client'

class CreateExchange {
  constructor () {
    this.client = new Client()
    this.client.detectWallets()
    this.section = $(`.section-create-exchange`)
    this.section.find(`.create`).click(() => this.create())
    this.refresh()
  }

  refresh () {
    this.section.find(`[name='benefactor_address']`).val(this.client.getDAppAddress())
    this.section.find(`[name='token_address']`).val(this.client.config.tokenAddress)
  }

  create () {
    const tokenAddress = this.section.find(`[name='token_address']`).val()
    const benefactorAddress = this.section.find(`[name='benefactor_address']`).val()

    this.client.createExchangeContract(null, tokenAddress, benefactorAddress)
      .then((contract) => {

      })
      .catch((error) => {
        console.error(error)
      })
  }
}

$(document).ready(() => {
  const section = $(`.section-create-exchange`)
  if (section && section.length > 0) {
    console.log(`section-create-exchange`)
    window.sections = window.sections || {}
    window.sections.transfer = new CreateExchange()
  }
})

export default CreateExchange
