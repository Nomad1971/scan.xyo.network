/**
 * @Author: XY | The Findables Company <arietrouw>
 * @Date:   Thursday, May 17, 2018 6:22 PM
 * @Email:  developer@xyfindables.com
 * @Filename: _transfer.js
 * @Last modified by:   arietrouw
 * @Last modified time: Saturday, May 19, 2018 8:44 PM
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import $ from 'jquery'
import { Client } from 'xyo-client'

class NetworkSelect {
  constructor () {
    this.client = new Client()
    this.client.detectWallets()
    this.section = $(`.section-networkselect`)
    this.refresh()
  }

  refresh () {
    console.log(`refresh`)
    const dappNetworkSelect = this.section.find(`[name='dapp_network']`)

    Object.keys(this.client.wallets).forEach((key, item) => {
      console.log(`adding`)
      dappNetworkSelect.append($(`<option>`, {
        value: item.name,
        text: item.address
      }))
    })

    this.client.getDAppBalance()
      .then((dappBalance) => {
        console.log(`dappBalance: ${dappBalance}`)
        this.client.getTokenBalance()
          .then((tokenBalance) => {
            console.log(`tokenBalance: ${tokenBalance}`)
            this.section.find(`[name='dapp_network']`).val(this.client.getDAppNetworkName())
            this.section.find(`[name='dapp_balance']`).val(dappBalance.shiftedBy(-18).toString(10))
            this.section.find(`[name='xyo_network']`).val(this.client.getXyoNetworkName())
            this.section.find(`[name='xyo_balance']`).val(tokenBalance.shiftedBy(-18).toString(10))
          })
          .catch((error) => {
            console.error(error)
          })
      })
      .catch((error) => {
        console.error(error)
      })
  }

  static displayMetaMaskInfo () {
    $(`.install-meta-mask`).fadeTo(1000, 1)
    $(`.meta-mask-information`).fadeTo(300, 0.5)
    $(`.meta-mask-information`).attr(`disabled`, `disabled`)
  }
}

$(document).ready(() => {
  const section = $(`.section-networkselect`)
  if (section && section.length > 0) {
    console.log(`section-networkselect`)
    window.sections = window.sections || {}
    window.sections.networkSelect = new NetworkSelect()
  }
})

export default NetworkSelect
