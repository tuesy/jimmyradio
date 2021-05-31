# Overview

JimmyRadio is an Altspace app for playing music.

# Usage

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

| Name       | Description                                   |
| ---------- | ----------                                    |
| fmatop10   | selections from the Free Music Archive Top 10 |


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

The sound files should be hosted somewhere publically accessible. This example uses files uploaded to https://account.altvr.com/audio_clips, which will supports .wav and .ogg formats. Please only upload files you have the rights to use. The Free Music Archive (https://freemusicarchive.org/) is a good place to start, though you'll need a tool (e.g. https://www.online-convert.com/) to convert .mp3 files to .ogg. The tracks will play in the order listed in the file.

Click "Create" and then click "Copy to Clipboard" next to the ID. This is the value you'll need for the "content_pack" parameter:

> ...?content_pack=\<your-id-here\>

# Development
* Fork this repo
* Create a Heroku app and link it to your github repo
* Enable auto deploys from github
* In Altspace:
  * Open World Editor > Altspace > Basics > SDK App
  * `ws://<your subdomain>.herokuapp.com` (port 80)
  * Click Confirm
