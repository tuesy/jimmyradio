import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";

const SCALE = {x: 1, y: 1, z: 1};
const BUTTON_SCALE = {x: 0.5, y: 0.5, z: 0.5};
const BUTTON_SPACING = 0.12;

export function createBoombox(app: App){
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

  if(app.totalTracks > 1){
    const buttonPrevious = MRE.Actor.CreateFromLibrary(app.context, {
      resourceId: "artifact:1275632554384294231",
      actor: {
        name: 'ButtonPrevious',
        transform: {
          local: {
            position: { x: buttonPlay.transform.local.position.x + BUTTON_SPACING, y: 0.2, z: 0.07 },
            scale: BUTTON_SCALE
          }
        },
        parentId: body.id
      }
    });

    const buttonNext = MRE.Actor.CreateFromLibrary(app.context, {
      resourceId: "artifact:1275632554384294231",
      actor: {
        name: 'ButtonNext',
        transform: {
          local: {
            position: { x: buttonPlay.transform.local.position.x - BUTTON_SPACING, y: 0.2, z: 0.07 },
            scale: BUTTON_SCALE
          }
        },
        parentId: body.id
      }
    });

    app.buttonPrevious = buttonPrevious;
    app.buttonNext = buttonNext;
  }

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
}
