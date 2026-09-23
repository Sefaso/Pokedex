//This page is for the page's functionality
import {
  Route,
  BrowserRouter,
  Routes,
  Navigate
} from 'react-router-dom';
import AppLayout from './AppLayout.js';
import Pokémon from '../Pokémon/Pokémon.js';
import Pokédex from '../Pokédex/Pokédex.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Redirect root to national dex (default) in case of no specifics*/}
          <Route index element={<Navigate to="/pokedex" />} />
          {/* URL behaviors */}
          <Route path="pokedex" element={<Pokédex />} />
          <Route path="species/:species" element={<Pokémon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
