import * as MRE from '@microsoft/mixed-reality-extension-sdk';
import App from "./app";

const SCALE = {x: 1, y: 1, z: 1};

export function createBoombox(app: App) : MRE.Actor {
  const body = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1275632250423083329",
    actor: {
      name: 'BoomboxBody',
      transform: {
        local: {
          position: { x: 0, y: 0, z: 0 },
          scale: SCALE
        }
      }
    }
  });

  const play = MRE.Actor.CreateFromLibrary(app.context, {
    resourceId: "artifact:1275632554384294231",
    actor: {
      name: 'ButtonPlay',
      transform: {
        local: {
          // Relative position for play button to player { x: 48.042, y: 19.755, z: 7.175 }
          // Doing this so scaling feedback on hover looks uniform.
          position: { x: -0.48, y: 0.2, z: 0.07 },
          scale: SCALE
        }
      }
    }
  });

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
      }
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
      }
    }
  });

  return play;
}
