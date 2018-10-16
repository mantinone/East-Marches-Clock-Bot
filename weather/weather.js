const clock = require('../clock/clock.js')
const dice = require('./dice.js')
const select = require('./select.js')
const descriptions = require('./descriptions.js')
const CLIMATE = 'temperate'
const SUPERNATURALCHANCE = 5

const weather= {
  base:{prec:0,wind:"r1.5"},
  // warm:{
  //   mod:{t_base:80,t_dev:20,s_dev:40},
  //   forecast:{
  //     dice:"1d100",
  //     "01-70":{},
  //     "71-90":{wind:"+1"},
  //     "91-99":{wind:"+3"},
  //     "100":{prec:31,temp:"-10"}
  //   }
  // },
  temperate:{
    mod:{t_base:40,t_dev:20,s_dev:20},
    forecast:{
      dice:"1d100",
      "01-70":{},
      "71-75":{temp:"+10"},
      "76-80":{temp:"-10"},
      "81-90":{prec:"1d100"},
      "91-99":{prec:"1d70 + 30",temp:"-10",wind:"+3"},
      "100":{prec:"1d70 + 30",temp:"-10",wind:"+4"}
    }
  },
  // cold:{
  //   mod:{t_base:0,t_dev:20,s_dev:40},
  //   forecast:{
  //     dice:"1d100",
  //     "01-70":{},
  //     "71-73":{temp:"+10"},
  //     "74-80":{temp:"-10"},
  //     "81-90":{prec:"1d100"},
  //     "91-99":{prec:"1d70 + 30",temp:"-10",wind:"+3"},
  //     "100":{prec:"1d70 + 30",temp:"-10",wind:"+4"}
  //   }
  // },
  spring:{
    mod:{s_x:0,cover:"1d10"}
  },
  summer:{
    mod:{s_x:1,cover:"1d6"}
  },
  autumn:{
    mod:{s_x:0,cover:"1d12"}
  },
  winter:{
    mod:{s_x:-1,cover:"1d20"}
  },
  supernatural:{
    clear:[
      {super_desc:"Celestial Clarity"},
      {super_desc:"Empyrean Sky",image:"empyrean_sky.jpg"},
      {super_desc:"Luminous Clouds",image:"luminous_clouds.jpg"},
      {super_desc:"Psychic Calm"},
      {super_desc:"Clockwork Clouds",image:"clockwork_clouds.jpg"},
      {super_desc:"Draconic Clouds",image:"draconic_clouds.jpg"},
      {super_desc:"Hallucinatory Storm"},{super_desc:"Incorporeal Wind"},
      {super_desc:"Spiderweb Clouds",image:"spiderweb_clouds.jpg"},
      {super_desc:"Incendiary Clouds",image:"incendiary_clouds.jpg"},
      {super_desc:"Aberrant Sky",image:"aberrant_sky.jpg"},
      {super_desc:"Skyquake",image:"skyquake.jpg"}
    ],
    windy:[
      {super_desc:"Volant Mistral"},
      {super_desc:"Expeditious Tailwind"},
      {super_desc:"Whispering Wind"},
      {super_desc:"Rogue Zephyr"},
      {super_desc:"Dragon's Breath",temp:"+20"},
      {super_desc:"Temporal Wind"}
    ],
    fog:[
      {super_desc:"Crimson Fog",image:"crimson_fog.jpg"},
      {super_desc:"Ethereal Fog"},
      {super_desc:"Solid Fog"}
    ],
    rain:[
      {super_desc:"Reverse Rain"},
      {super_desc:"Prismatic Rain",image:"prismatic_rain.jpg"},
      {super_desc:"Acid Rain"}
    ],
    hail:[
      {super_desc:"Starfall Hail",image:"starfall.jpg"},
      {super_desc:"Dire Hail"},
      {super_desc:"Thunder Hail"}
    ],
    snow:[
      {super_desc:"Phantom Snow"},
      {super_desc:"Lethe Snow"},
      {super_desc:"Leaden Snow"}
    ],
    sleet:[
      {super_desc:"Levitant Ice",image:"snow.jpg"},
      {super_desc:"Blacksleet"},
      {super_desc:"Immuring Sleet"}
    ],
    windstorm:[
      {super_desc:"Gatestorm",image:"gatestorm.jpg",wind:4},
      {super_desc:"Firestorm",image:"firestorm.jpg",temp:"+20",wind:3}
    ],
    thunderstorm:[
      {super_desc:"Arcane Tempest",wind:3},
      {super_desc:"Ghoststorm",temp:"-20",wind:4}
    ],
    snowstorm:[
      {super_desc:"Animus Blizzard",wind:4},
      {super_desc:"Leaden Snowstorm",wind:3}
    ]
  },
  wind_data:[
    {desc:"Light",mph:"1d10"},
    {desc:"Moderate",mph:"1d10 + 10"},
    {desc:"Strong",mph:"1d10 + 20"},
    {desc:"Severe",mph:"1d20 + 30"},
    {desc:"Windstorm",mph:"1d25 + 50"},
    {desc:"Hurricane",mph:"1d100 + 75"},
    {desc:"Tornado",mph:"1d125 + 175"}
  ],
  image_list:[
    {regex:/tornado/i,image:"tornado.jpg"},
    {regex:/hurricane/i,image:"hurricane.jpg"},
    {regex:/(snowstorm|blizzard)/i,image:"blizzard.jpg"},
    {regex:/duststorm/i,image:"duststorm.jpg"},
    {regex:/windstorm/i,image:"clear.jpg"},
    {regex:/(storm|tempest)/i,image:"thunderstorm.jpg"},
    {regex:/(snow|sleet)/i,image:"snow.jpg"},
    {regex:/(rain|hail)/i,image:"rain.jpg"},
    {regex:/(fog)/i,image:"fog.jpg"},
    {regex:/(overcast)/i,image:"overcast.jpg"},
    {regex:/(cloudy)/i,image:"cloudy.jpg"},
    {regex:/(clear)/i,image:"clear.jpg"}
  ]
}

