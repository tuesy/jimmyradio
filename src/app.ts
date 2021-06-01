import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import * as UI from "./ui";
import * as Utils from "./utils";

export type TrackDescriptor = {
  name: string,
  uri: string,
  artist?: string
};

const fetch = require('node-fetch');
const DEFAULT_TRACK: TrackDescriptor = {name: 'Street Hoops World Theme', uri: 'self_and_other_loop.ogg', artist: 'Altspace'};
const DEBUG = true;

function log(message: string): string{
  if(!DEBUG)
    return;

  console.log(`[JimmyRadio][${Date.now().toString()}] - ${message}`);
}

export default class App {
  private tracks: MRE.Sound[] = [];
  private trackPlaying = false;
  private trackIndex = 0;
  private defaultMultiple = false;
  public defaultVolume = 0.2;
  public volumeIncrement = 0.05; // range is 0.0-1.0

  public assets: MRE.AssetContainer;
  public trackSoundInstance: MRE.MediaInstance = null;
  public buttonPlay: MRE.Actor;
  public buttonPrevious: MRE.Actor;
  public buttonNext: MRE.Actor;
  public trackInfo: MRE.Actor;
  public helpButton: MRE.Actor;
  public currentVolume = this.defaultVolume;
  public volumeUp: MRE.Actor;
  public volumeDown: MRE.Actor;

	constructor(public context: MRE.Context, public params: MRE.ParameterSet) {
	  this.assets = new MRE.AssetContainer(context);

    this.context.onStarted(() => this.started());
    this.context.onUserLeft(user => this.userLeft(user));
    this.context.onUserJoined(user => this.userJoined(user));
	}

	private async started() {
    log(`begin started()`);

    switch(this.params.test){
      case 'content_pack':
        this.params.content_pack = '1748961296881025140';
        this.params.station = null;
        break;
      case 'station':
        this.params.content_pack = null;
        this.params.station = 'fmatop10'
        break;
      case 'empty':
        this.params.content_pack = null;
        this.params.station = null;
        break;
      default:
        break;
    }

    // preset the volume
    if(this.params.volume){
      let userVolume = Number(this.params.volume);
      if(userVolume > 0 && userVolume < 1){
        this.currentVolume = userVolume;
      }
    }
    log(`Volume: ${this.currentVolume}`);

    this.loadContentPack(),
    this.loadStation();

    if(DEBUG){ console.log(this.tracks) }

    // controls
    UI.createBoombox(this);
    this.wireUpButtons();
    UI.createHelpButton(this);
    UI.createVolumeButtons(this);

    log(`end started()`);
	}

  private totalTracks(): number{
    return this.assets.sounds.length;
  }

  private currentTrack(): MRE.Sound{
    return this.tracks[this.trackIndex];
  }

  private userLeft(user: MRE.User) {
  }

  private userJoined(user: MRE.User) {
  }

  private async loadContentPack(){
    if(!this.params.content_pack){ return }

    let uri = 'https://account.altvr.com/api/content_packs/' + this.params.content_pack + '/raw.json';

    fetch(uri)
      .then((res: any) => res.json())
      .then((json: any) => {
        let importedTracks = Object.assign({}, json).tracks;
        if(!importedTracks){ return }
        for(let i=0; i < importedTracks.length; i++){
          let track = importedTracks[i];
          this.tracks.push(this.assets.createSound(track.name, { uri: track.uri }));
        }
        log(`Imported ${this.tracks.length} track(s) from ${uri}`);
      })
  }

  private async loadDefault() {
    if(this.assets.sounds.length > 0){ return }

    log('Loading default tracks');

    this.tracks.push(await this.assets.createSound(DEFAULT_TRACK.name, { uri: DEFAULT_TRACK.uri }));
    // this.tracks.push(this.assets.createSound('Track1', { uri: 'self_and_other_loop.ogg' }));
    // this.tracks.push(this.assets.createSound('Track2', { uri: 'JazzLoopstereo.ogg' }));
    // this.tracks.push(this.assets.createSound('Track3', { uri: 'https://cdn-content-ingress.altvr.com/uploads/audio_clip/audio/1168441484869894861/inner_light.ogg' }));
  }

  private async loadStation(){
    if(!this.params.station){ return }

    let json = null;

    // handle if the data doesn't exist
    try{
      json = require(`../stations/${this.params.station}.json`);
    }
    catch{
      return;
    }

    // if(DEBUG){ console.log(json) };

    let importedTracks = Object.assign({}, json).tracks;
    if(!importedTracks){ return }
    for(let i=0; i < importedTracks.length; i++){
      let track = importedTracks[i];
      this.tracks.push(this.assets.createSound(track.name, { uri: track.uri }));
    }
    log(`Imported ${this.tracks.length} track(s) from station ${this.params.station}`);
  }

  private async playTrack() {
    let track = this.currentTrack();

    if(!track){
      await this.loadDefault();
      track = this.tracks[0];
    }

    log(`Playing ${track.name} - ${this.trackIndex + 1} of ${this.totalTracks()}`);

    this.trackInfo.text.contents = `${track.name} (${this.trackIndex + 1} of ${this.totalTracks()})`;
    this.trackSoundInstance = this.buttonPlay.startSound(track.id,
      { volume: this.currentVolume, looping: true, doppler: 0, spread: 0.75 });
  }

  private async wireUpButtons(){
    const buttonBehaviorPlay = this.buttonPlay.setBehavior(MRE.ButtonBehavior);

    // Play Button
    buttonBehaviorPlay.onClick(async (user) => {
      if(!Utils.canManageRadio(user))
        return;

      if(this.trackPlaying){
        this.trackSoundInstance.pause();
        this.trackPlaying = false;
      }
      else if (!this.trackSoundInstance){ // first time playing
        await this.playTrack();
        this.trackPlaying = true;
      }
      else if (!this.trackPlaying) {
        this.trackSoundInstance.resume();
        this.trackPlaying = true;
      }
    });

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

  private async changeTracks(user: MRE.User, next: boolean){
    if (!Utils.canManageRadio(user))
      return;

    // stop if currently playing
    if (this.trackPlaying) {
      this.trackSoundInstance.stop();
      this.trackPlaying = false;
    }

    // switch tracks
    if(next){
      this.trackIndex += 1;
      if(this.trackIndex > this.totalTracks() - 1)
        this.trackIndex = 0;
    }
    else{
      this.trackIndex -= 1;
      if(this.trackIndex < 0)
        this.trackIndex = this.totalTracks() - 1;
    }

    // play
    await this.playTrack();
    this.trackPlaying = true;
  }
}