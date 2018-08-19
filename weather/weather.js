const clock = require('../clock/clock.js')
const dice = require('./dice.js')
const select = require('./select.js')
const CLIMATE = 'temperate'
const SUPERNATURALCHANCE = 50

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

//Suernatural ranges, 0, 5, 20, 50
const getWeather = () => {
  var climate = CLIMATE
  season = "autumn"//clock.getSeasonModifier()
  supernaturalChance = SUPERNATURALCHANCE
  wData = {climate:climate,season:season};

  wData = mod_weather(wData,weather.base); //Adds mods to wData
  wData = mod_weather(wData,weather[climate].mod);
  wData = mod_weather(wData,weather[season].mod);

  wData.t_base += wData.s_dev*wData.s_x; //Modifies tbase up or down 20 degrees based on season
  wData.temp = wData.t_base+dice.rand(wData.t_dev);

  climate = weather[climate].forecast; //This sub object randomly modifies temp up or down, or determines chance of storms and precipitation

  wData = mod_weather( wData, select.select_from_table(climate) );

  if(dice.rand(100)<supernaturalChance){
    let supernaturalArray = weather.supernatural[weather_type(wData)]
    if( supernaturalArray )
        wData = mod_weather( wData,select.select_from_list( supernaturalArray ) );
  }

  return wData
  wData = desc_weather(c);

  //if(!wData.image) wData.image = get_image(wData);

  wData = fmt_weather(wData);
  //return All this shit as text formatted for a Discord post
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

const desc_weather = (a) => {
  a=desc_prec(a);
  a=desc_temp(a);
  a=desc_wind(a);
  a.text=[];
  if(a.super_desc){
    a.desc=a.super_desc;
    a.text=get_text("desc",a.desc,a.text);
    a.text=get_text("temp",a.temp_desc,a.text)
  }else if(storm=desc_storm(a)){
    a.desc=storm;
    a.text=get_text("desc",a.desc,a.text);
    if(a.prec_note){
      a.desc+=", "+a.prec_desc;
      a.text=get_text("prec",a.prec_desc,a.text)
    }a.text=get_text("temp",a.temp_desc,a.text);
    if(/thunderstorm/i.exec(a.desc)&&dice.rand(10)==0){
      a.desc+=", Tornado";a.text=get_text("wind","tornado",
      a.text)
    }
  }else{
    if(a.prec_desc)a.desc=a.prec_desc;
    else if(a.wind>=3)a.desc="Windstorm";
    else if(a.wind>=1)a.desc="Windy";
    else{
      if(a.temp<32)a.cover-=Math.floor((32-a.temp)/4);
      a.desc=a.cover>=10
        ?"Overcast"
        :a.cover>=6
          ?"Cloudy"
          :"Clear"
    }
    a.text=get_text("prec",a.prec_desc,a.text);
    a.text=get_text("temp",a.temp_desc,a.text);
    a.text=get_text("wind",a.wind_desc,a.text)
  }return a
}

const desc_prec = (a) => {
  a.prec_desc=a.prec==0
    ? ""
    : a.prec<=30
      ? "Fog":a.prec<=90
        ? a.temp<=30
          ? "Snow"
          : "Rain"
      : a.temp<=30
        ? "Sleet"
        : a.temp<=70
          ? "Hail"
          : "Rain";
  if(/(fog)/i.exec(a.prec_desc))
    a.prec_type="fog";
  else if(/(rain|hail)/i.exec(a.prec_desc))
    a.prec_type="rain";
  else if(/(snow|sleet)/i.exec(a.prec_desc))
    a.prec_type="snow";
  if(/(fog|hail|sleet)/i.exec(a.prec_desc))
    a.prec_note=true;

  return a
}

const desc_temp = (a) => {
  a.temp_f=a.temp;
  a.temp_l=a.temp_f-10-dice.rand(10);
  a.temp_high=fmt_temp(a.temp_f);
  a.temp_low=fmt_temp(a.temp_l);
  var b=Math.floor(a.t_dev/3),
  d=a.t_base+b;
  b=a.t_base+a.t_dev-b;

  a.temp_desc=a.temp_f<-20?
    "Extreme Cold":
    a.temp_f<0
      ? "Severe Cold"
      : a.temp_f<40
        ? "Cold"
        : a.temp_f>140
          ? "Extreme Heat"
          : a.temp_f>110
            ? "Severe Heat"
            : a.temp_f>90
              ? "Very Hot"
              : "Moderate";

  a.temp_rel=a.temp_f<d?
    "Colder than normal":a.temp_f>b?
      "Warmer than normal":
      "Normal";

  return a
}

const fmt_temp = (a) => {
  var b=Math.floor((a-32)*5/9);
  return eval_fmt("temp",{f:a,c:b})
}

const desc_wind = (a) => {
  var b=weather.wind_data[a.wind];
  a.wind_desc=b.desc;
  a.wind_mph=dice.roll_dice(b.mph);
  a.wind_speed=fmt_speed(a.wind_mph);
  return a
}

const fmt_speed = (a) => {
  var b=Math.floor(a*1.609);
  return eval_fmt("wind",{m:a,k:b})
}

const desc_storm = (a) => {
  if(a.prec_type=="rain")
    if(a.wind==5)
      return"Hurricane";
    else if(a.wind==4)
      return"Severe Thunderstorm";
    else{
      if(a.wind==3)
        return"Thunderstorm"}
      else if(a.prec_type=="snow")
        if(a.wind>=4)
          return"Blizzard";
        else{
          if(a.wind==3)return"Snowstorm"
        }else if(a.climate=="warm")
          if(a.wind>=4)return"Greater Duststorm";
          else if(a.wind==3)return"Duststorm"
}

const get_text = (a,b,d) => {
  if(a&&b&&(div=$(text_id(a,b))))d.push(div.innerHTML);
  return d
}

const text_id = (a,b) => {
  return[a,clean_type(b)].join("-")
}

const clean_type = (a) => {
  return a.toLowerCase().replace(/['"]/g,"").replace(/ /g,"_")
}

const get_image = (a) => {
  for(i=0;i<weather.image_list.length;i++){
    var b=weather.image_list[i];
    if(b.regex.exec(a.desc))return b.image
  }
  return"clear.jpg"
}

const fmt_weather = (a) => {
  a={
    image:eval_fmt("image",{image:a.image}),
    stats:fmt_stats(a),
    desc:fmt_desc(a.text)
  };
  return eval_fmt("weather",a)
}

const fmt_stats = (a) => {
  var b=[fmt_stat("Description",a.desc)];

  if(a.temp_desc){
    b.push(fmt.hr);
    b.push(fmt_stat("Temperature",a.temp_desc));
    b.push(fmt_stat("High",a.temp_high));
    b.push(fmt_stat("Low",a.temp_low));
    b.push(fmt_stat("Relative",a.temp_rel))
  }
  if(a.wind_desc){
    b.push(fmt.hr);
    b.push(fmt_stat("Wind Force",a.wind_desc));
    b.push(fmt_stat("Wind Speed",a.wind_speed))
  }

  return b.join("")
}

const fmt_stat = (a,b) => {
  if(!b) return"";

  return eval_fmt("stat",{key:a,value:b})
}

const fmt_desc = (a) => {
  list=a.map(fmt_text);

  return fmt.hr+list.join("")
}

const fmt_text = (a) => {
  if(!a)return"";
  return eval_fmt("text",{text:a})
}

const eval_fmt = (a,b) => {
  return fmt[a].evaluate(b)
}

module.exports = { getWeather }