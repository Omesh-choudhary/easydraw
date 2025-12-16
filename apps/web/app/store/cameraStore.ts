import { create } from "zustand";

type CameraState = {
  offsetX: number;
  offsetY: number;
  scale: number;

  pan: (dx: number, dy: number) => void;
  zoomAt: (
    screenX: number,
    screenY: number,
    zoomDelta: number
  ) => void;
};

export const useCameraStore = create<CameraState>((set, get) => ({
  offsetX: 0,
  offsetY: 0,
  scale: 1,

  pan: (dx, dy) =>
    set((state) => ({
      offsetX: state.offsetX + dx,
      offsetY: state.offsetY + dy,
    })),

  zoomAt: (screenX, screenY, zoomDelta) =>
    set((state) => {
      const { offsetX, offsetY, scale } = state;

      const worldX = (screenX - offsetX) / scale;
      const worldY = (screenY - offsetY) / scale;

      const newScale = Math.max(
        0.1,
        Math.min(5, scale * zoomDelta)
      );

      return {
        scale: newScale,
        offsetX: screenX - worldX * newScale,
        offsetY: screenY - worldY * newScale,
      };
    }),
}));
