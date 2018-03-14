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
    to: '382981949805035521',
    message: `An hour has passed and the bot still works, ${clock.checkDate()}`
  })
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