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

const lunarPhases = {
  1: "Full Moon",
  2: "Waning Gibbous",
  3: "Waning Quarter",
  4: "Waning Crescent",
  5: "New Moon",
  6: "Waxing Crescent",
  7: "Waxing Quarter",
  8: "Waxing Gibbous"
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
  let theDate = gameTime()
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
  let dayOfYear = parseInt( gameTime().format("DDD")) + parseInt( day ) + 10
  return Math.cos((dayOfYear * radianConversion)+Math.PI) //Should give us -1 on Dec 31st and +1 at the end of June
}

const getLunarPhase = ( day = 0 ) => {
  let fullMoonDate = moment.tz("0249-10-16T00:00:00", 'UTC')
  let difference = gameTime().diff(fullMoonDate, 'days')
  let mod = difference%29
  let phase = lunarPhases[Math.ceil((mod+0.000001)/3.625)]
  return `**-Lunar Phase:** ${phase} \n`
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

const gameTime = ( irlDate ) => {
  let theDate = moment.tz("2018-02-09T00:00:00", 'UTC')
  let irlMoment = irlDate?moment.tz(irlDate,'UTC'):moment.tz('UTC')
  let offset = irlMoment.isBefore( moment.tz('2018-08-31', 'UTC'))?ORIGINAL_OFFSET:OFFSET_DAYS

  let difference = irlMoment.diff(theDate)
  theDate.add(difference*2, 'ms')

  theDate.subtract(OFFSET_DAYS, 'days')
  theDate.subtract(1774, 'Years')

  return theDate
}

const whatDay = ( irlDate ) => {
  return formatGameDate( gameTime(irlDate) )
}

module.exports = {printCurrentDate, checkDate, checkAlerts, getSeasonModifier, sunriseSunset, whatDay, getLunarPhase }