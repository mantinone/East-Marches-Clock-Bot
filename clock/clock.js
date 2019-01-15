const moment = require('moment-timezone')
const OFFSET_DAYS = 94
const ORIGINAL_OFFSET = 131

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

const checkAlerts = () => {
  let nowMoment = moment.tz('UTC')
  let day = nowMoment.format('ddd')
  let hour = nowMoment.format('HH')
  let hour12 = nowMoment.format('hh')
  let minute = nowMoment.format('mm')
  let second = nowMoment.format('ss')

  let results = {
    craftBool: (day == 'Sun') && (hour == '23') && (minute > 29 ),
    weatherBool: (hour12 == '02') && (minute > 29),
    minute: minute,
    second: second
  }
  return results
}

const printCurrentDate = ( ) => {
  let theDate = currentGameTime()
  return formatGameDate( theDate )
}

const formatGameDate = ( theDate ) => {
  let firstHalf = theDate.format('Y: ddd,')
  let month = emMonths[theDate.format('MMMM')]
  let lastHalf = theDate.format('(MMM) Do, HH:mm (h:mm A)')
  return `${firstHalf} ${month} ${lastHalf}`
}

const getSeasonModifier = ( day = 0 ) => {
  let radianConversion = Math.PI/182
  let dayOfYear = parseInt( currentGameTime().format("DDD")) + parseInt( day ) + 10
  return Math.cos((dayOfYear * radianConversion)+Math.PI) //Should give us -1 on Dec 31st and +1 at the end of June
}

const sunriseSunset = ( offsetMod = 0 ) => {
  const offsetMinutes = 128
  let sunriseTime = moment("06:09","HH:mm")
  let sunsetTime = moment("18:11","HH:mm")

  let sunsetOffset = offsetMinutes * offsetMod
  let sunriseOffset = sunsetOffset * -1

  sunriseTime.add(sunriseOffset, 'minutes')
  sunsetTime.add(sunsetOffset, 'minutes')

  return {
    sunrise: sunriseTime.format('hh:mm A'),
    sunset: sunsetTime.format('hh:mm A')
    }
}

//Skipping 37 days because of the Gilnaith Time Skip.  Original days subtracted was 131
const currentGameTime = () => {
  let theDate = moment.tz("2018-02-09T00:00:00", 'UTC')
  let difference = moment.tz('UTC').diff(theDate)
  theDate.add(difference*2, 'ms')
  theDate.subtract(OFFSET_DAYS, 'days')
  theDate.subtract(1777, 'Years')
  return theDate
}

const whatDay = ( irlDate ) => {
  let offset = OFFSET_DAYS
  let theDate = moment.tz("2018-02-09T00:00:00", 'UTC')
  let irlMoment = moment.tz(irlDate, 'UTC')

  if (irlMoment.isBefore( moment.tz('2018-08-31', 'UTC'))) {
    console.log( irlMoment, " before");
    offset = ORIGINAL_OFFSET
  }

  let difference = irlMoment.diff(theDate)
  theDate.add(difference*2, 'ms')

  theDate.subtract(offset, 'days')
  theDate.subtract(1777, 'Years')

  return formatGameDate( theDate )
}

module.exports = {printCurrentDate, checkDate, checkAlerts, getSeasonModifier, sunriseSunset, whatDay }