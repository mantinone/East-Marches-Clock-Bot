const dice = require("./dice.js")

function select_from_list(a){
  return a[Math.floor(Math.random()*a.length)]
}

function select_from_table(a){
  return table_result(a,table_roll(a.dice))
}

function table_roll(a){
  return a=="d6pct"
    ? dice.rd_dice(1,6) * 10 + dice.rd_dice(1,6)
    : parseInt( dice.roll_dice(a) )
}

function table_result(a,b){
  var c;
  Object.keys(a).forEach(function(e){
    var f,g;
    if(match = /(\d+)-(\d+)/.exec(e)){
      f = cv(match[1]);
      g = cv(match[2])
    }else if(match=/(\d+)/.exec(e)) g=f=cv(match[1]);
    if(match&&b>=f&&b<=g) c=a[e]
  });

  if(c){
    if(c.dice){
      var d = table_roll(c.dice);
      c = table_result(c,d)
    }
    if(/\d+d\d+/.exec(c)) c = dice.roll_dice(c)
  }

  else c="No result ("+b+")";
  return c
}

function cv(a){
  return a=="00"?100:parseInt(a)
}

function select_res(a){
  if(Object.isUndefined(a.max))a=scale_table(a);if(Object.isUndefined(a.res))a.res={};var b;if(Object.isUndefined(a.res.roll)){b=table_roll(a.dice);a.res.roll=b}else b=a.res.roll;if(a.res.mod)if(a.dice=="d6pct")b=d6pct_mod(b,a.res.mod);else b+=a.res.mod;if(b<a.min)b=a.min;else if(b>a.max)b=a.max;if(b==a.res.proto)a.res.value=a.res.cache;else{a.res.value=table_result(a,b);a.res.proto=b;a.res.cache=a.res.value}return a.res}

function scale_table(a){
  Object.keys(a).forEach(function(b){
    if(match=/(\d+)-(\d+)/.exec(b)){
      min=cv(match[1]);max=cv(match[2])
    } else if(match=/(\d+)/.exec(b))max=min=cv(match[1]);

    if(match){
      if(Object.isUndefined(a.min)) a.min=min;
      else if(min<a.min)a.min=min;

      if(Object.isUndefined(a.max)) a.max=max;
      else if(max>a.max)a.max=max
    }
  });
      return a
}

    function d6pct_mod(a,b){a=(Math.floor(a/10)-1)*6+a%10;a+=table.res.mod;if(a<1)a=1;else if(a>36)a=36;return(Math.floor((a-1)/6)+1)*10+(a-1)%6+1}

function res_value(a){
  if(value=des_obj(a,["table","res","value"]))return value;else if(value=a.value)return value}function res_data(a){return des_obj(a,["data",res_value(a)])}function set_mods(a,b){var c=0;Object.keys(a).each(function(d){if(d!=b)c+=get_mod(a[d],b)});if(table=a[b].table)if(table.res)table.res.mod=c;else table.res={mod:c};else a[b].mod=c;return c}function get_mod(a,b){return des_obj(res_data(a),["mod",b])||0}

function des_obj(a,b){
  if(!Object.isUndefined(a))if(Object.isUndefined(b))return a;else if(b.length==0)return a;else{var c=b.shift();if(!Object.isUndefined(a[c]))return b.length?des_obj(a[c],b):a[c]}};

module.exports = { select_from_table, select_from_list }