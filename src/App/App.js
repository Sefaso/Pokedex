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
        {/* Redirect root to '.../pkdx/national' in case of no specifics*/}
        <Route path="/" element={<Navigate to="/pokédex" replace />} />
        {/* URL behaviors */}
        <Route path="/" element={<AppLayout />}>
          <Route path="pokédex" element={<Pokédex />} />
          <Route path="type/:type" element={<Pokédex />} />
          <Route path="species/:species" element={<Pokémon />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}