const getWeather = ( day = 0 ) => {
  var climate = CLIMATE
  season = "spring"
  supernaturalChance = SUPERNATURALCHANCE
  wData = {climate:climate,season:season};

  wData = mod_weather(wData,weather.base); //Adds mods to wData
  wData = mod_weather(wData,weather[climate].mod);
  wData = mod_weather(wData,weather[season].mod);

  let seasonModifier = clock.getSeasonModifier( day )
  wData.sunTimes = clock.sunriseSunset( seasonModifier )

  wData.t_base += Math.floor(wData.s_dev*seasonModifier); //Modifies tbase up or down 20 degrees based on season
  wData.temp = wData.t_base+dice.rand(wData.t_dev);

  climate = weather[climate].forecast; //This sub object randomly modifies temp up or down, or determines chance of storms and precipitation

  wData = mod_weather( wData, select.select_from_table(climate) );

  if(dice.rand(100)<supernaturalChance){
    let supernaturalArray = weather.supernatural[weather_type(wData)]
    if( supernaturalArray )
        wData = mod_weather( wData,select.select_from_list( supernaturalArray ) );
  }

  wData = desc_weather(wData);

  return fmt_weather(wData);
}

//Adds modifiers to the weather object.  Straight number, object, rolls dice, or flat bonus
const mod_weather = (wData,modifier) => {
  Object.keys(modifier).forEach( (i) => {
    //Creating a new key on the wDate object
    wData[i]= typeof modifier[i] === "number"
      ? modifier[i]
      : typeof modifier[i] === "string"
        ? (match=/^r(\d+\.\d+|\d+)/.exec(modifier[i])) //such as r1.5
          ? dice.rand(parseFloat(match[1]))
          : /^\d+d\d+/.exec(modifier[i]) //dice!  4d6, etc
            ? parseInt(dice.roll_dice(modifier[i]))
            : (match=/^\+(\d+)/.exec(modifier[i])) //+4 etc.  Bonus
              ? zero(wData[i])+parseInt(match[1])
              : (match=/^-(\d+)/.exec(modifier[i])) //-4 etc.
                ? zero(wData[i])-parseInt(match[1])
                : modifier[i]
        : Object.clone(modifier[i])
  });
  return wData
}

