var form_id="weather_form",
image_dir="/d20/weather/images",
weather= {
  base:{prec:0,wind:"r1.5"},
  warm:{
    mod:{t_base:80,t_dev:20,s_dev:40},
    forecast:{
      dice:"1d100","01-70":{},
      "71-90":{wind:"+1"},
      "91-99":{wind:"+3"},
      "100":{prec:31,temp:"-10"}
    }
  },
  temperate:{
    mod:{t_base:40,t_dev:20,s_dev:20},
    forecast:{
      dice:"1d100","01-70":{},
      "71-75":{temp:"+10"},
      "76-80":{temp:"-10"},
      "81-90":{prec:"1d100"},
      "91-99":{prec:"1d70 + 30",temp:"-10",wind:"+3"},
      "100":{prec:"1d70 + 30",temp:"-10",wind:"+4"}
    }
  },
  cold:{
    mod:{t_base:0,t_dev:20,s_dev:40},
    forecast:{
      dice:"1d100","01-70":{},
      "71-73":{temp:"+10"},
      "74-80":{temp:"-10"},
      "81-90":{prec:"1d100"},
      "91-99":{prec:"1d70 + 30",temp:"-10",wind:"+3"},
      "100":{prec:"1d70 + 30",temp:"-10",wind:"+4"}
    }
  },
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
},

fmt= {
  weather:'<table><tr><td width="100">#{image}</td><td><table>#{stats}</table></td></tr>#{desc}</table>',
  image:'<img src="'+image_dir+'/#{image}" alt="" width="100" height="200" />',
  stat:'<tr><td class="key" width="80">#{key}:</td><td class="value">#{value}</td></tr>',
  temp:"#{f}&deg;F (#{c}&deg;C)",
  wind:"#{m} mph (#{k} kph)",
  text:'<tr><td colspan="2" class="value">#{text}</td></tr>'
};
Object.keys(fmt).each( function(a){
  fmt[a]=new Template(fmt[a])
});
fmt.hr='<tr><td colspan="2"><hr /></td></tr>';
function init_form(){
  client_form(form_id);
  init_from_cookie();
  get_weather()}function init_from_cookie(){var a=get_cookie("enc")||{};if(v=a.climate)$("climate").setValue(v);if(v=a.season)$("season").setValue(v);if(v=a["super"])$("super").setValue(v)}

function set_field(a){
  save_prefs("enc",a);get_weather()
}

function get_weather(){
  var a=$("climate").getValue(),
  b=$("season").getValue(),
  d=$("super").intValue(),
  c={climate:a,season:b};
  c=mod_weather(c,weather.base);
  c=mod_weather(c,weather[a].mod);
  c=mod_weather(c,weather[b].mod);
  c.t_base+=c.s_dev*c.s_x;
  c.temp=c.t_base+rand(c.t_dev);a=weather[a].forecast;
  c=mod_weather(c,select_from_table(a));
  if(rand(100)<d)
  if(d=weather.supernatural[weather_type(c)])
      c=mod_weather(c,select_from_list(d));
  c=desc_weather(c);
  if(!c.image)c.image=get_image(c);
  c=fmt_weather(c);
  $("out").update(c)
}

function mod_weather(a,b){
  Object.keys(b).each( function(d){
    a[d]=Object.isNumber(b[d])
      ? b[d]
      : Object.isString(b[d])
        ? (match=/^r(\d+\.\d+|\d+)/.exec(b[d]))
          ? rand(parseFloat(match[1]))
          : /^\d+d\d+/.exec(b[d])
            ? parseInt(roll_dice(b[d]))
            : (match=/^\+(\d+)/.exec(b[d]))
              ? zero(a[d])+parseInt(match[1])
              : (match=/^-(\d+)/.exec(b[d]))
                ? zero(a[d])-parseInt(match[1])
                : b[d]
        : Object.clone(b[d])
  });
  return a
}

function zero(a){
  return Object.isNumber(a) ?
    a:
    0
}

function weather_type(a){
  var b;
  b=a.prec==0
    ? a.wind==0
      ? "clear"
      : "windy"
    : a.prec<=30
      ? "fog"
      : a.prec<=90
        ? a.temp<=30
          ? "snow"
          : "rain"
      : a.temp<=30
        ? "sleet"
        : a.temp<=70
          ? "hail"
          : "rain";
  if(a.wind>=3)
    b=/(rain|hail)/i.exec(b)
      ? "thunderstorm"
      : /(snow|sleet)/i.exec(b)
        ? "snowstorm"
        : "windstorm";
  return b
}

function desc_weather(a){
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
    if(/thunderstorm/i.exec(a.desc)&&rand(10)==0){
      a.desc+=", Tornado";a.text=get_text("wind","tornado",
      a.text)
    }
  }else{
    if(a.prec_desc)a.desc=a.prec_desc;
    else if(a.wind>=3)a.desc="Windstorm";
    else if(a.wind>=1)a.desc="Windy";
    else{
      if(a.temp<32)a.cover-=Math.floor((32-a.temp)/4);
      a.desc=a.cover>=10?"Overcast":a.cover>=6?"Cloudy":"Clear"
    }
    a.text=get_text("prec",a.prec_desc,a.text);
    a.text=get_text("temp",a.temp_desc,a.text);
    a.text=get_text("wind",a.wind_desc,a.text)
  }return a
}

function desc_prec(a){
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

function desc_temp(a){
  a.temp_f=a.temp;
  a.temp_l=a.temp_f-10-rand(10);
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

function fmt_temp(a){
  var b=Math.floor((a-32)*5/9);
  return eval_fmt("temp",{f:a,c:b})
}

function desc_wind(a){
  var b=weather.wind_data[a.wind];
  a.wind_desc=b.desc;
  a.wind_mph=roll_dice(b.mph);
  a.wind_speed=fmt_speed(a.wind_mph);
  return a
}

function fmt_speed(a){
  var b=Math.floor(a*1.609);
  return eval_fmt("wind",{m:a,k:b})
}

function desc_storm(a){
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

function get_text(a,b,d){
  if(a&&b&&(div=$(text_id(a,b))))d.push(div.innerHTML);
  return d
}

function text_id(a,b){
  return[a,clean_type(b)].join("-")
}

function clean_type(a){
  return a.toLowerCase().replace(/['"]/g,"").replace(/ /g,"_")
}

function get_image(a){
  for(i=0;i<weather.image_list.length;i++){
    var b=weather.image_list[i];
    if(b.regex.exec(a.desc))return b.image
  }
  return"clear.jpg"
}

function fmt_weather(a){
  a={
    image:eval_fmt("image",{image:a.image}),
    stats:fmt_stats(a),
    desc:fmt_desc(a.text)
  };
  return eval_fmt("weather",a)
}

function fmt_stats(a){
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

function fmt_stat(a,b){
  if(!b) return"";

  return eval_fmt("stat",{key:a,value:b})
}

function fmt_desc(a){
  list=a.map(fmt_text);

  return fmt.hr+list.join("")
}

function fmt_text(a){
  if(!a)return"";
  return eval_fmt("text",{text:a})
}

function eval_fmt(a,b){
  return fmt[a].evaluate(b)
}

document.observe("dom:loaded",init_form);
