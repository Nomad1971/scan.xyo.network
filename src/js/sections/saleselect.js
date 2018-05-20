/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Saturday, May 19, 2018 8:39 PM
 * @Email:  developer@xyfindables.com
 * @Filename: saleselect.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 8:57 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import $ from 'jquery'
import { Client } from 'xyo-client'

class SaleSelect {
  constructor () {
    this.client = new Client()
    this.section = $(`.section-saleselect`)
    this.section.find(`[name='sale_contract']`).change(() => { this.contractChanged() })
    this.refresh()
  }

  refresh () {
    this.section.find(`[name='token_address']`).val(this.client.config.tokenAddress)
    this.section.find(`[name='sale_address']`).val(this.client.config.exchangeAddress)

    this.client.getTokenBalance()
      .then((tokenBalance) => {
        console.log(`tokenBalance: ${tokenBalance}`)
        this.section.find(`[name='token_balance']`).val(tokenBalance.shiftedBy(-18).toString(10))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  contractChanged () {
    this.client.config.saleContractName = this.section.find(`[name='sale_contract']`).val()
    this.client.config.save()
    window.location.reload()
  }
}

$(document).ready(() => {
  const section = $(`.section-saleselect`)
  if (section && section.length > 0) {
    console.log(`section-saleselect`)
    window.sections = window.sections || {}
    window.sections.saleSelect = new SaleSelect()
  }
})
