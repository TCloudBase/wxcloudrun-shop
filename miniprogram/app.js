const templateId = '' // 填写订阅消息模版ID
const werunEnvid = '' // 填写微信云托管环境ID
const werunServer = '' // 填写微信云托管服务名称
App({
  tid:templateId,
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
      this.calls()
    }
  },
  async calls(obj={}){
    wx.cloud.callContainer({
      path:`/${obj.name||''}`,
      method:obj.name!=null?'POST':'GET',
      data: obj.data,
      header: {
        'X-WX-SERVICE': werunServer
			},
      config:{
        env: werunEnvid
      }
    }).then(res=>{
      console.log(res)
      if(res.statusCode == 200){
        if(typeof obj.success == 'function'){
          obj.success({
            result:res.data
          })
        }
      } else {
        if(typeof obj.fail == 'function'){
          obj.fail(res)
        }
        wx.showModal({
          title:'请求失败',
          content:'服务暂时不可用，请重新尝试！',
          showCancel:false
        })
      }
    }).catch(e=>{
      console.log(e)
    })
  },
  /**
   * 获取商品列表
   * @param {*} obj
   */
  getGoodSList: function (obj) {
    this.calls({
      name: 'getGoodlist',
      success: function (res) {
        if (obj != null && obj.success != null) {
          obj.success(res.result)
        }
      }
    })
  },
  /**
   * 获取商品详情
   * @param {*} obj
   */
  getGoodSDetail: function (obj) {
    this.calls({
      name: 'getGooddetail',
      data: {
        id: obj.id
      },
      success: function (res) {
        if (obj != null && obj.success != null) {
          obj.success(res.result)
        }
      }
    })
  },
  /**
   * 添加商品到购物车
   * @param {*} obj
   */
  addShopCart: function (obj) {
    const data = obj.data
    this.calls({
      name: 'addShopcart',
      data: { data },
      success (res) {
        if (obj.cart == false) {
          wx.setStorageSync('ids', [res.result])
        }
        obj.success()
      }
    })
  },
  /**
   * 获取购物车列表
   * @param {*} obj
   */
  getShopCart: function (obj) {
    this.calls({
      name: 'getShopcart',
      data: {
        cart: obj.cart,
        done: obj.done
      },
      success (res) {
        if (obj != null && obj.success != null) {
          obj.success(res.result)
        }
      }
    })
  },
  /**
   * 删除购物车内容（强更新）
   * @param {*} obj
   */
  delShopCart: function (obj) {
    this.calls({
      name: 'delShopcart',
      data: {
        ids: obj.ids
      },
      success (res) {
        if (obj != null && obj.success != null) {
          obj.success()
        }
      }
    })
  },
  /**
   * 为商品付款（模拟支付逻辑）
   * @param {*} obj
   */
  toPayTap: function (obj) {
    this.calls({
      name: 'payShopcart',
      data: {
        ids: obj.ids
      },
      success (res) {
        if (obj != null && obj.success != null) {
          obj.success()
        }
      }
    })
  },
  /**
   * 订单完成（收货成功）
   * @param {+} obj
   */
  toDoneOrder: function (obj) {
    this.calls({
      name: 'doneShopcart',
      data: {
        ids: obj.ids
      },
      success (res) {
        if (obj != null && obj.success != null) {
          obj.success()
        }
      }
    })
  },
  /**
   * 获得结算订单列表
   * @param {*} obj
   */
  getBillList: function (obj) {
    this.calls({
      name: 'getShopcart',
      data: {
        ids: obj.ids
      },
      success (res) {
        if (obj != null && obj.success != null) {
          obj.success(res.result)
        }
      }
    })
  },
  /**
   * 提交结算订单到付款状态
   * @param {*} obj
   */
  submitorder: function (obj) {
    this.calls({
      name: 'submitShopcart',
      data: {
        ids: obj.ids,
        deliveryType: obj.deliveryType,
        remark: obj.remark,
        addressData: obj.addressData
      },
      success (res) {
        if (obj != null && obj.success != null) {
          obj.success()
        }
      }
    })
  }
})