const zero = (a) => {
  return typeof a === "number" ?
    a:
    0
}

//Looks at weather details and comes up with a description.
const weather_type = (wData) => {
  var result;
  result=wData.prec==0
    ? wData.wind==0
      ? "clear"
      : "windy"
    : wData.prec<=30
      ? "fog"
      : wData.prec<=90
        ? wData.temp<=30
          ? "snow"
          : "rain"
      : wData.temp<=30
        ? "sleet"
        : wData.temp<=70
          ? "hail"
          : "rain";
  if(wData.wind>=3)
    result=/(rain|hail)/i.exec(result)
      ? "thunderstorm"
      : /(snow|sleet)/i.exec(result)
        ? "snowstorm"
        : "windstorm";
  return result
}


const desc_weather = (wData) => {
  wData = desc_prec( wData );
  wData = desc_temp( wData );
  wData = desc_wind( wData );
  wData.text = [];
  if( wData.super_desc ){
    wData.desc = wData.super_desc;
    wData.text = get_text( "desc", wData.desc, wData.text );
    wData.text = get_text( "temp", wData.temp_desc, wData.text)
  }else if( storm=desc_storm( wData )){
    wData.desc = storm;
    wData.text = get_text( "desc", wData.desc, wData.text );
    if( wData.prec_note ){
      wData.desc += ", " + wData.prec_desc;
      wData.text = get_text( "prec", wData.prec_desc, wData.text )
    }
    wData.text = get_text( "temp", wData.temp_desc, wData.text );
    if( /thunderstorm/i.exec( wData.desc ) && dice.rand(10) == 0 ){
      wData.desc += ", Tornado";
      wData.text = get_text( "wind","tornado", wData.text )
    }
  }else{
    if( wData.prec_desc ) wData.desc = wData.prec_desc;
    else if( wData.wind >= 3 ) wData.desc = "Windstorm";
    else if( wData.wind >= 1) wData.desc = "Windy";
    else{
      if( wData.temp < 32 ) wData.cover -= Math.floor(( 32 - wData.temp )/4 );

      wData.desc = wData.cover >= 10
        ? "Overcast"
        : wData.cover >= 6
          ? "Cloudy"
          : "Clear"
    }
    wData.text = get_text( "prec", wData.prec_desc, wData.text );
    wData.text = get_text( "temp", wData.temp_desc, wData.text );
    wData.text = get_text( "wind", wData.wind_desc, wData.text )
  }
  return wData
}

const desc_prec = (wData) => {
  wData.prec_desc = wData.prec==0
    ? ""
    : wData.prec<=30
      ? "Fog"
      : wData.prec<=90
        ? wData.temp<=30
          ? "Snow"
          : "Rain"
      : wData.temp<=30
        ? "Sleet"
        : wData.temp<=70
          ? "Hail"
          : "Rain";
  if(/(fog)/i.exec(wData.prec_desc))
    wData.prec_type="fog";
  else if(/(rain|hail)/i.exec(wData.prec_desc))
    wData.prec_type="rain";
  else if(/(snow|sleet)/i.exec(wData.prec_desc))
    wData.prec_type="snow";
  if(/(fog|hail|sleet)/i.exec(wData.prec_desc))
    wData.prec_note=true;

  return wData
}

