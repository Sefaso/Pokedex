// Search.js
import {
    useEffect, // Initial effect
    useMemo, // To keep form unnecessary re-renders
    useRef, // To hold placeholder values in page
    useState // State
} from 'react';
import { useNavigate } from 'react-router-dom'; // For One-page-domain page application
import {
    useSelector, // To retrieve state from slice 
    useDispatch // To trigger function (thunk) from slice
} from 'react-redux';
import {
    fetchAllNamesThunk, // To have lists of previews
    setSearchTerm, // To submit user input
    selectSearchTerm, // To hold user input
    selectAllNames, // Full list holder
    selectSearchStatus,
} from './SearchSlice.js';
import './Search.css';

export default function Search() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const term = useSelector(selectSearchTerm);
    const allNames = useSelector(selectAllNames);
    const status = useSelector(selectSearchStatus);

    const [isOpen, setIsOpen] = useState(false); // Bool for search dropdown display
    const containerRef = useRef(null); // Holds a reference to the container DOM element (for click-outside detection)

    // Fetch all names once on mount (For list of matches display)
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchAllNamesThunk());
        }
    }, [dispatch, status]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) { // If the click happened outside the search container, close the dropdown
                setIsOpen(false); // No value
            }
        };
        document.addEventListener('mousedown', handleClickOutside); // Attach a global mouse listener to detect clicks outside the container
        return () => document.removeEventListener('mousedown', handleClickOutside); // Cleanup: remove the listener when the component unmounts
    }, []); // Dependency array

    // Client-side prefix filter, limited to 10
    const matches = useMemo(() => {
        const trimmed = term.trim().toLowerCase(); // Takes term and normalizes for JSON compatibility
        if (!trimmed) return [];
        return allNames // Answers
            .filter(name => name.startsWith(trimmed))
            .slice(0, 10);
    }, [term, allNames]); // Dependency array

    // Change user input in real time
    const handleChange = (e) => {
        dispatch(setSearchTerm(e.target.value));
        setIsOpen(true);
    };

    // Submission of term
    const handleSelect = (name) => {
        dispatch(setSearchTerm('')); // Resets bar
        setIsOpen(false); // Cleans state
        navigate(`/species/${name}`); // Navigates to result
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent auto-triggering
        const trimmed = term.trim().toLowerCase(); // Trim term as is
        if (!trimmed) return; // If no term is given, give nothing

        const firstMatch = allNames.find(name => name.startsWith(trimmed)); // Auto pick first result
        if (firstMatch) { // Search first deployed possible result if not complete
            handleSelect(firstMatch); // Reuse function
        }
    };

    // Debugging
    console.log('🐛 allNames:', allNames.length, 'term:', term);

    return (
        <div>
            <form onSubmit={handleSubmit} className="searchContainer" ref={containerRef}>

                {/* Actual bar */}
                <input
                    type="text"
                    className="searchInput"
                    placeholder={status === 'loading' ? 'Loading...' : 'Search Pokédex...'}
                    value={term}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    disabled={status === 'loading'}
                />

                {/* Results preview dropdown */}
                {isOpen && matches.length > 0 && (
                    <ul className="searchDropdown">
                        {matches.map((name) => (
                            <li
                                key={name}
                                className="searchOption"
                                onClick={() => handleSelect(name)}
                            >
                                {name}
                            </li>
                        ))}
                    </ul>
                )}

                {/* If no matches are retrieved */}
                {isOpen && term.trim() && matches.length === 0 && (
                    <ul className="searchDropdown">
                        <li className="searchNoMatch">No Pokedex entry</li>
                    </ul>
                )}

                <button type="submit">
                    <img className='magGlass' src='/Search.png' alt="Magnifying glass" />
                </button>
            </form>
        </div>
    );
};