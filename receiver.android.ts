import FrameReceiverConfig = org.quietmodem.Quiet.FrameReceiverConfig;
import FrameReceiver = org.quietmodem.Quiet.FrameReceiver;
import * as application from '@nativescript/core/application';

import ('@nativescript/core/globals');

let FRAME_RECEIVER = null;

export function receiverAndroid(profile) {
  if (FRAME_RECEIVER != null) {
    FRAME_RECEIVER = null;
  }

  let receiverConfig = new FrameReceiverConfig(getContext(), profile);
  FRAME_RECEIVER = new FrameReceiver(receiverConfig);
  let buf =   Array.create("byte", 1024)

  while (FRAME_RECEIVER != null) {
    // set receiverAndroid to block until a frame is received
    // by default receivers are nonblocking
    FRAME_RECEIVER.setBlocking(3,500000);
    let recvLen = 0;
    let immutableBuf;
    try {
      recvLen = FRAME_RECEIVER.receive(buf);
      immutableBuf = new java.lang.String(java.util.Arrays.copyOfRange(buf, 0, recvLen), "UTF-8")//java.util.Arrays.copyOf(buf, recvLen);
     return  immutableBuf;
    } catch (error) {
      console.log(error)

    }
  }

}

/**
 * gets the current application context
 * @returns {*}
 * @private
 */
function getContext() {
  if (application.android.context) {
    return application.android.context;
  }
  if (typeof application.getNativeApplication === 'function') {
    let ctx = application.getNativeApplication();
    if (ctx) {
      return ctx;
    }
  }

  //noinspection JSUnresolvedFunction,JSUnresolvedVariable
  let ctx = java.lang.Class.forName('android.app.AppGlobals').getMethod('getInitialApplication', null).invoke(null, null);
  if (ctx) return ctx;

  //noinspection JSUnresolvedFunction,JSUnresolvedVariable
  ctx = java.lang.Class.forName('android.app.ActivityThread').getMethod('currentApplication', null).invoke(null, null);
  if (ctx) return ctx;

  return ctx;
}


