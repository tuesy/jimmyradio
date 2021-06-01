import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";
import { VOLUME_INCREMENT } from "./app";
import * as Utils from "./utils";

const SCALE = {x: 1, y: 1, z: 1};
const BUTTON_SCALE = {x: 0.6, y: 0.6, z: 0.6};
const BUTTON_SPACING = 0.12;
const PLATE_DIMENSIONS = { x: 0.15, y: 0.23, z: 0.02 };
const PLATE_COLOR = 0.6;
const BRIGHTNESS = 0.001;
const FONT = MRE.TextFontFamily.Cursive;

export function createBoombox(app: App){
  // boombox body
  const body = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1275632250423083329",
    actor: {
      name: 'BoomboxBody',
      transform: {
        local: {
          position: { x: 0, y: 0, z: 0 },
          rotation: MRE.Quaternion.FromEulerAngles(0, 180 * MRE.DegreesToRadians, 0),
          scale: SCALE
        }
      }
    }
  });

  // big center play button
  const buttonPlay = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1275632554384294231",
    actor: {
      name: 'ButtonPlay',
      transform: {
        local: {
          // Relative position for play button to player { x: 48.042, y: 19.755, z: 7.175 }
          // Doing this so scaling feedback on hover looks uniform.
          position: { x: -0.48, y: 0.2, z: 0.07 },
          scale: BUTTON_SCALE
        }
      },
      parentId: body.id
    }
  });
  app.buttonPlay = buttonPlay;

  // side previous and next buttons
  const backgroundTexture = app.assets.createTexture("bgTex", { uri: 'Boombox.jpg' } );
  const backgroundMaterial = app.assets.createMaterial("bgMat", {
    mainTextureId: backgroundTexture.id,
    mainTextureScale: {x: 0.25, y: 0.25},
    mainTextureOffset: {x: 0, y: 0.2},
    color: new MRE.Color3(PLATE_COLOR, PLATE_COLOR, PLATE_COLOR)
  });

  const buttonPrevious = MRE.Actor.CreatePrimitive(app.assets, {
    definition: {
      shape: MRE.PrimitiveShape.Box,
      dimensions: PLATE_DIMENSIONS
    },
    actor: {
      name: 'ButtonPrevious',
      transform: {
        local: {
          position: { x: buttonPlay.transform.local.position.x + BUTTON_SPACING, y: 0.2, z: 0.07 },
          scale: BUTTON_SCALE
        }
      },
      appearance: {
        materialId: backgroundMaterial.id
      },
      parentId: body.id
    },
    addCollider: true
  });
  MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1238556506320798178",
    actor: {
      name: 'ButtonPreviousOverlay',
      transform: {
        local: {
          position: { x: -0.326, y: -0.55, z: -0.33}, // -x is right, -y is down, -z is into the boombox
          scale: {x: 1.5, y: 1.5, z: 1.5}
        }
      },
      parentId: buttonPrevious.id
    }
  });

  const buttonNext = MRE.Actor.CreatePrimitive(app.assets, {
    definition: {
      shape: MRE.PrimitiveShape.Box,
      dimensions: PLATE_DIMENSIONS
    },
    actor: {
      name: 'ButtonNext',
      transform: {
        local: {
          position: { x: buttonPlay.transform.local.position.x - BUTTON_SPACING, y: 0.2, z: 0.07 },
          scale: BUTTON_SCALE
        }
      },
      appearance: {
        materialId: backgroundMaterial.id
      },
      parentId: body.id
    },
    addCollider: true
  });
  MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1238556842913694653",
    actor: {
      name: 'ButtonNextOverlay',
      transform: {
        local: {
          position: { x: 0.31, y: -0.55, z: -0.33}, // +x is left, -y is down, -z is into the boombox
          scale: {x: 1.5, y: 1.5, z: 1.5}
        }
      },
      parentId: buttonNext.id
    }
  });

  app.buttonPrevious = buttonPrevious;
  app.buttonNext = buttonNext;

  // woofers that may animate later
  const wooferLeft = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1280051826179178604",
    actor: {
      name: 'BoomboxWooferL',
      transform: {
        local: {
          // TODO: Convert to anchor point.
          position: { x: -0.16, y: .21, z: 0.03 },
          scale: SCALE
        }
      },
      parentId: body.id
    }
  });
  const wooferRight = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1280051826179178604",
    actor: {
      name: 'BoomboxWooferR',
      transform: {
        local: {
          // TODO: Convert to anchor point.
          position: { x: -0.81, y: 0.2, z: .03 },
          scale: SCALE
        }
      },
      parentId: body.id
    }
  });

  const trackInfo = MRE.Actor.Create(app.context, {
    actor: {
      name: 'Song Info',
      transform: {
        local: {
          position: { x: 0.48, y: 0.07, z: 0.31 }, // (when looking at the back of the boombox) +x is left, +y is up, +z is towards you
          rotation: MRE.Quaternion.FromEulerAngles(0, 180 * MRE.DegreesToRadians, 0)
        }
      },
      collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } },
      text: {
        contents: 'JimmyRadio',
        height: 0.04,
        anchor: MRE.TextAnchorLocation.MiddleCenter,
        justify: MRE.TextJustify.Center,
        font: FONT
      }
    }
  });
  app.trackInfo = trackInfo;
  app.boombox = body;
}

