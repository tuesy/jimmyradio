# Overview

![Boombox Front](https://github.com/tuesy/jimmyradio/blob/main/front.png?raw=true)
![Boombox Back](https://github.com/tuesy/jimmyradio/blob/main/back.png?raw=true)

JimmyRadio is an Altspace app (MRE) for playing music. Hosts can use it to play intro/outro music for their Event or add some ambience while chatting with friends in their World. JimmyRadio can only be managed by hosts so you're in control.

# Usage

## Spawning the App

You can place it manually (I hope to get it featured so you can spawn it from the World Editor):

```
wss://jimmyradio.herokuapp.com/
```

The default song was created for the Altspace Street Hoops World. Not too shabby if you want something quickly.

## Stations

You can choose from a few stations each containing a short playlist of songs:

```
wss://jimmyradio.herokuapp.com/?station=fmatop10
```

| Name                | Description                        |
| ----------          | ----------                         |
| fmatop10            | Free Music Archive Top 10 All Time |
| more coming soon... |                                    |


## Content Packs
You can load your own songs by specifying a Content Pack:

```
wss://jimmyradio.herokuapp.com/?content_pack=1748961296881025140
```

### How to Create a Content Pack

Start by navigating to http://account.altvr.com/content_packs/new. Enter a name and fill in the "Content" field with links to your own sound files in this format:

```javascript
{
  "tracks": [
    {
      "uri": "https://cdn-content-ingress.altvr.com/uploads/audio_clip/audio/1168441484869894861/inner_light.ogg",
      "name": "Inner Light"
    },
    {
      "uri": "https://cdn-content-ingress.altvr.com/uploads/audio_clip/audio/1749218506424975825/Broke_For_Free_-_Night_Owl.ogg",
      "name": "Broke For Free - Night Owl"
    }
  ]
}
```

This example shows two songs each with a link to a .ogg file where we'll download the song from and a name that will be displayed on the back of the boombox when playing. You can convert your songs to .ogg format and host them yourself on a service like OneDrive or you can upload them to Altspace as an Audio Clip (see "How to Create an Audio Clip" below). The songs will be loaded in the order listed.

Click "Create" and then click "Copy to Clipboard" next to the Content Pack ID. This is the value you'll need for the "content_pack" parameter:

> ...?content_pack=\<your-id-here\>

### How to Create an Audio Clip

You can upload audio files for use in your Worlds and MREs by creating Audio Clips. Start by navigating to https://account.altvr.com/audio_clips. Enter a name and choose a file under "Audio". There are number of supported formats but everything will be converted to .ogg because it works best in Altspace. When you've chosen your file, click "Create Audio Clip". If successful, you'll see a long url to a .ogg file. Click "Copy to Clipboard". Please only upload files you have the rights to use. Where do you find songs you can use? The Free Music Archive (https://freemusicarchive.org/) is a good place to start.

## Volume

![Volume Controls](https://github.com/tuesy/jimmyradio/blob/main/volume-controls.png?raw=true)

Unfortunately, MRE audio does not seem to be adjustable by the audio controls in the Altspace menu (Menu > Settings > Audio) except for the Master Volume control, so users will not be able to control their individual volume. The volume, however, is spatialized so as you get farther away it'll get quieter. I've set the default volume to 0.2 (on a 0.0 - 1.1 scale) to try to make it sound like a a real-world boombox. There are hidden volume controls next to the help button on the back of the boombox for hosts and moderators. You can also preset the volume with a parameter:

```
wss://jimmyradio.herokuapp.com/?volume=0.1
```

# Known Issues

* There's no way to automatically skip to the next song when the current one finishes (click Next)

# Development
* Fork this repo
* Create a Heroku app and link it to your github repo
* Enable auto deploys from github
* In Altspace:
  * Open World Editor > Altspace > Basics > SDK App
  * `ws://<your subdomain>.herokuapp.com` (port 80)
  * Click Confirm
