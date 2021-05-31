import * as MRE from '@microsoft/mixed-reality-extension-sdk';

const fetch = require('node-fetch');
const DEBUG = false;

export default class JimmyRadio {
	public assets: MRE.AssetContainer;

	constructor(public context: MRE.Context, public params: MRE.ParameterSet) {
	  this.assets = new MRE.AssetContainer(context);

    this.context.onStarted(() => this.started());
    this.context.onUserLeft(user => this.userLeft(user));
    this.context.onUserJoined(user => this.userJoined(user));
	}

	private async started() {
	}

  private userLeft(user: MRE.User) {
  }

  private userJoined(user: MRE.User) {
  }

  private loadContentPack(params: MRE.ParameterSet, user: MRE.User){
    // if(!params.content_pack){ return }
    // let uri = 'https://account.altvr.com/api/content_packs/' + params.content_pack + '/raw.json';

    // fetch(uri)
    //   .then((res: any) => res.json())
    //   .then((json: any) => {
    //     let importedPolls = Object.assign({}, json).favorites;
    //     if(!importedPolls){ return }
    //     this.createFavoritesButtonFor(this.context, user, importedPolls);
    //   })
  }

  // Load Favorites from the /polls folder if you pass ?poll=<name>
  // e.g. ws://10.0.1.119:3901?poll=quickstart
  private loadBundledPoll(params: MRE.ParameterSet, user: MRE.User){
    // if(!params.poll){ return }

    // let json = null;

    // // handle if the poll doesn't exist
    // try{
    //   json = require(`../polls/${params.poll}.json`);
    // }
    // catch{
    //   return;
    // }

    // if(DEBUG){ console.log(json) };

    // let importedPolls = Object.assign({}, json).favorites;

    // if(DEBUG){ console.log(importedPolls) };

    // if(!importedPolls){ return }
    // this.createFavoritesButtonFor(this.context, user, importedPolls);
  }
}