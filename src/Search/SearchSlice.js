import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPokédex } from '../APIHandshake/APIHandshake.js';

// Fetches all base Pokémon names ONCE.
// The result is cached in state.allNames for instant client-side filtering.
export const fetchAllNamesThunk = createAsyncThunk(
    'search/fetchAllNames',
    async () => {
        const allPokemon = await fetchPokédex();
        console.log('🐛 Fetched', allPokemon.length, 'pokemon'); // ← add this
        return allPokemon
            .filter(p => !/-mega(-[xy])?$/.test(p.name)) // Remove megas
            .map(p => p.name); // Iterator
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        //In order to handle an user input, the state needs to be provided a placeholder
        term: '',
        allNames: [],
        status: 'idle',
        error: null,
    },

    reducers: {
        setSearchTerm: (state, action) => { // To search
            state.term = action.payload;
        },
        clearSearch: (state) => { // To clean searchbar
            state.term = '';
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAllNamesThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })

            .addCase(fetchAllNamesThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.allNames = action.payload; // just the payload, since we ony need a single result
            })

            .addCase(fetchAllNamesThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setSearchTerm, clearSearch } = searchSlice.actions;

export const selectSearchTerm = (state) => state.search.term;
export const selectAllNames = (state) => state.search.allNames;
export const selectSearchStatus = (state) => state.search.status;
export const selectSearchError = (state) => state.search.error;

export default searchSlice.reducer;