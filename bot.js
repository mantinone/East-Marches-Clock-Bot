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

setInterval( () => {
  bot.sendMessage({
    to: '427869441741684748',
    message: clock.printDate()
  })
  if( clock.checkCrafting()){
    bot.sendMessage({
      to: '423358604444172289',
      message: 'Hello @everyone!  A new crafting week has begun!'
    })
  }
},  1000*60*30)

bot.on('message', function (user, userID, channelID, message, evt) {
  if (message.substring(0,1) == '!'){
    var args = message.substring(1).split(' ')
    var cmd = args[0]
    var bonus = args[1]

    args = args.splice(1)
    switch(cmd) {
      case "time":
      case "date":
        bot.sendMessage({
          to: channelID,
          message: clock.printDate()
        })
        break
      case "mona":
        bot.deleteMessage({
          channelID: channelID,
          messageID: evt.d.id
        }, function (err) {
          console.log(err)
        })
        bot.sendMessage({
          to: '424793864088453130',
          message: `!roll 1d20 + ${bonus||0} Rolling Insight for <@${userID}> because <@225782923490492417> did or said something.`
        })
        break
      // case "test":
      //   bot.sendMessage({
      //     to: '423358604444172289',
      //     message: "How do I do this?  @everyone"
      //   })
      //   break
    }
  }
})