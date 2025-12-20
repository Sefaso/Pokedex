//#region FOR POKÉDEX
// Fetches the main Pokédex (National)
export async function fetchPokédex(offset = 0) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`;
    const response = await fetch(url);
    const data = await response.json();
    const results = data.results; //List of pokémon
    const next = offset + 20 //Creates next "offset"
    return { results, next };
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
        //Solved earlier
        description: entry
            ?.replace(/\f/g, "\n")
            .replace(/\n/g, " "),
        stats: data.stats
    };
    return pokémon;
};
//#endregion