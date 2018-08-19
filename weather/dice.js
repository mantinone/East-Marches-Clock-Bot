// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dice.js
//
// copyright (c) 2006-2017 drow <drow@bin.sh>
// all rights reserved.

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// configuration

  var fn   = /([a-z]*)\(([^()]*?)\)/;
  var dice = /(\d*)d(\d+)/;
  var incr = /([+-]?\d+\.\d+|[+-]?\d+)(\+\+|--)/;
  var mult = /([+-]?\d+\.\d+|[+-]?\d+)\s*(\*|\/|%)\s*([+-]?\d+\.\d+|[+-]?\d+)/;
  var add  = /([+-]?\d+\.\d+|[+-]?\d+)\s*(\+|-)\s*([+-]?\d+\.\d+|[+-]?\d+)/;
  var fp   = /(\d+\.\d\d\d+)/;

  var max_dice = 1000;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// roll dice

  function roll_dice (string) {
    var match;
    var result;

    while (match = fn.exec(string)) {
      result = rd_fn(match[1],match[2]);
      string = string.replace(fn,result);
    }
    while (match = dice.exec(string)) {
      result = rd_dice(match[1],match[2]);
      string = string.replace(dice,result);
    }
    while (match = incr.exec(string)) {
      result = rd_math(match[1],match[2]);
      string = string.replace(incr,result);
    }
    while (match = mult.exec(string)) {
      result = rd_math(match[1],match[2],match[3]);
      string = string.replace(mult,result);
    }
    while (match = add.exec(string)) {
      result = rd_math(match[1],match[2],match[3]);
      string = string.replace(add,result);
    }
    while (match = fp.exec(string)) {
      result = Math.floor((match[1] * 100) + 0.5) / 100;
      string = string.replace(fp,result);
    }
    return string;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// functions

  function rd_fn (fn,string) {
    var thr = roll_dice(string);

    if (fn == 'int') {
      return Math.floor(thr);
    } else if (fn == 'round') {
      return Math.floor(thr + 0.5);
    } else if (fn == 'sqrt') {
      return Math.sqrt(thr);
    }
    return thr;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// dice

  function rd_dice (n,d) {
    n = parseInt(n);
      if (isNaN(n) || n < 1) n = 1;
    d = parseInt(d);
      if (isNaN(d) || d < 0) return 0;
    if (n > max_dice) return 0;

    var total = 0;

    var i; for (i = 0; i < n; i++) {
      total += rand(d) + 1;
    }
    return total;
  }
  function rand (d) {
    return Math.floor(Math.random() * 0.9999 * d);
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// maths

  function rd_math (a,op,b) {
    a = parseFloat(a);
      if (isNaN(a)) a = 0.0;
    b = parseFloat(b);
      if (isNaN(b)) b = 0.0;

    if (op == '++') return ++a;
    if (op == '--') return --a;
    if (op == '*')  return   a * b;
    if (op == '/')  return   a / b;
    if (op == '%')  return   a % b;
    if (op == '+')  return   a + b;
    if (op == '-')  return   a - b;

    return 0;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// multi-dice

  function multi_dice (n,string) {
    var list = new Array();

    var i; for (i = 0; i < n; i++) {
      list.push(roll_dice(string));
    }
    return list.join(', ');
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// calculate average

  function calc_avg (string) {
    var match;
    var result;

    while (string.match(dice)) {
      match = dice.exec(string);
      result = avg_dice(match[1],match[2]);
      string = string.replace(dice,result);
    }
    result = roll_dice(string);
    result = parseFloat(result);
      if (isNaN(result)) return 0;
    return result;
  }
  function avg_dice (n,d) {
    n = parseInt(n);
      if (isNaN(n) || n < 1) n = 1;
      if (n > max_dice) return 0;
    d = parseInt(d);
      if (isNaN(d) || d < 0) return 0;
    return (n * (d + 1)) / 2.0;
  }

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
module.exports = {rand, roll_dice}