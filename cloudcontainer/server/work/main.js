const cloud = require('wx-server-sdk')
const key = require('./key.json')
const wxapi = require('./wxapi')
var db = null
var _ = null

const initTCB = (env) => {
  cloud.init({
    env: key.envId,
    secretId: key.secretId,
    secretKey: key.secretKey
  })
  db = cloud.database()
  _ = db.command
}

const addShopcart = async (event, context) => {
  initTCB(context['x-wx-env'])
  const data = event.data
  data.openid = context['x-wx-openid']
  data.type = 0
  const good = (await db.collection('goods').where({
    _id: data.commodityId
  }).field({
    title: true,
    price: true,
    imgs: true
  }).get()).data
  if (good.length !== 0) {
    data.title = good[0].title
    data.price = good[0].price
    data.img = good[0].imgs[0]
    const res = await db.collection('order').add({
      data: data
    })
    return res._id
  } else {
    return null
  }
}

const delShopcart = async (event, context) => {
  initTCB(context['x-wx-env'])
  return await db.collection('order').where({
    _id: _.in(event.ids),
    openid: context['x-wx-openid']
  }).remove()
}

const doneShopcart = async (event, context) => {
  initTCB(context['x-wx-env'])
  return await db.collection('order').where({
    _id: _.in(event.ids),
    openid: context['x-wx-openid']
  }).update({
    data: {
      type: 3
    }
  })
}

const getGooddetail = async (event, context) => {
  initTCB(context['x-wx-env'])
  const good = (await db.collection('goods').where({
    _id: event.id
  }).get()).data
  if (good.length !== 0) {
    return good[0]
  }
  return null
}

const getGoodlist = async (event, context) => {
  initTCB(context['x-wx-env'])
  const list = (await db.collection('goods').field({
    title: true,
    price: true,
    origin: true,
    imgs: true
  }).get()).data
  return list
}

const getShopcart = async (event, context) => {
  initTCB(context['x-wx-env'])
  const query = {
    openid: context['x-wx-openid']
  }
  if (event.ids != null) {
    query._id = _.in(event.ids)
  } else {
    if (event.cart === false) {
      if (event.done === 0) {
        query.type = _.in([1, 2])
      } else {
        query.type = 3
      }
    } else {
      query.type = 0
    }
  }
  return (await db.collection('order').where(query).get()).data
}

const payShopcart = async (event, context) => {
  initTCB(context['x-wx-env'])
  const res = await db.collection('order').where({
    _id: _.in(event.ids),
    openid: context['x-wx-openid']
  }).update({
    data: {
      type: 2
    }
  })
  try {
    const send = await wxapi.call('cgi-bin/message/subscribe/send',{
      touser: context['x-wx-openid'],
      page: 'pages/order/order',
      lang: 'zh_CN',
      data: {
        number1: {
          value: '887218237238' // 自定义，在这里是固定的
        },
        phrase12: {
          value: '待收货' // 自定义，在这里是固定的
        },
        thing15: {
          value: '你订购的商品已发货，请耐心等待收取～' // 自定义，在这里是固定的
        }
      },
      template_id: key.templateId,
      miniprogram_state: 'developer'
    })
    console.log(send)
  } catch (err) {
    console.log(err)
  }
  return res
}

const submitShopcart = async (event, context) => {
  initTCB(context['x-wx-env'])
  return await db.collection('order').where({
    _id: _.in(event.ids),
    openid: context['x-wx-openid']
  }).update({
    data: {
      type: 1,
      deliveryType: event.deliveryType,
      remark: event.remark,
      addressData: (event.deliveryType === 'fast') ? event.addressData : null
    }
  })
}

module.exports = {
  addShopcart,
  delShopcart,
  doneShopcart,
  getGooddetail,
  getGoodlist,
  getShopcart,
  payShopcart,
  submitShopcart
}
