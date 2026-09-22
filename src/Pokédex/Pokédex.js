//#region IMPORTS
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useMemo
} from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchPokédexThunk,
    selectPokédex,
    selectPokédexStatus,
    selectPokédexError,
    selectActiveRegion, // Selects region
    setScrollPosition,
    setActiveRegion, // Sets region
    filterByRegion, // Filters by region
} from './PokédexSlice';
import './Pokédex.css'
//#endregion IMPORTS

function Pokédex() {
    //This one is to receive the term from the feed route in Routes.js
    const dispatch = useDispatch();
    const pokédex = useSelector(selectPokédex);
    const region = useSelector(selectActiveRegion);
    const visibleDex = useMemo(() => filterByRegion(pokédex, region), [pokédex, region]);
    const status = useSelector(selectPokédexStatus);
    const error = useSelector(selectPokédexError);
    const containerRef = useRef(null);

    //Initial load retriever
    useEffect(() => {
        if (pokédex.length === 0) {
            dispatch(fetchPokédexThunk({ offset: 0 }));
        }
    }, [dispatch, pokédex.length]);

    // Position saver
    const scrollPosition = useSelector(state => state.pokédex.scrollPosition);
    const scrollPositionRef = useRef(scrollPosition);
    const isFirstRender = useRef(true);

    // Keep dex position (within region) when coming back out from specie's page
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // First attempt — grid should be committed by now
        container.scrollTop = scrollPositionRef.current;

        // Second attempt — after the next paint, in case layout shifted
        const id = requestAnimationFrame(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = scrollPositionRef.current;
            }
        });

        return () => cancelAnimationFrame(id);
    }, []);

    // Reset scroll on real region changes (skip initial mount)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        const container = containerRef.current;
        if (!container) return;
        container.scrollTop = 0;
    }, [region]);

    //Non-successful state handlers
    if (status === 'loading' && pokédex.length === 0) { //This one checks if the feed length is 0, and if not, adds without replacing
        return <p className='status'>Loading pokédex entries...</p>;
    };
    if (status === 'failed') return <p className='status'>Error: {error}</p>;
    if (!pokédex || pokédex.length === 0) return <p className='status'>No pokémon caught yet.</p>;

    //RENDER
    return (
        <div>
            <div className="region-filter">
                <button
                    className={!region ? 'focus' : ''}
                    onClick={() => dispatch(setActiveRegion(null))}
                >
                    National
                </button>
                {['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola', 'galar', 'paldea'].map((r) => ( // For each
                    <button
                        key={r}
                        className={region === r ? 'active' : ''}
                        onClick={() => dispatch(setActiveRegion(r))}
                    >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                ))}
            </div>

            <div className="results snap-container" ref={containerRef}>
                {visibleDex.map((pokémon) => {

                    //Extract pokémon id by grabbing the last non-null "/"-separated section of the url
                    const id = pokémon.url.split("/").filter(Boolean).pop();

                    return (
                        <div key={pokémon.name}>
                            <div className="container">
                                <Link to={`/species/${pokémon.name}`}
                                    //This next part for position save
                                    onClick={() => {
                                        dispatch(setScrollPosition(containerRef.current.scrollTop));
                                    }}>
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`}
                                        alt={pokémon.name}
                                    />
                                </Link>
                                <div className="text">
                                    <h2>
                                        {`#${visibleDex.indexOf(pokémon) + 1}`}
                                    </h2>
                                    <h1>
                                        <Link to={`/species/${pokémon.name}`}
                                            //This next part for position save
                                            onClick={() => {
                                                dispatch(setScrollPosition(containerRef.current.scrollTop));
                                            }}>
                                            {`${pokémon.name.toUpperCase()}`}
                                        </Link>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {/* ✅ Loading indicator for infinite scroll */}
                {status === 'loading' && <p className='status'>Accesing database...</p>}
            </div>
        </div>
    )
};

export default Pokédex;