//#region IMPORTS
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchPokémonThunk,
    selectPokémon,
    selectPokémonError,
    selectPokémonStatus
} from './PokémonSlice.js';
import './Pokémon.css';
//#endregion IMPORTS

function Pokémon() {
    const { species } = useParams();
    const dispatch = useDispatch();
    const pokémon = useSelector(selectPokémon);
    const status = useSelector(selectPokémonStatus);
    const error = useSelector(selectPokémonError);

    useEffect(() => {
        dispatch(fetchPokémonThunk(species));
    }, [dispatch, species]);

    //Non-successful state handlers
    if (status === 'loading') return <p className='status'>Loading entry...</p>;
    if (status === 'failed') return <p className='status'>Error: {error}</p>;
    if (!pokémon) return <p className='status'>Pokémon not caught yet.</p>;

    return (
        <div className="pokémon">
            <div className="media">
                <img className='media' src={pokémon.image} alt={pokémon.name} />
                <audio src={pokémon.cry} autoPlay controls />
            </div>
            <div className="info">
                <h1>{pokémon.name.toUpperCase()}</h1>
                <p>{pokémon.description}</p>
                <ul>
                    <li>Height<br />
                        <span className="aspect">{`${pokémon.height} m`}</span>
                    </li>

                    <li>Weight<br />
                        <span className="aspect">{`${pokémon.weight} kgs`}</span>
                    </li>

                    <li>Types<br />
                        {pokémon.types.map(type => (
                            <span key={type} className={`typeBubble ${type}`}>
                                {type.toUpperCase()}
                            </span>
                        ))}
                    </li>

                    <li>Stats<br />
                        <ul className='statList'>
                            {pokémon.stats.map((stat) => (
                                <li className="aspect" key={stat}>
                                    {stat.stat.name.toUpperCase().replace(/-/g, " ")}:
                                    <span> {stat.base_stat}</span>
                                </li>
                            ))}
                        </ul>
                    </li>

                </ul>
            </div>
        </div>
    );
};

export default Pokémon;