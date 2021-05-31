import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import * as UI from "./ui";

export type TrackDescriptor = {
  name: string,
  uri: string,
  artist?: string
};

const fetch = require('node-fetch');
const DEFAULT_TRACK: TrackDescriptor = {name: 'Street Hoops World Theme', uri: 'self_and_other_loop.ogg', artist: 'Altspace'};
const DEBUG = true;

export default class App {
	public assets: MRE.AssetContainer;
  private tracks: MRE.Sound[] = [];
  private trackPlaying = false;
  private trackSoundInstance: MRE.MediaInstance = null;
  private trackIndex = 0;
  private currentTrack: MRE.Sound = null;
  private defaultMultiple = false;

  public totalTracks = 0;
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
    this.params.test = 'content_pack';

    switch(this.params.test){
      case 'content_pack':
        this.params.content_pack = '1748961296881025140';
        break;
      default:
        break;
    }

    await this.loadTracks();

    if(DEBUG){ console.log(this.tracks) }

    // cache this for next/previous buttons
    this.totalTracks = this.assets.sounds.length;

    // choose the first track
    this.currentTrack = this.tracks[0];

    // controls
    UI.createBoombox(this);
    this.wireUpButtons();
	}

  private userLeft(user: MRE.User) {
  }

  private userJoined(user: MRE.User) {
  }

  private async loadTracks(){
    // load both import options in parallel
    // => should only be using one option
    await Promise.all([
      this.loadContentPack(),
      this.loadStation()
    ]).catch();

    await this.loadDefault();
  }

  private async loadContentPack(){
    if(!this.params.content_pack){ return }

    let uri = 'https://account.altvr.com/api/content_packs/' + this.params.content_pack + '/raw.json';

    await fetch(uri)
      .then((res: any) => res.json())
      .then((json: any) => {
        let importedTracks = Object.assign({}, json).tracks;
        if(!importedTracks){ return }
        for(let i=0; i < importedTracks.length; i++){
          let track = importedTracks[i];
          this.tracks.push(this.assets.createSound(track.name, { uri: track.uri }));
        }
        if(DEBUG){ console.log(`Imported ${this.tracks.length} track(s) from ${uri}`) }
      })
  }

  private async loadDefault() {
    if(this.assets.sounds.length > 0){ return }

    if(DEBUG){ console.log('Loading default tracks') }

    this.tracks.push(await this.assets.createSound(DEFAULT_TRACK.name, { uri: DEFAULT_TRACK.uri }));
    // this.tracks.push(await this.assets.createSound('Track1', { uri: 'self_and_other_loop.ogg' }));
    // this.tracks.push(await this.assets.createSound('Track2', { uri: 'JazzLoopstereo.ogg' }));
    // this.tracks.push(await this.assets.createSound('Track3', { uri: 'https://cdn-content-ingress.altvr.com/uploads/audio_clip/audio/1168441484869894861/inner_light.ogg' }));
  }

  private async loadStation(){
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


  private async playTrack(track: MRE.Sound) {
    if(DEBUG){ console.log(`[JimmyRadio][Playing] ${track.name} - ${this.trackIndex + 1} of ${this.totalTracks}`) }
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
        this.changeTracks(user, false);
      });

      // Next Button
      buttonBehaviorNext.onClick(async (user) => {
        this.changeTracks(user, true);
      });
    }
  }

  private changeTracks(user: MRE.User, next: boolean){
    if (!this.canManageRadio(user))
      return;

    // stop if currently playing
    if (this.trackPlaying) {
      this.trackSoundInstance.pause();
      this.trackPlaying = false;
    }

    // switch tracks
    if(next){
      this.trackIndex += 1;
      if(this.trackIndex > this.totalTracks - 1)
        this.trackIndex = 0;
    }
    else{
      this.trackIndex -= 1;
      if(this.trackIndex < 0)
        this.trackIndex = this.totalTracks - 1;
    }
    this.currentTrack = this.tracks[this.trackIndex];

    // play
    this.playTrack(this.currentTrack);
    this.trackPlaying = true;
  }


  private canManageRadio(user: MRE.User) : boolean{
    let roles = user.properties['altspacevr-roles'].split(',');
    return roles && (roles.includes('moderator') || roles.includes('terraformer') || roles.includes('host'))
  }
}