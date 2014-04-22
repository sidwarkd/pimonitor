## PiMonitor Overview
PiMonitor is a rapidly-developed knockoff of CommandPi, an iOS app for monitoring CPU usage, memory usage, and internal temperature of your Raspberry Pi. It was created in realtime for [episode #16 of &micro;Casts][episode] and showcases how you can combine the Raspberry Pi, NodeJS, AngularJS, and Bootstrap to quickly create a project prototype.

## How to Use It
You can watch the [&micro;Cast episode][episode] to see the program developed but if you just want to grab the source code and start messing around you can clone this repository right on the Raspberry Pi.

Once the repo is present you need to ensure you have NodeJS installed. You can test this by running:

```bash
node --version
```

If it is not installed I've found the easiest way to get it is by following the instructions found at http://revryl.com/2014/01/04/nodejs-raspberry-pi/.

With NodeJS and NPM installed you need to install the dependencies by running the following command from within the **pimonitor** folder:

```bash
npm install
```

This can take several minutes on the Pi depending on connection speed. Once finished you can start the PiMonitor server running on port 3000 with the command:

```bash
node bin/www
```

### Following Along
If you wish to follow along in the video and create the project from scratch you will need one additional dependency and that's the ExpressJS generator which can be installed from the command line (after NodeJS and NPM are installed) with:

```bash
sudo npm install -g express-generator
```

## Adding Features
If you want to enhance your monitor to report on more items like disk space or even external sensors you have a couple of options.

1. Add additional return data to the **update** function in pinode_stats.js
2. Create a new route in Express following the same pattern as the /stats route and call that route from the AngularJS code

## Questions
If you have any questions or get stuck I'm happy to help. My current contact information can be found in [my profile][profile].

[episode]: http://blog.microcasts.tv/2014/04/14/pi_express_bootstrap_angular/
[profile]: https://github.com/sidwarkd