import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";

const DEBUG = false;

export function canManageRadio(user: MRE.User) : boolean{
  let roles = user.properties['altspacevr-roles'].split(',');
  return roles && (roles.includes('moderator') || roles.includes('terraformer') || roles.includes('host'))
}

export function debug(message: string){
  if(!DEBUG)
    return;

  console.log(`[JimmyRadio][${Date.now().toString()}] - ${message}`);
}

export function info(message: string){
  console.log(`[JimmyRadio][${Date.now().toString()}] - ${message}`);
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}
