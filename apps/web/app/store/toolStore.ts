import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { easyDrawState } from "../../componentss/TopBar";


type ToolState = easyDrawState & {
  hasHydrated: boolean;

  setActiveTool: (tool: string) => void;
  setStrokeColour: (color: string) => void;
  setBgColour: (color: string) => void;
  setStrokeStyle: (style: easyDrawState["strokeStyle"]) => void;
  setStrokeWidth: (width: number) => void;
  setOpacity: (opacity: number) => void;
  setLocked: (value:boolean) => void;
};

export const useToolStore = create<ToolState>()(
  subscribeWithSelector(
  persist(
    (set) => ({
      activeTool: {
        locked: false,
        type:"cursor"
      },
      strokeColour: "rgba(255, 255, 255, 1)",
      bgColour: "transparent",
      strokeStyle: "solid",
      strokeWidth: 1,
      opacity: 1,

      hasHydrated: false,

      setActiveTool: (tool) => set((state)=>({activeTool:{
        ...state.activeTool,
        type:tool
      }})),
      setStrokeColour: (color) => set({ strokeColour: color }),
      setBgColour: (color) => set({ bgColour: color }),
      setStrokeStyle: (style) => set({ strokeStyle: style }),
      setStrokeWidth: (width) => set({ strokeWidth: width }),
      setOpacity: (opacity) => set({ opacity }),
      setLocked: (value) => set((state)=>({activeTool:{
        ...state.activeTool,
        locked:value
      }})),
    }),
    {
      name: "easydrawState",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  ) )
);
