'use strict';

const speedTest = require('speedtest-net');
const inherits = require('util').inherits;
const moment = require('moment');

var Service, Characteristic, FakeGatoHistoryService, HomebridgeAPI;

module.exports = function(homebridge) {
  FakeGatoHistoryService = require('fakegato-history')(homebridge);
  HomebridgeAPI = homebridge;
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory('homebridge-broadband', 'Broadband', Broadband);
};

function Broadband(log, config, api) {

  //HB
  this.config = config;
  this.log = log;
  this.api = api;

  //BASE
  this.name = config['name'] || 'Broadband';
  this.displayName = config.name;
  this.interval = (config['interval'] * 60 * 1000) || 60 * 60 * 1000;
  !this.dlspeed ? this.dlspeed = 0 : this.dlspeed;
  !this.ulspeed ? this.ulspeed = 0 : this.ulspeed;
  !this.ping ? this.ping = 0 : this.ping;

  Characteristic.DownloadSpeed = function() {
    Characteristic.call(this, 'Download', 'da70da1f-da72-4db3-81c2-99f158a15a9a');
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: 'Mbps',
      maxValue: 99999,
      minValue: 0,
      minStep: 0.01,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.DownloadSpeed, Characteristic);
  Characteristic.DownloadSpeed.UUID = 'da70da1f-da72-4db3-81c2-99f158a15a9a';

  Characteristic.UploadSpeed = function() {
    Characteristic.call(this, 'Upload', 'ab74289e-d516-4a12-b2ae-1b32a74c035f');
    this.setProps({
      format: Characteristic.Formats.FLOAT,
      unit: 'Mbps',
      maxValue: 99999,
      minValue: 0,
      minStep: 0.01,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.UploadSpeed, Characteristic);
  Characteristic.UploadSpeed.UUID = 'ab74289e-d516-4a12-b2ae-1b32a74c035f';

  Characteristic.Ping = function() {
    Characteristic.call(this, 'Ping', 'cc65a09a-e052-410c-981d-c11bde2c3f60');
    this.setProps({
      format: Characteristic.Formats.INT,
      unit: 'ms',
      maxValue: 999,
      minValue: 0,
      minStep: 1,
      perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
    });
    this.value = this.getDefaultValue();
  };
  inherits(Characteristic.Ping, Characteristic);
  Characteristic.Ping.UUID = 'cc65a09a-e052-410c-981d-c11bde2c3f60';

}

Broadband.prototype = {

  getServices: function() {

    this.informationService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Identify, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'SeydX')
      .setCharacteristic(Characteristic.Model, 'Broadband Speedtest')
      .setCharacteristic(Characteristic.SerialNumber, '1234567890');

    this.Sensor = new Service.TemperatureSensor(this.name);

    this.Sensor.getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({
        minValue: 0,
        maxValue: 9999,
        minStep: 0.01
      })
      .updateValue(this.dlspeed);

    this.Sensor.addCharacteristic(Characteristic.DownloadSpeed);
    this.Sensor.getCharacteristic(Characteristic.DownloadSpeed)
      .updateValue(this.dlspeed);

    this.Sensor.addCharacteristic(Characteristic.UploadSpeed);
    this.Sensor.getCharacteristic(Characteristic.UploadSpeed)
      .updateValue(this.ulspeed);

    this.Sensor.addCharacteristic(Characteristic.Ping);
    this.Sensor.getCharacteristic(Characteristic.Ping)
      .updateValue(this.ping);

    this.historyService = new FakeGatoHistoryService('weather', this, {
      storage: 'fs',
      disableTimer: true,
      path: HomebridgeAPI.user.cachedAccessoryPath()
    });

    this.getData();
    this.getHistory();

    return [this.informationService, this.Sensor, this.historyService];

  },

  getData: function () {
    const self = this;
    self.log("Starting ISP speed test...");
    try {
      const test = (async () => await speedTest({ acceptLicense: true }))();

      test
        .then((result) => {

          // Set data from speed test results
          self.ping = Math.round(result.ping.latency);
          // 125000 bytes in a Megabit
          self.dlspeed = Math.round((result.download.bandwidth / 125000) * 100) / 100;
          self.ulspeed = Math.round((result.upload.bandwidth / 125000) * 100) / 100;

          // Set sensor vaules from data
          self.Sensor.getCharacteristic(
            Characteristic.CurrentTemperature
          ).updateValue(self.dlspeed);
          self.Sensor.getCharacteristic(
            Characteristic.DownloadSpeed
          ).updateValue(self.dlspeed);
          self.Sensor.getCharacteristic(Characteristic.UploadSpeed).updateValue(
            self.ulspeed
          );
          self.Sensor.getCharacteristic(Characteristic.Ping).updateValue(
            self.ping
          );

          // Log results
          self.log("Download: " + self.dlspeed + " Mbps");
          self.log("Upload: " + self.ulspeed + " Mbps");
          self.log("Ping: " + self.ping + " ms");

          setTimeout(function () {
            self.getData();
          }, self.interval);
        })
        .catch((err) => {
          self.log('An error occured: ' + err + ' - Trying again in 1 min');
          setTimeout(function () {
            self.getData();
          }, 60000);
        });
    } catch (err) {
      self.log("A fatal error occured: " + err);
    }
  },

  getHistory: function() {
    const self = this;
        
    if (self.dlspeed != 0 && self.ulspeed != 0 && self.ping != 0) {
      self.historyService.addEntry({
        time: moment().unix(),
        temp: self.dlspeed,
        pressure: self.ping,
        humidity: self.ulspeed
      });
    }
    setTimeout(function() {
      self.getHistory();
    }, 8 * 60 * 1000); //every 8 mins
  },

  identify: function(callback) {
    this.log(this.name + ': Identified!');
    callback();
  }

};
