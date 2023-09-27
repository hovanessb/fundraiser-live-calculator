# Fundraiser Electron Thermometer
<img src="fundraiser.gif" style="width:100%" />
A thermometer you can punch donation amounts and it goes up. It can be used for live events and streams. Built in html using node, express and socket.io. Packaged with electron. 

```start
npm install 

npm start -- starts app

npm run winpackager -- builds 32bit windows exe
```

In order to get an `.exe` in windows from a linux machine, edit `main.js`:

```
// This needs to be uncommented on for a windows build... linux works without this
//  app.commandLine.appendSwitch('no-sandbox');
//  app.commandLine.appendSwitch('disable-gpu');
//  app.commandLine.appendSwitch('disable-software-rasterizer');
//  app.commandLine.appendSwitch('disable-gpu-compositing');
//  app.commandLine.appendSwitch('disable-gpu-rasterization');
//  app.commandLine.appendSwitch('disable-gpu-sandbox');
//  app.commandLine.appendSwitch('--no-sandbox');
//  app.disableHardwareAcceleration();
```
