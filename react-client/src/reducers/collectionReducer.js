import { createSlice } from "@reduxjs/toolkit";

export const collectionSlice = createSlice({
  name: "collections",
  initialState: {
    selected: "",
    collections: {
      "My Collection": [],
    },
  },
  reducers: {
    setSelected(state, action) {
      const { collection } = action.payload;
      if (Object.keys(state.collections).includes(collection)) {
        state.selected = collection;
      } else {
        state.selected = "";
      }
    },
    addCollection(state, action) {
      const { collection } = action.payload;
      if (!Object.keys(state.collections).includes(collection)) {
        state.collections[collection] = [];
      }
    },
    deleteCollection(state, action) {
      const { collection } = action.payload;
      if (
        collection !== state.selected &&
        Object.keys(state.collections).includes(collection)
      ) {
        delete state.collections[collection];
      }
    },
    addComic(state, action) {
      const { collection, comicId } = action.payload;
      if (
        !state.collections[collection].includes(comicId) &&
        state.collections[collection].length < 20
      ) {
        state.collections[collection].push(comicId);
      }
    },
    removeComic(state, action) {
      const { collection, comicId } = action.payload;
      if (state.collections[collection].includes(comicId)) {
        const index = state.collections[collection].indexOf(comicId);
        state.collections[collection].splice(index, 1);
      }
    },
  },
});

export const {
  setSelected,
  addCollection,
  deleteCollection,
  addComic,
  removeComic,
} = collectionSlice.actions;

export default collectionSlice.reducer;