export function createHelpButton(app: App){
  let text = `Play music in your Events and Worlds. \n\nLearn more at github.com/tuesy/jimmyradio`;

  const button = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: 'artifact:1579238405710021245',
    actor: {
      name: 'Help Button',
      transform: {
        local: {
          position: { x: 0.9, y: 0.35, z: 0.29 },
          rotation: MRE.Quaternion.FromEulerAngles(0, 180 * MRE.DegreesToRadians, 0),
          scale: { x: 0.3, y: 0.3, z: 0.3 }
        }
      },
      collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
    }
   });
  button.setBehavior(MRE.ButtonBehavior).onClick(user => {
    user.prompt(text).then(res => {}).catch(err => { console.error(err) });
  });

  app.helpButton = button;
}

export function createVolumeButtons(app: App){
  const volumeUp = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: 'artifact:1238557506142208451', // black play button
    actor: {
      name: 'Volumn Up Button',
      transform: {
        local: {
          position: { x: 0.996, y: 0.37, z: 0.40 },
          rotation: MRE.Quaternion.FromEulerAngles(0, 180 * MRE.DegreesToRadians, -90 * MRE.DegreesToRadians),
          scale: { x: 0.5, y: 0.5, z: 0.5 }
        }
      },
      collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
    }
   });
  volumeUp.setBehavior(MRE.ButtonBehavior).onClick(user => {
    if(!Utils.canManageRadio(user))
      return;

    let increment = VOLUME_INCREMENT;
    let current = Math.round(app.currentVolume * 100) / 100;
    if(current <= increment)
      increment = increment / 5;

    if((app.currentVolume + increment) <= 1.0){
      app.currentVolume += increment;
      if(app.trackSoundInstance)
        app.trackSoundInstance.setState({volume: app.currentVolume});
    }

    Utils.debug(`Volume: ${app.currentVolume}`);

  });

  const volumeDown = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: 'artifact:1238557506142208451', // black play button
    actor: {
      name: 'Volumn Down Button',
      transform: {
        local: {
          position: { x: 0.63, y: 0.30, z: 0.40 },
          rotation: MRE.Quaternion.FromEulerAngles(0, 180 * MRE.DegreesToRadians, 90 * MRE.DegreesToRadians),
          scale: { x: 0.5, y: 0.5, z: 0.5 }
        }
      },
      collider: { geometry: { shape: MRE.ColliderType.Box, size: { x: 0.5, y: 0.2, z: 0.01 } } }
    }
   });
  volumeDown.setBehavior(MRE.ButtonBehavior).onClick(user => {
    if(!Utils.canManageRadio(user))
      return;

    let increment = VOLUME_INCREMENT;
    let current = Math.round(app.currentVolume * 100) / 100;
    if(current <= increment)
      increment = increment / 5;

    if((current - increment) >= 0){
      app.currentVolume -= increment;
      if(app.trackSoundInstance)
        app.trackSoundInstance.setState({volume: app.currentVolume});
    }

    Utils.debug(`Volume: ${app.currentVolume}`);

  });

  app.volumeUp = volumeUp;
  app.volumeDown = volumeDown;
}
