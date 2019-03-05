'use strict'
require('babel-register')
const Wechat = require('./src/wechat.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const request = require('request')

let bot
/**
 * 尝试获取本地登录数据，免扫码
 * 这里演示从本地文件中获取数据
 */
try {
  bot = new Wechat(require('./sync-data.json'))
} catch (e) {
  bot = new Wechat()
}
/**
 * 启动机器人
 */
if (bot.PROP.uin) {
  // 存在登录数据时，可以随时调用restart进行重启
  bot.restart()
} else {
  bot.start()
}
/**
 * uuid事件，参数为uuid，根据uuid生成二维码
 */
bot.on('uuid', uuid => {
  qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
    small: true
  })
  console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid)
})
/**
 * 登录用户头像事件，手机扫描后可以得到登录用户头像的Data URL
 */
bot.on('user-avatar', avatar => {
  console.log('登录用户头像Data URL：', avatar)
})
/**
 * 登录成功事件
 */
bot.on('login', () => {
  console.log('登录成功')
  // 保存数据，将数据序列化之后保存到任意位置
  fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData))
})
/**
 * 登出成功事件
 */
bot.on('logout', () => {
  console.log('登出成功')
  // 清除数据
  fs.unlinkSync('./sync-data.json')
})
/**
 * 联系人更新事件，参数为被更新的联系人列表
 */
// bot.on('contacts-updated', contacts => {
//   console.log(contacts)
//   console.log('联系人数量：', Object.keys(bot.contacts).length)
// })
/**
 * 错误事件，参数一般为Error对象
 */
bot.on('error', err => {
  console.error('错误：', err)
})


/**
 * 如何处理会话消息
 */
bot.on('message', msg => {
	console.log(msg)
})

var shuchong='@95ad044a752f652d6aacdded0254c458468e71ce05c54dd9738ff9c483cc023b';
var tianguang = '@95ad044a752f652d6aacdded0254c458468e71ce05c54dd9738ff9c483cc023b';
var config = {};
bot.on('message', msg => {
	//识别命令
	if(msg.FromUserName==tianguang || msg.Content.startsWith(tianguang)){
		if(msg.Content.endsWith('自动转发')){
			if(msg.FromUserName!=)
		}else if(msg.Content.endsWith('此群直播')){

		}
	}
})