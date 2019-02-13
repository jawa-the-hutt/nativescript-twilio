import { Observable } from 'tns-core-modules/data/observable';
import * as dialogs from 'tns-core-modules/ui/dialogs';
import { isAndroid } from 'tns-core-modules/platform';

import * as Permissions from 'nativescript-permissions';
import { getAccessToken, setupCallListener, Twilio } from 'nativescript-twilio';

declare var android: any;

export class HelloWorldModel extends Observable {
  public message: string;
  public senderPhoneNumber: string = '+34606039750';
  // public phoneNumber: string = '+639171137700';
  public phoneNumber: string = '+34605264081';
  public option1: any = {
    key: '',
    value: '',
  };
  public option2: any = {
    key: '',
    value: '',
  };
  private twilio: Twilio;

  constructor() {
    super();

    if (isAndroid) {
      Permissions.requestPermission(android.Manifest.permission.RECORD_AUDIO, 'Needed for making calls').then(() => {
        console.log('Permission granted!');
      }).catch(() => {
        console.log('Permission is not granted :(');
      });
    }

    const callListener = {
      onConnectFailure(call, error) {
        dialogs.alert(`connection failure: ${error}`);
      },
      onConnected (call) {
        dialogs.alert(`call connected`);
      },
      onDisconnected (call) {
        dialogs.alert('disconnected');
      }
    };

    setupCallListener(callListener);
  }

  public onCall(): void {
    getAccessToken()
      .then((token) => {
        console.log(`Twilio access token: ${token}`);

        this.twilio = new Twilio(token);

        let options = {};
        if (this.option1.key) {
          options[this.option1.key] = this.option1.value
        }
        if (this.option2.key) {
          options[this.option2.key] = this.option2.value
        }

        console.log('Calling to ', this.phoneNumber);
        let call = this.twilio.makeCall(this.senderPhoneNumber, this.phoneNumber, options);

        setTimeout(() => {
          console.log('Set call to the speaker after 5 seconds...');
          this.twilio.toggleAudioOutput(true);
        }, 5000);
      })
    .catch((error) => {
      console.error(error);
      dialogs.alert(error);
    })
  }
}
