import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";
import * as Utils from "./utils";

const DELAY = 1000;

// minimize performance impact by downloading serially and pausing in between
export async function load(app: App, name: string, uri: string){
  let sound = app.assets.sounds.find(x => x.name === name);
  if(!sound){
    Utils.debug(`downloading ${name}`);
    sound = app.assets.createSound(name, { uri: uri } );
    await sound.created; // wait for the data to be completely downloaded
    await Utils.delay(DELAY);
  }
  return sound;
}
