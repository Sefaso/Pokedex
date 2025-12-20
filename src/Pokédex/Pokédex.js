//#region IMPORTS
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchPokédexThunk,
    selectPokédex,
    selectNextOffset,
    selectPokédexStatus,
    selectPokédexError,
    setScrollPosition
} from './PokédexSlice';
import './Pokédex.css'
//#endregion IMPORTS

function Pokédex() {
    //This one is to receive the term from the feed route in Routes.js
    const dispatch = useDispatch();
    const pokédex = useSelector(selectPokédex);
    const status = useSelector(selectPokédexStatus);
    const error = useSelector(selectPokédexError);
    const nextOffset = useSelector(selectNextOffset);
    const containerRef = useRef(null);

    //Initial load retriever
    useEffect(() => {
        if (pokédex.length === 0) {
            dispatch(fetchPokédexThunk({ offset: 0 }));
        }
    }, [dispatch, pokédex.length]);

    //Position saver
    const scrollPosition = useSelector(state => state.pokédex.scrollPosition);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Restore scroll position
        container.scrollTop = scrollPosition;
    }, [scrollPosition]);

    //New results handler
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isThrottled = false;

        const handleScroll = () => {
            if (isThrottled) return;
            isThrottled = true;

            setTimeout(() => {
                isThrottled = false;

                const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

                if (nearBottom && status === 'succeeded' && nextOffset !== null) {
                    dispatch(fetchPokédexThunk({ offset: nextOffset }));
                }
            }, 200); // throttle
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [dispatch, nextOffset, status]);

    //Non-successful state handlers
    if (status === 'loading' && pokédex.length === 0) {
        return <p className='status'>Loading database...</p>;
    };//This one checks if the feed length is 0, and if not, adds without replacing
    if (status === 'failed') return <p className='status'>Error: {error}</p>;
    if (!pokédex || pokédex.length === 0) return <p className='status'>No pokémon caught yet.</p>;

    return (
        <div className="results snap-container" ref={containerRef}>
            {pokédex.map((pokémon) => {

                //Extract pokémon id
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
                                    {`#${id}`}
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
    )
};

export default Pokédex;