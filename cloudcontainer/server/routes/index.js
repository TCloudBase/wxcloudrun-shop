const express = require('express')
const main = require('../work/main')
const router = express.Router()

router.get('/', async function (req, res, next) {
  res.json({
    headers: req.headers,
    body: req.body,
    param: req.query
  })
})

router.post('/post', async function (req, res, next) {
  res.json({
    headers: req.headers,
    raw: req.rawHeaders,
    body: req.body,
    param: req.query
  })
})

router.post('/addShopcart', async function (req, res, next) {
  main.addShopcart(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/delShopcart', async function (req, res, next) {
  main.delShopcart(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/doneShopcart', async function (req, res, next) {
  main.doneShopcart(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/getGooddetail', async function (req, res, next) {
  main.getGooddetail(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/getGoodlist', async function (req, res, next) {
  main.getGoodlist(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/getShopcart', async function (req, res, next) {
  main.getShopcart(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/payShopcart', async function (req, res, next) {
  main.payShopcart(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

router.post('/submitShopcart', async function (req, res, next) {
  main.submitShopcart(req.body, req.headers).then(result => {
    res.send(result)
  }).catch(e => {
    res.send(e)
  })
})

module.exports = router
