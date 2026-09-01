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
  text?:string
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
  updateText: (id:string, value:string) => void;
  changeIndex: (value: string, id:string) => void;
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

    updateText: (id, value) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, text: s.text+value } : s
      ),
      
    })),

    changeIndex: (value, id) =>
    set((state) => ({
      
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
