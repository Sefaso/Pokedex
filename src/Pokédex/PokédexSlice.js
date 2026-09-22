import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPokédex, fetchDefaultFormNames } from '../APIHandshake/APIHandshake.js';
import { regionalDexes } from '../Utilities/RegionalDexes.js';

// Region filter
export function filterByRegion(pokédex, region) {
    if (!region) return pokédex; // Default case
    const regionOrder = regionalDexes[region?.toLowerCase()]; // Gets guided by region
    if (!regionOrder) return pokédex; // No region order? Return default

    const byName = new Map(pokédex.map(p => [p.name, p])); // Direct lookup

    const baseLookup = new Map();
    for (const p of pokédex) { // Add default names in order
        const base = p.name.split('-')[0]; // Get first result of any name containing "-"
        if (!baseLookup.has(base)) baseLookup.set(base, p); // If ti exists, adds it
    }

    return regionOrder // Takes the region's hardcoded order
        .map(name => byName.get(name) ?? baseLookup.get(name)) // MAps with either only name, or valid name
        .filter(Boolean); // Keep out empty entries (failsafe)
};

//Thunk for fetching Dex
export const fetchPokédexThunk = createAsyncThunk(
    'pokédex/fetchPokédex',
    async () => {
        const [list, defaultForms] = await Promise.all([
            fetchPokédex(),
            fetchDefaultFormNames(),
        ]);
        return { list, defaultForms };
    }
);

const pokédexSlice = createSlice({
    name: 'pokédex',
    initialState: {
        pokédex: [],
        defaultForms: [], // For default forms (Exhibition pokedex)
        activeRegion: null, // For region filtering
        next: 0,
        previous: null,
        status: 'idle',
        error: null,
        scrollPosition: 0,
    },

    reducers: {
        populatePokédex: (state, action) => { // This one loads initial feed
            state.pokédex.push(...action.payload.results);
            state.next = action.payload.next;
        },
        setActiveRegion: (state, action) => {   // Region setter
            state.activeRegion = action.payload;
        },
        setScrollPosition: (state, action) => { // Scroll stop
            state.scrollPosition = action.payload;
        },
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
                const { list, defaultForms } = action.payload; // Retrieves all pokemon for entries and defaults for display
                state.defaultForms = defaultForms; // Store the default-form list for the selector / filter to use
                
                const defaultSet = new Set(defaultForms); // Separate default forms
                state.pokédex = list.filter(p => defaultSet.has(p.name)); // Send them to state (Don't worry about individual pages, pokemonSlice takes care)

                state.next = null;
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
export const selectActiveRegion = (state) => state.pokédex.activeRegion;
export const selectDefaultForms = (state) => state.pokédex.defaultForms;
export const selectNextOffset = (state) => state.pokédex.next;
export const selectPokédexStatus = (state) => state.pokédex.status;
export const selectPokédexError = (state) => state.pokédex.error;
export const { setScrollPosition, setActiveRegion } = pokédexSlice.actions;

//And this one for the store
export default pokédexSlice.reducer;