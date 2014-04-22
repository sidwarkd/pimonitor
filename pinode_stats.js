'use strict'

// An example of accessing system information on the Raspberry Pi with NodeJS

var fs = require('fs');

var PiStats = function(){
  var stats = {};
  var _currentCPUInfo = {total:0, active:0};
  var _previousCPUInfo = {total:0, active:0};

  var memInfo = {};
  var currentCPUInfo = {total:0, active:0};
  var lastCPUInfo = {total:0, active:0};

  function getValFromLine(line){
    var match = line.match(/[0-9]+/gi);
    if(match !== null)
      return parseInt(match[0]);
    else
      return null;
  }

  var getMemoryInfo = function(cb){
    fs.readFile('/proc/meminfo', 'utf8', function(err, data){
      if(err){
        if(cb !== undefined)
          cb(err);
        return;
      }
      var lines = data.split('\n');
      stats.memTotal = Math.floor(getValFromLine(lines[0]) / 1024);
      stats.memFree = Math.floor(getValFromLine(lines[1]) / 1024);
      stats.memCached = Math.floor(getValFromLine(lines[3]) / 1024);
      stats.memUsed = stats.memTotal - stats.memFree;
      stats.memPercentUsed = Math.ceil(((stats.memUsed - stats.memCached) / stats.memTotal) * 100);

      if(cb !== undefined)
        cb(null, stats);
    });
  };

  var calculateCPUPercentage = function(oldVals, newVals){
    var totalDiff = newVals.total - oldVals.total;
    var activeDiff = newVals.active - oldVals.active;
    return Math.ceil((activeDiff / totalDiff) * 100);
  };

  var getCPUInfo = function(cb){
    _previousCPUInfo.active = _currentCPUInfo.active;
    _previousCPUInfo.idle = _currentCPUInfo.idle;
    _previousCPUInfo.total = _currentCPUInfo.total;

    fs.readFile('/proc/stat', 'utf8', function(err, data){
      if(err){
        if(cb !== undefined)
          cb(err);
        return;
      }
      var lines = data.split('\n');
      var cpuTimes = lines[0].match(/[0-9]+/gi);
      _currentCPUInfo.total = 0;
      // We'll count both idle and iowait as idle time
      _currentCPUInfo.idle = parseInt(cpuTimes[3]) + parseInt(cpuTimes[4]);
      for (var i = 0; i < cpuTimes.length; i++){
        _currentCPUInfo.total += parseInt(cpuTimes[i]);
      }
      _currentCPUInfo.active = _currentCPUInfo.total - _currentCPUInfo.idle
      _currentCPUInfo.percentUsed = calculateCPUPercentage(_previousCPUInfo, _currentCPUInfo);

      stats.cpuUsage = _currentCPUInfo.percentUsed;

      if(cb !== undefined)
        cb(null, stats);
    });
  };

  var getCurrentTemperature = function(cb){
    // Uncomment the next 3 lines for testing on regular linux and comment
    // out the fs.readFile block
    stats.tempC = 42.3;
    stats.tempF = 102.5;
    cb(null, stats);
    // fs.readFile('/sys/class/thermal/thermal_zone0/temp', 'utf8', function(err, data){
    //   var temp = data.match(/[0-9]+/gi);
    //   stats.tempC = parseInt(temp[0]) / 1000;
    //   stats.tempF = stats.tempC * 1.80 + 32.00;

    //   if(cb !== undefined)
    //     cb(null, stats);
    // });
  }

  return{
    getMemoryInfo: getMemoryInfo,
    getCPUInfo: getCPUInfo,
    update: function(cb){
      getMemoryInfo(function(err, data){
        getCPUInfo(function(err1, data1){
          getCurrentTemperature(function(err2, data2){
            cb(err2, data2);
          });
        });
      });
    },
    printMemoryInfo: function(){
      getMemoryInfo(function(err, data){
        console.log("total\tused\tfree\tcached");
        console.log( data.total + "\t" + data.used + "\t" + data.free + "\t" + data.cached );
        console.log("Memory Usage:\t" + data.percentUsed + "%");
        return;
      });
    },
    printCPUInfo: function(){
      getCPUInfo(function(err, data){
        console.log("Current CPU Usage: " + data.percentUsed + "%");
      });
    }
  };
}();

module.exports = PiStats;

// Example usage

// var stats = require('./pinode_stats.js');
// stats.update(function(err, data){
//   console.log(data);
// });
