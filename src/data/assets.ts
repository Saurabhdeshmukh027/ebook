export const VIDEO_SRC = '/video/durga/durga-raudra.mp4';
export const POSTER_SRC = '/video/durga/durga-poster.jpg';

export const ASSET_PATHS = {
  video: {
    durga: {
      raudra: VIDEO_SRC,
      poster: POSTER_SRC,
    },
  },
  images: {
    // Product screenshots will go here
  },
  fonts: {
    // Local fonts will go here if needed
  },
} as const;

export type AssetPaths = typeof ASSET_PATHS;