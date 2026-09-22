//#region FOR POKÉDEX
// Fetches the full Pokémon list (names + urls). Cached for the session.
let cachedPokédexList = null;

export async function fetchPokédex() {
    if (cachedPokédexList) return cachedPokédexList;
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000');
    const data = await response.json();
    cachedPokédexList = data.results;
    return cachedPokédexList;
};
//#endregion

//#region FOR INDIVIDUAL POKÉMON
// Fetches a single pokémon and its info
export async function fetchPokémon(id) {
    //Result of retrieving from pokémon .json is assigned to "response"
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    //Translates from raw response to json and assigns to "data"
    const data = await response.json();
    // Fetch species data (for description)
    const speciesResponse = await fetch(data.species.url);
    const speciesData = await speciesResponse.json();
    // Extracts 1st English description
    const entry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === "en"
    )?.flavor_text;
    //Collects needed info
    const pokémon = {
        name: data.name,
        cry: data.cries.latest,
        height: data.height / 10,
        weight: data.weight / 10,
        image: data.sprites.other.home.front_default,
        types: data.types.map(t => t.type.name), /*Extracts types as array*/
        description: entry
            ?.replace(/\f/g, "\n")
            .replace(/\n/g, " "),
        stats: data.stats
    };
    return pokémon;
};
//#endregion

//#region FOR DEFAULT FORM PICKING
export async function fetchDefaultFormNames() {
    // Get all species
    const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=100000');
    const listData = await listResponse.json();
    const species = listData.results;

    // Fetch each species' detail in batches to avoid hammering the API
    const BATCH_SIZE = 50;
    const defaultNames = [];

    for (let i = 0; i < species.length; i += BATCH_SIZE) { // Does the "cutting"
        const batch = species.slice(i, i + BATCH_SIZE);
        const details = await Promise.all(
            batch.map((s) => fetch(s.url).then(r => r.json()))
        );

        for (const detail of details) {
            const defaultVariety = detail.varieties.find(v => v.is_default); // Finds default
            if (defaultVariety) {
                defaultNames.push(defaultVariety.pokemon.name);
            }
        };
        console.log(`Default forms fetched: ${defaultNames.length}/${species.length}`);
    };
    return defaultNames; // array of names — store as array in Redux
};
//#endregion

//#region FOR ALTERNATE FORMS after PokemonSlice determines what is alternate using the alternate suffixes utility
export async function fetchAlternateForm(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    const data = await response.json();
    return {
        name: data.name,
        image: data.sprites.other.home.front_default,
        cry: data.cries?.latest,
        types: data.types.map(t => t.type.name),
    };
};
//#endregion