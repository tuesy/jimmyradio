# Overview

JimmyRadio is an Altspace app for playing music.

# Usage

## Known Issues

* If the host leaves or reenters, the music stops playing and controls don't work (restart the app)
* There's no way to automatically skip to the next song when the current one finishes (click Next)

## Spawning the App

You can place it manually using:

```
wss://jimmyradio.herokuapp.com/
```

## Stations

You can choose a preset station (more coming soon):

```
wss://jimmyradio.herokuapp.com/?station=fmatop10
```

| Name       | Description                        |
| ---------- | ----------                         |
| fmatop10   | Free Music Archive Top 10 All Time |


## Content Packs
You can load your own sound files by specifying a Content Pack:

```
wss://jimmyradio.herokuapp.com/?content_pack=1748961296881025140
```

To create your own, start by navigating to http://account.altvr.com/content_packs/new. Give it a name and fill in the "Content" field with links to your own sound files in this format:

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

The tracks should in .ogg format and hosted somewhere publically accessible. This example uses files uploaded to Altspace (https://account.altvr.com/audio_clips), which will convert the most common formats to .ogg for you. Please only upload files you have the rights to use. The Free Music Archive (https://freemusicarchive.org/) is a good place to start. The tracks will play in the order listed in the file.

Click "Create" and then click "Copy to Clipboard" next to the ID. This is the value you'll need for the "content_pack" parameter:

> ...?content_pack=\<your-id-here\>

## Volume
There are hidden volume controls next to the help button on the back of the boombox. You can also preset the volume between 0.0 and 1.0 (default is 0.2):

```
wss://jimmyradio.herokuapp.com/?volume=0.1
```

# Development
* Fork this repo
* Create a Heroku app and link it to your github repo
* Enable auto deploys from github
* In Altspace:
  * Open World Editor > Altspace > Basics > SDK App
  * `ws://<your subdomain>.herokuapp.com` (port 80)
  * Click Confirm
