import { configureStore } from "@reduxjs/toolkit";
import pokédexReducer from '../Pokédex/PokédexSlice.js';
import pokémonReducer from '../Pokémon/PokémonSlice.js';

export default configureStore({
    reducer: {
        pokémon: pokémonReducer,
        pokédex: pokédexReducer
    }
});