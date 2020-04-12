import { TypedReducer } from "redoodle";
import { CurrentFile } from "@src/store/types";
import { OpenFile } from "@src/store/actions";

export const openFileReducer = TypedReducer.builder<CurrentFile>()
  .withHandler(OpenFile.TYPE, (state, payload) => {
    return payload;
  })
  .build();
