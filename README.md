# @mobilyte/nativescript-quiet

This is a [**NativeScript**](https://nativescript.org) wrapper around the [**Quiet Project**](https://github.com/quiet/quiet), which enables the transfer of data using sound as the transfer medium. This has a number of benefits:

- Super cross-platform. (You just need a microphone and a speaker.)
- Broadcast to devices within range without pairing.
- No network connection required.

Quiet can even go _ultrasonic_, allowing us to communicate without impacting on noise levels that are perceptible by human ears.

Try the awesome online demo [**here**](https://quiet.github.io/quiet-js/).


## ✍️ Usage
This project exposes high level functionality to send and receive messages using near-ultrasound. Simply start the library, use `NativescriptQuiet.sendMessage(messege,profile)` to transmit a message string and `NativescriptQuiet.receiveMessage(profile)` to listen to receive sent messages.
#### import package 
```javascript
import { NativescriptQuiet } from '@mobilyte/nativescript-quiet';
```
#### To send
```javascript
 NativescriptQuiet.sendMessage(this.messageToSend, 'audible')
  .then((res) => {
    console.log('Sent ' + this.messageToSend);
  })
  .catch((err) => {
    console.log(err);
  })
}
```
#### To receive
```javascript
 // Start listening. (This will ask for microphone permissions!)
 NativescriptQuiet.receiveMessage('audible')
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```
## License

Apache License Version 2.0
