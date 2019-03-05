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
  console.log(bot.user);
})

var adminpwd='ff9c483cc023b';
var config = {};
var adminUUID = '';
var forwardGroup = new Set();
var forwardFrom = '';
var forwardTo = '';

forwardFrom = bot.user.UserName;

bot.on('message', msg => {
	//识别命令
  if(msg.FromUserName == adminUUID || msg.Content.startsWith(adminUUID) || msg.FromUserName == bot.user.UserName){//是管理员
    if(msg.Content.endsWith('设置转播')){
      forwardGroup.add(msg.FromUserName);
      bot.sendMsg('已成功设置在此转播', msg.ToUserName)
      .catch(err => {
        bot.emit('error', err)
      })
    }else if(msg.Content.endsWith('设置主播')){
      forwardGroup.delete(msg.FromUserName);
      forwardGroup.delete(msg.ToUserName);
      forwardTo=msg.ToUserName;
      bot.sendMsg('已成功设置在此主播', msg.ToUserName)
      .catch(err => {
        bot.emit('error', err)
      })
    }
  }else if(msg.ToUserName=bot.user.UserName && msg.Content.endsWith('我是管理员'+adminpwd)){
		adminUUID=msg.FromUserName;
		bot.sendMsg('您的账户成功获得管理员权限', msg.FromUserName)
    .catch(err => {
      bot.emit('error', err)
    })
	}
  ////些为转发消息
  if(msg.FromUserName == forwardFrom && forwardTo == msg.ToUserName){
    console.log("准备转播");
    console.log(forwardGroup)
    for (let i of forwardGroup) {
      bot.forwardMsg(msg, i)
      .catch(err => {
        bot.emit('error', err)
      })
    }
  }
})