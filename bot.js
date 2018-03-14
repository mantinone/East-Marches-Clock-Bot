var Discord = require('discord.io')
var logger = require('winston')
var clock = require('./clock/clock.js')
require('dotenv').config()

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
  colorize: true
})
logger.level = 'debug'

var bot = new Discord.Client({
  token: process.env.TOKEN,
  autorun: true
})

bot.on('ready', function (evt) {
  logger.info('Connected')
  logger.info('Logged in as: ')
  logger.info(bot.username + ' - (' + bot.id + ')')
})

setInterval(function() {
  bot.sendMessage({
    to: '418499444858683394',
    message: `This is a full-day interval, ${clock.checkDate()}`
  })
}, 25*60*60*1000)

setInterval(function() {
  if( clock.checkNewDay() ){
    bot.sendMessage({
      to: '418499444858683394',
      message: `Hourly interval check has worked, ${clock.checkDate()}`
    })
  }
}, 60*60*1000)

bot.on('message', function (user, userID, channelID, message, evt) {
  if (message.substring(0,1) == '!'){
    var args = message.substring(1).split(' ')
    var cmd = args[0]

    args = args.splice(1)
    switch(cmd) {
      case "time":
      case "date":
        bot.sendMessage({
          to: channelID,
          message: clock.printDate()
        })
        break
    }
  }
})