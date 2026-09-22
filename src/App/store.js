import { configureStore } from "@reduxjs/toolkit";
import pokédexReducer from '../Pokédex/PokédexSlice.js';
import pokémonReducer from '../Pokémon/PokémonSlice.js';
import searchSlice from '../Search/SearchSlice';

export default configureStore({
    reducer: {
        pokémon: pokémonReducer,
        pokédex: pokédexReducer,
        search: searchSlice
    }
});