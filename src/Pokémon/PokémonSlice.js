import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPokémon, fetchAlternateForm, fetchPokédex } from '../APIHandshake/APIHandshake.js';
import { alternateSuffixes } from '../Utilities/AlternateSuffixes.js';

// Alternate forms detector helper
function isAlternateForm(name) {
    return alternateSuffixes.test(name);
}

// Alternate pokemon base from alternate form to establish relation
function getBaseName(name) {
    return name.replace(alternateSuffixes, '');
}

// NEW: Build a map of { baseName: [alternateFormNames...] }
function buildAlternateMap(allPokemon) {
    const alternateMap = {};
    allPokemon.forEach((pokémon) => {
        if (isAlternateForm(pokémon.name)) { // If it's a alternate pokemon
            const baseName = getBaseName(pokémon.name); // Extracts base name
            if (!alternateMap[baseName]) { alternateMap[baseName] = []; } // Space is left blank
            alternateMap[baseName].push(pokémon.name); // Stores the alternate pokemon
        }
    });
    return alternateMap; // List of alternates is returned
}

// Thunk for fetching individual pokémon species info
export const fetchPokémonThunk = createAsyncThunk(
    'pokémon/fetchPokémon',
    async (id) => {
        // Fetch the requested Pokémon
        const pokémon = await fetchPokémon(id);

        // Fetch all names to detect alternate forms for this Pokémon
        const allPokemon = await fetchPokédex();
        const alternateMap = buildAlternateMap(allPokemon);

        // Forcibly looks up by the BASE name (e.g., "giratina", not "giratina-altered")
        const baseName = getBaseName(pokémon.name);

        // Get alternate form names for this base Pokémon (if any)
        const alternateFormNames = (alternateMap[baseName] || [])
            .filter(name => name !== pokémon.name);  // don't duplicate the current form

        // Fetch each alternate form's full data (Not all data needed, just picture and name. Correct later)
        const alternateForms = await Promise.all(
            alternateFormNames.map((name) => fetchAlternateForm(name))
        );

        return { ...pokémon, alternateForms };
    }
);

//Creates slice for store with necessary methods
const pokémonSlice = createSlice({
    name: 'pokémon',
    initialState: {
        pokémon: null, //Pokémon's main data
        status: 'idle', //Retrieval lifecycle indicator
        error: null //Error indicator
    },

    //These work for state info management
    //Action creator for pokémon
    reducers: {
        showcasePokémon: (state, action) => {
            state.pokémon = action.payload.pokémon;
        }
    },

    //These work off the pokémon retrieval promise and change state accordingly
    extraReducers: (builder) => {
        builder
            //For loading
            .addCase(fetchPokémonThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            //For success
            .addCase(fetchPokémonThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pokémon = action.payload;
            })
            //For failure
            .addCase(fetchPokémonThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

//These are the exports needed for Pokémon.js
export const selectPokémon = (state) => state.pokémon.pokémon;
export const selectPokémonStatus = (state) => state.pokémon.status;
export const selectPokémonError = (state) => state.pokémon.error;

/*Actions for components 
(For good measure, even if not used, since the Poke API provides all info)*/
export const { showcasePokémon } = pokémonSlice.actions;


//And this one for the store
export default pokémonSlice.reducer;