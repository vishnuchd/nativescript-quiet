// required manually to setup 'console'
const receiver = require('./receiver.android');
require("@nativescript/core/globals")
onmessage = async function(msg) {
  if (msg.data == "close") {
    close();
    return;
  }
  let data = receiver.receiverAndroid(msg.data.profile)
  console.log(data)
  postMessage({ res:  "success", data: ""+data })
  debugger
}

onerror = function (e) {
  debugger
  console.log(e)
  // return true to not propagate to main
}

function progressCallback(value) {
  postMessage({ res: "progress", value: value });
}
