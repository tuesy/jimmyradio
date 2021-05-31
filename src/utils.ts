import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";

export function canManageRadio(user: MRE.User) : boolean{
  let roles = user.properties['altspacevr-roles'].split(',');
  return roles && (roles.includes('moderator') || roles.includes('terraformer') || roles.includes('host'))
}
