import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import * as frameModule from 'tns-core-modules/ui/frame';
import { setupCallListener, setupPushListener } from 'nativescript-twilio';

import { HelloWorldModel } from './main-view-model';

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();

    const callListener = {
        onConnectFailure(call, error) {
          dialogs.alert(`connection failure: ${error}`);
          console.log(call);
        },
        onConnected (call) {
          console.log('call connected');
          console.log(call);
          // TODO: fix the issue of disconnecting the call after navigating
          // to some other page with the call connected
          // this should happen after 8 seconds of connecting the call
          // setTimeout(() => {
          //   debugger;
          //   frameModule.topmost().navigate('detail-page');
          // }, 8000);
        },
        onDisconnected (call) {
          dialogs.alert('disconnected');
          console.log(call);
        }
    };

    setTimeout(() => {
      console.log('setupCallListener!');
      setupCallListener(callListener);
    }, 1000);

    // listener for push notifications (incoming calls)
    const pushListener = {
      onPushRegistered(accessToken, deviceToken) {
        dialogs.alert('push registration succeded');
      },
      onPushRegisterFailure (error) {
        dialogs.alert(`push registration failed: ${error}`);
      },
      onIncomingCall(customParameters) {
        return {
          from: customParameters.subscriber_name
        }
      },
      onAcceptCall(customParameters) {
        console.log('OnAcceptCall fired!', customParameters);
      }
    };
    console.log('Registering push listeners')
    setupPushListener(pushListener);

}
