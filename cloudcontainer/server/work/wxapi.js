const fs = require('fs')
const request = require('request')
const demo = null

function getToken () {
  if (demo != null) {
    return demo
  } else {
    return new Promise((resolve, reject) => {
      fs.readFile('/.tencentcloudbase/wx/cloudbase_access_token', 'utf8', (err, data) => {
        if (err) {
          resolve(false)
        }
        resolve(data)
      })
    })
  }
}

async function call (name, data) {
  const token = await getToken()
  console.log(token)
  if (token !== false) {
    var options = {
      method: 'POST',
      url: `https://api.weixin.qq.com/${name}?cloudbase_access_token=${token}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    console.log(options)
    return new Promise((resolve, reject) => {
      request(options, function (error, response) {
        if (error) {
          reject(error)
        }
        resolve(JSON.parse(response.body))
      })
    })
  } else {
    return {
      errcode: -110,
      errmsg: 'access_token is not exist!'
    }
  }
}

module.exports = {
  getToken,
  call
}
