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

// document.addEventListener('DOMContentLoaded', ( event ) => {
//   var butts = window.setInterval(updateClock, 700)
// })
//
// const updateClock = () => {
//   let clockTag = document.getElementById('clock')
//   clockTag.innerText = currentGameTime()
// }

const currentGameTime = () => {
  let theDate = moment.tz("2018-02-09T00:00:00", 'UTC')
  let difference = moment.tz('UTC').diff(theDate)
  theDate.add(difference*2, 'ms')
  theDate.subtract(131, 'days')
  theDate.subtract(1777, 'Years')
  return theDate
  // let firstHalf = theDate.format('Y: ddd,')
  // let month = emMonths[theDate.format('MMMM')]
  // let lastHalf = theDate.format('Do, H:mm:ss (h:mm A)')
  // return `Year ${firstHalf} ${month} ${lastHalf}`
}