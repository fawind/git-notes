import { TypedReducer } from "redoodle";
import { GUIState } from "@src/store/types";
import { ToggleFileSearch } from "@src/store/actions";

export const guiReducer = TypedReducer.builder<GUIState>()
  .withHandler(ToggleFileSearch.TYPE, (state) => {
    return { ...state, fileSearchVisible: !state.fileSearchVisible };
  })
  .build();
