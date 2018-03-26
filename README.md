# homebridge-broadband v1
Homebridge Plugin for Broadband speed measurement as Temperature sensor


# Homebridge plugin for checking your broadband speed

This homebridge plugin exposes a new temperature sensor to HomeKit to see your broadband speed at home. It also has new characteristics to see the download- and upload speed, also your ping within i.e. Elgato EVE app. It also supports Fakegato.


# Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

 ```sudo npm install -g homebridge-broadband```
 
 
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
      "maxTime": 5,
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
| maxTime | No | The maximum length of a single test run in seconds (Default: 5s) |
| interval | No | Interval for checing the broadband in mins (Default: 60min) |


## Supported clients

This plugin have been verified to work with the following apps on iOS 11.2.5:

* Apple Home
* Elgato Eve 


## Known issues | TODO

///


## Contributing

You can contribute to this homebridge plugin in following ways:

- [Report issues](https://github.com/SeydX/homebridge-sonybravia-platform/issues) and help verify fixes as they are checked in.
- Review the [source code changes](https://github.com/SeydX/homebridge-sonybravia-platform/pulls).
- Contribute bug fixes.
- Contribute changes to extend the capabilities

Pull requests are accepted.
