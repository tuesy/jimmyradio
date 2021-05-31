import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import * as UI from "./ui";

const fetch = require('node-fetch');
const DEBUG = false;

export default class App {
	private assets: MRE.AssetContainer;
  private tracks: MRE.Sound[] = [];
  private trackPlaying = false;
  private trackSoundInstance: MRE.MediaInstance = null;
  private trackIndex = 0;
  public totalTracks = 0;
  private currentTrack: MRE.Sound = null;

  public buttonPlay: MRE.Actor;
  public buttonPrevious: MRE.Actor;
  public buttonNext: MRE.Actor;

	constructor(public context: MRE.Context, public params: MRE.ParameterSet) {
	  this.assets = new MRE.AssetContainer(context);

    this.context.onStarted(() => this.started());
    this.context.onUserLeft(user => this.userLeft(user));
    this.context.onUserJoined(user => this.userJoined(user));
	}

	private async started() {
    await this.loadTracks();
    UI.createBoombox(this);
    await this.wireUpButtons();
	}

  private userLeft(user: MRE.User) {
  }

  private userJoined(user: MRE.User) {
  }

  private async loadTracks() {
    this.tracks.push(await this.assets.createSound('Track1', { uri: 'self_and_other_loop.ogg' }));
    this.tracks.push(await this.assets.createSound('Track2', { uri: 'JazzLoopstereo.ogg' }));

    // calculate total for next/previous buttons
    this.totalTracks = this.assets.sounds.length;

    // setup default track
    this.currentTrack = this.tracks[this.trackIndex];
  }

  private async playTrack(track: MRE.Sound) {
    console.log(`Track: ${track.name} - ${this.trackIndex + 1} of ${this.totalTracks}`);
    this.trackSoundInstance = this.buttonPlay.startSound(track.id,
      { volume: .25, looping: true, doppler: 0, spread: 0.75, });
  }

  private async wireUpButtons(){
    const buttonBehaviorPlay = this.buttonPlay.setBehavior(MRE.ButtonBehavior);

    let firstPlay = true;

    // Play Button
    buttonBehaviorPlay.onClick(async (user) => {
      if (!this.canManageRadio(user))
        return;

      if (firstPlay) {
        firstPlay = false;
        this.trackPlaying = true;
        await this.playTrack(this.currentTrack);
      } else if (this.trackPlaying) {
        this.trackSoundInstance.pause();
        this.trackPlaying = false;
      } else if (!this.trackPlaying) {
        this.trackSoundInstance.resume();
        this.trackPlaying = true;
      }
    });

    if(this.totalTracks > 1){
      const buttonBehaviorPrevious = this.buttonPrevious.setBehavior(MRE.ButtonBehavior);
      const buttonBehaviorNext = this.buttonNext.setBehavior(MRE.ButtonBehavior);

      // Previous Button
      buttonBehaviorPrevious.onClick(async (user) => {
        if (!this.canManageRadio(user))
          return;

        // stop if currently playing
        if (this.trackPlaying) {
          this.trackSoundInstance.pause();
          this.trackPlaying = false;
        }

        // switch to previous track
        this.trackIndex -= 1;
        if(this.trackIndex < 0)
          this.trackIndex = this.totalTracks - 1;
        this.currentTrack = this.tracks[this.trackIndex];

        // play
        this.playTrack(this.currentTrack);
        this.trackPlaying = true;
      });

      // Next Button
    }
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

  private canManageRadio(user: MRE.User) : boolean{
    let roles = user.properties['altspacevr-roles'].split(',');
    return roles && (roles.includes('moderator') || roles.includes('terraformer') || roles.includes('host'))
  }
}