import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";

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

  let playButtonScale = {x: 1, y: 1, z: 1};
  if(app.totalTracks > 1)
    playButtonScale = BUTTON_SCALE;

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
          scale: playButtonScale
        }
      },
      parentId: body.id
    }
  });
  app.buttonPlay = buttonPlay;

  // side previous and next buttons
  if(app.totalTracks > 1){
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
  }

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
}
