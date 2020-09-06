import { TypedReducer } from "redoodle";
import { CurrentFile } from "@src/store/types";
import { CloseFile, OpenFile } from "@src/store/actions";

export const openFileReducer = TypedReducer.builder<CurrentFile | null>()
  .withHandler(OpenFile.TYPE, (state, payload) => {
    return payload;
  })
  .withHandler(CloseFile.TYPE, () => {
    return null;
  })
  .build();
