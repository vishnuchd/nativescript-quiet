import { NativescriptQuietCommon } from './common';
import * as application from '@nativescript/core/application';
import FrameTransmitterConfig = org.quietmodem.Quiet.FrameTransmitterConfig;
import FrameTransmitter = org.quietmodem.Quiet.FrameTransmitter;


export class NativescriptQuiet extends NativescriptQuietCommon {
  public static sendMessage(message: string, profile: string): Promise<any> {
    try {
      return new Promise<string>((resolve, reject) => {
        if (message == '' || message === undefined) {
          reject('Enter message');
        } else if (profile == '' || profile === undefined) {
          reject('Enter sound profile');
        }

        let transmitterConfig = new FrameTransmitterConfig(application.android.context, profile);
        let transmitter = new FrameTransmitter(transmitterConfig);
        let payload = new java.lang.String(message);
        let bytes = payload.getBytes();
        transmitter.send(bytes);
        resolve('Message Sent');
      });
    } catch (e) {
      console.log(e);
    }
  }

  public static async receiveMessage(profile) {
    let androidSupport = null;
    let FRAME_RECEIVER = null;

    setupSupport();
    return new Promise((resolve, reject) => {
      if (hasRecordAudioPermission()) {
        subscribeToFrames();
      } else {
        requestPermission();
      }

      function hasRecordAudioPermission() {
        return androidSupport.content.ContextCompat.checkSelfPermission(getContext(), android.Manifest.permission.RECORD_AUDIO) == global.android.content.pm.PackageManager.PERMISSION_GRANTED;
      }

       function subscribeToFrames() {
        let worker;
        if (global.TNS_WEBPACK) {
          let GrayscaleWorker = require("nativescript-worker-loader!./worker.js");
          worker = new GrayscaleWorker();
        } else {
          worker = new Worker("./worker.js");
        }

         worker.postMessage({ profile:profile});
         worker.onmessage = function (msg) {
        debugger
          if (msg.data.res == "success") {
           debugger
            resolve(msg.data.data)
            console.log(msg.data.data );
            worker.postMessage({ profile:profile});
            // w.postMessage("close");
            //w.terminate();

          }
        }
      }

      function handlePermissionResults(args) {
        debugger;
        const length = args.permissions.length;
        for (let i = 0; i < length; i++) {

          //noinspection RedundantIfStatementJS,JSUnresolvedVariable,JSUnresolvedFunction
          if (args.grantResults[i] === global.android.content.pm.PackageManager.PERMISSION_GRANTED) {
          } else {
            debugger;
            reject('permission denied');
          }
        }
      }

      function requestPermission() {
        try {
          const activity = application.android.foregroundActivity || application.android.startActivity;
          androidSupport.app.ActivityCompat.requestPermissions(activity, [android.Manifest.permission.RECORD_AUDIO], 1000);
          application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, handlePermissionResults);
        } catch (e) {
          console.dir(e);
          debugger;
        }
      }
    });

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

    function setupSupport() {
      if (hasAndroidX()) {
        androidSupport = global.androidx.core;
      } else if (hasSupportVersion4()) {
        androidSupport = global.android.support.v4;
      }
    }

    /**
     * Checks to see if v4 is installed and has the proper calls with it
     * @returns {boolean}
     */
    function hasSupportVersion4() {
      //noinspection JSUnresolvedVariable
      if (!global.android.support || !global.android.support.v4 || !global.android.support.v4.content || !global.android.support.v4.content.ContextCompat || !global.android.support.v4.content.ContextCompat.checkSelfPermission) {
        return false;
      }
      return true;
    }

    /**
     * Checks to see if androidx is installed and has the proper calls for it.
     * @returns {boolean}
     */
    function hasAndroidX() {
      //noinspection JSUnresolvedVariable
      if (!global.androidx || !global.androidx.core || !global.androidx.core.content || !global.androidx.core.content.ContextCompat || !global.androidx.core.content.ContextCompat.checkSelfPermission) {
        return false;
      }
      return true;
    }
  }

}
