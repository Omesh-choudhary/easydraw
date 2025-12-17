import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
export type Shape = {
  id: string;
  type: string
  x:number  
  y:number
  toX?:number
  toY?:number
  angle?:number
  height?:number
  width?:number
  radius?:number
  opacity:number
  strokeColour?:string | null
  strokeWidth?:number | null
  strokeStyle?:string | null
  bgColour?:string | null
};

type ShapeState = {
  shapes: Shape[];
  hasHydrated:boolean;
  addShape: (shape: Shape) => void;
  eraseShape: (shape: Shape) => void;
  updateShape: (id: string, patch: Partial<Shape>) => void;
};

export const useShapeStore = create<ShapeState>()(
  subscribeWithSelector(
  persist(
  (set) => ({
  shapes: [],
  hasHydrated:false,

  addShape: (shape) =>
    set((state) => ({
      shapes: [...state.shapes, shape],
    })),

    eraseShape: (shape) =>
    set((state) => ({
      shapes: state.shapes.filter((s) =>
        s !== shape 
      ),
    })),

  updateShape: (id, patch) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    })),
       }),

       {
      name: "easydrawShapes",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
 


)));
