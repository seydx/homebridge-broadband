# homebridge-broadband v1
Homebridge Plugin for Broadband speed measurement as Temperature sensor

[![npm](https://img.shields.io/npm/v/homebridge-broadband.svg?style=flat-square)](https://www.npmjs.com/package/homebridge-broadband)
[![npm](https://img.shields.io/npm/dt/homebridge-broadband.svg?style=flat-square)](https://www.npmjs.com/package/homebridge-broadband)
[![GitHub last commit](https://img.shields.io/github/last-commit/SeydX/homebridge-broadband.svg?style=flat-square)](https://github.com/SeydX/homebridge-broadband)

# Homebridge plugin for checking your broadband speed

This homebridge plugin exposes a new temperature sensor to HomeKit to see your broadband speed at home. It also has new characteristics to see the download- and upload speed, also your ping within i.e. Elgato EVE app. It also supports Fakegato.

See [Images](https://github.com/SeydX/homebridge-broadband/tree/master/images/) for more details.

# Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

 ```sudo npm install -g homebridge-broadband@latest --unsafe-perm```
 
 
 ## Example config.json:

 ```
{
  "bridge": {
      ...
  },
  "accessories": [
    {
      "accessory": "Broadband",
      "name": "Broadband",
      "interval": 60
    }
  ]
}
```


## Options

| **Attributes** | **Required** | **Usage** |
|------------|----------|-------|
| accessory | **Yes** | Must be "Broadband" |
| name | No | Name for the Accessory (Default: Broadband) |
| interval | No | Interval for checing the broadband in mins (Default: 60min) |

See [Example Config](https://github.com/SeydX/homebridge-broadband/blob/master/example-config.json) for more details.

## Supported clients

This plugin have been verified to work with the following apps on iOS 11.2.5:

* Apple Home
* Elgato Eve 


## Known issues | TODO

///


## Contributing

You can contribute to this homebridge plugin in following ways:

- [Report issues](https://github.com/SeydX/homebridge-broadband/issues) and help verify fixes as they are checked in.
- Review the [source code changes](https://github.com/SeydX/homebridge-broadband/pulls).
- Contribute bug fixes.
- Contribute changes to extend the capabilities

Pull requests are accepted.
