import { create } from "zustand";

export type Shape = {
  id: string;
  type: "rectangle" | "circle" | "diamond" | "line" | "arrow";
  x: number;
  y: number;
  toX?: number;
  toY?: number;
  width?: number;
  height?: number;
  radius?: number;
};

type ShapeState = {
  shapes: Shape[];

  addShape: (shape: Shape) => void;
  updateShape: (id: string, patch: Partial<Shape>) => void;
};

export const useShapeStore = create<ShapeState>((set) => ({
  shapes: [],

  addShape: (shape) =>
    set((state) => ({
      shapes: [...state.shapes, shape],
    })),

  updateShape: (id, patch) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    })),
}));
