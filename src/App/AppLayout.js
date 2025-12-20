//This file is for the page's layout
import { Outlet, Link } from "react-router-dom";
import './AppLayout.css';

//This renders nav bar and mutable content
export default function AppLayout() {

    return (
        <div>
            <nav className='fade'>
                <Link to="/">
                    <img className='logo' src='/logo192.png' alt="app-logo" />
                    {/* REMEMBER THAT IF ASSETS ARE IN THE "PUBLIC DIRECTORY,
                    THEY DON'T NEED THE "." BEFORE THE "/" */}
                </Link>
            </nav>
            <div className="main">
                <Outlet />
            </div>
            {/*Outlet ensures that elements on page render their respective children 
            properly or the page changes route whenever useNavigate is used by a 
            method*/}
        </div>
    );
};