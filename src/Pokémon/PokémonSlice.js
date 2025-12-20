import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPokémon } from '../APIHandshake/APIHandshake.js';

// Thunk for fetching individual pokémon species info
export const fetchPokémonThunk = createAsyncThunk(
    'pokémon/fetchPokémon',
    async (id) => {
        const pokémon = await fetchPokémon(id);
        return pokémon;
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