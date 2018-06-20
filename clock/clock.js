const moment = require('moment-timezone')

const emMonths = {
  'January': 'Frostmoot' ,
  'February': 'Deepsnow' ,
  'March': 'Winterwane' ,
  'April': 'Rainmoot' ,
  'May': 'Palesun' ,
  'June': 'Highsun' ,
  'July': 'Firemoot' ,
  'August': 'Firewane' ,
  'September': 'Lowsun' ,
  'October': 'Redfall' ,
  'November': 'Snowmoot' ,
  'December': 'Fellnight' ,
}

const checkDate = () => {
  let day = moment.tz('UTC')
  return day.format('MMMM Do, HH:mm')
}

const checkCrafting = () => {
  let nowMoment = moment.tz('UTC')
  let day = nowMoment.format('ddd')
  let hour = nowMoment.format('HH')
  let minute = nowMoment.format('mm')

  return (day == 'Sun') && (hour == '23') && (minute > 29 )
}

const testCrafting = () => {
  let nowMoment = moment.tz('UTC')
  let day = nowMoment.format('ddd')
  let hour = nowMoment.format('HH')
  let minute = nowMoment.format('mm')

  let results = { craftTime: (day == 'Sun') && (minute > 29 ), minute: minute}
  return results
}

const printDate = ( section ) => {
  let theDate = currentGameTime()
  let firstHalf = theDate.format('Y: ddd,')
  let month = emMonths[theDate.format('MMMM')]
  let lastHalf = theDate.format('Do, HH:mm (h:mm A)')
  return `${firstHalf} ${month} ${lastHalf}`
}

const currentGameTime = () => {
  let theDate = moment.tz("2018-02-09T00:00:00", 'UTC')
  let difference = moment.tz('UTC').diff(theDate)
  theDate.add(difference*2, 'ms')
  theDate.subtract(131, 'days')
  theDate.subtract(1777, 'Years')
  return theDate
}

module.exports = {printDate, checkDate, checkCrafting, testCrafting }