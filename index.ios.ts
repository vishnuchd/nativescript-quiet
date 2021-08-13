import { NativescriptQuietCommon } from './common';

export class NativescriptQuiet extends NativescriptQuietCommon {
	/*
  Transmit message
   */
	public static sendMessage(message: string, profile: string) {
		return new Promise((resolve, reject) => {
			console.log('ios' + message + ' ' + profile);
			let tx = QMFrameTransmitter.new().initWithConfig(QMTransmitterConfig.new().initWithKey('audible'));

			const frame_str = 'Hello, World how you people are doing, its very good to hear from you';

			const text = NSString.stringWithString(frame_str);
			const data = text.dataUsingEncoding(NSUTF8StringEncoding);
			const base64String = data.base64EncodedStringWithOptions(0);
			debugger;
			let frame1 = NSData.data().initWithBase64Encoding(base64String); // . initWithBase64Encoding(frame)// (frame_str)
			tx.send(frame1);
			CFRunLoopRun();
			tx.close();
			resolve('message sent ios');
		});
	}
	/*
  Receive message
   */
	public static receiveMessage() {
		return new Promise((resolve, reject) => {
			debugger;

			let rx = QMFrameReceiver.new();

			function recv_callback(data) {
				console.log('%s\n', data);
				resolve(data);
			}

			function request_callback() {
				rx.initWithConfig(QMReceiverConfig.new().initWithKey('audible'));
				rx.setReceiveCallback(recv_callback);
			}

			AVAudioSession.new().requestRecordPermission((allowed) => {
				if (allowed) {
					request_callback();
				} else {
					reject('Record permissions denied');
					console.log('Record permissions denied');
				}
			});
			CFRunLoopRun();
			if (rx != null) {
				rx.close();
			}
		});
	}
}