const desc_temp = (wData) => {
  wData.temp_f = wData.temp;
  wData.temp_l = wData.temp_f - 10 - dice.rand(10);
  wData.temp_high = fmt_temp(wData.temp_f);
  wData.temp_low = fmt_temp(wData.temp_l);

  var avgTempRange = Math.floor(wData.t_dev/3),
  coldRange = wData.t_base + avgTempRange;
  warmRange = wData.t_base + wData.t_dev - avgTempRange;

  wData.temp_desc = wData.temp_f<-20
    ? "Extreme Cold"
    : wData.temp_f<0
      ? "Severe Cold"
      : wData.temp_f<40
        ? "Cold"
        : wData.temp_f>140
          ? "Extreme Heat"
          : wData.temp_f>110
            ? "Severe Heat"
            : wData.temp_f>90
              ? "Very Hot"
              : "Moderate";

  wData.temp_rel=wData.temp_f< coldRange
    ? "Colder than normal"
    : wData.temp_f > warmRange
      ? "Warmer than normal"
      : "Normal";

  return wData
}

const fmt_temp = (tempF) => {
  var tempC=Math.floor((tempF-32)*5/9);
  return {f:tempF,c:tempC}
}

const desc_wind = (wData) => {
  var b=weather.wind_data[wData.wind];
  wData.wind_desc=b.desc;
  wData.wind_mph=dice.roll_dice(b.mph);
  wData.wind_speed=fmt_speed(wData.wind_mph);
  return wData
}

const fmt_speed = (a) => {
  var b=Math.floor(a*1.609);
  return {m:a,k:b}
}

const desc_storm = (wData) => {
  if(wData.prec_type=="rain")
    if(wData.wind==5)
      return"Hurricane";
    else if(wData.wind==4)
      return"Severe Thunderstorm";
    else{
      if(wData.wind==3)
        return"Thunderstorm"}
      else if(wData.prec_type=="snow")
        if(wData.wind>=4)
          return"Blizzard";
        else{
          if(wData.wind==3)return"Snowstorm"
        }//else if(wData.climate=="warm")
        //   if(wData.wind>=4)return"Greater Duststorm";
        //   else if(wData.wind==3)return"Duststorm"
}

const get_text = ( prefix, type, textArray ) => {
  if( prefix && type && ( data = descriptions[text_id( prefix, type )] )) {
    textArray.push( data );
  }
  return textArray
}

const text_id = (a,b) => {
  return[a,clean_type(b)].join("-")
}

const clean_type = (a) => {
  return a.toLowerCase().replace(/['"]/g,"").replace(/ /g,"_")
}

const fmt_weather = (wData) => {
  let resultString = ''

    resultString += fmt_stats(wData),
    resultString += fmt_desc(wData)
    resultString += fmt_sunTimes(wData)

  return resultString
}

const fmt_stats = (wData) => {
  var results = `**-Weather:**  ${wData.desc} \n`

  if(wData.temp_desc){
    results += `\n**-Temperature:**  ${wData.temp_desc} \n **High:**  ${wData.temp_high.f}°F (${wData.temp_high.c}°C) \n **Low:**  ${wData.temp_low.f}°F (${wData.temp_low.c}°C) \n **Relative:**  ${wData.temp_rel} \n`
  }
  if(wData.wind_desc){
    results += `\n**-Wind Force:**  ${wData.wind_desc} \n **Wind Speed:**  ${wData.wind_speed.m} mph (${wData.wind_speed.k} kph) \n`
  }
  return results
}

const fmt_desc = (wData) => {
  let results = '\n'

  if( wData.super_desc ){
    results += `**Supernatural Conditions** \n`
  } else {
    results += `**-Conditions-** \n`
  }

  // wData.text.forEach( (i) => {
  //   results += `**${i.name}** \n`
  // });
  results += `The words "Hello Vareholm, it is the hour of-," followed by the current time, are written in cloud, in Arias' handwriting, in the sky.`

  return results
}

const fmt_sunTimes = (wData) => {
  return `\n **Sunrise:** ${wData.sunTimes.sunrise} \n **Sunset:** ${wData.sunTimes.sunset}`
}

module.exports = { getWeather }