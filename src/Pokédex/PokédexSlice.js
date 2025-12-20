import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPokédex } from '../APIHandshake/APIHandshake.js';

//Needed for pokémon id extraction
function extractIdFromUrl(url) {
    return url.split("/").filter(Boolean).pop();
    /*Divides a url using "/" as dividers, filters non-empty strings, 
    and with .pop returns the last element: The needed number*/
}

//Thunk for fetching Dex
export const fetchPokédexThunk = createAsyncThunk(
    'pokédex/fetchPokédex',
    async ({ offset, limit }) => {
        const pokédex = await fetchPokédex(offset, limit);
        return pokédex;
    }
);

const pokédexSlice = createSlice({
    name: 'pokédex',
    initialState: {
        pokédex: [],
        next: 0,
        previous: null,
        status: 'idle',
        error: null,
        scrollPosition: 0
    },

    reducers: {
        //This one loads initial feed
        populatePokédex: (state, action) => {
            state.pokédex.push(...action.payload.results);
            state.next = action.payload.next;
        },
        setScrollPosition: (state, action) => {
            state.scrollPosition = action.payload;
        }
    },

    //These work off the pokédex retrieval promise and change state accordingly
    extraReducers: (builder) => {
        builder
            //For loading
            .addCase(fetchPokédexThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })

            //For success
            .addCase(fetchPokédexThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const isInitialLoad = action.meta.arg.offset === 0;

                if (isInitialLoad) {
                    // First load → replace
                    state.pokédex = action.payload.results;
                } else {
                    // Infinite scroll: Append new pokémon
                    const existingEntries = new Set(state.pokédex.map((pokémon) => extractIdFromUrl(pokémon.url)));
                    const newEntries = action.payload.results.filter((pokémon) => !existingEntries.has(extractIdFromUrl(pokémon.url)));
                    state.pokédex.push(...newEntries);
                }
                state.next = action.payload.next;
            })

            //For failure
            .addCase(fetchPokédexThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

//These are the exports needed for Feed.js
export const selectPokédex = (state) => state.pokédex.pokédex;
export const selectNextOffset = (state) => state.pokédex.next;
export const selectPokédexStatus = (state) => state.pokédex.status;
export const selectPokédexError = (state) => state.pokédex.error;
export const { setScrollPosition } = pokédexSlice.actions;

//And this one for the store
export default pokédexSlice.reducer;