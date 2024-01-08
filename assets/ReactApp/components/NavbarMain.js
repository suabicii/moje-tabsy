import React from "react";
import {Link} from "react-router-dom";
import {mainRoute} from "../routers/AppRouter";

function NavbarMain() {
    return (
        //Navbar -->
        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
            {/*Container wrapper*/}
            <div className="container-fluid">
                {/*// Toggle button -->*/}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebarMenu"
                    aria-controls="sidebarMenu"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="fas fa-bars"></i>
                </button>

                {/*// Brand -->*/}
                <a className="navbar-brand fst-italic d-none d-lg-block" href="#">MediMinder <i
                    className="fa-solid fa-pills"></i></a>

                {/*// Right links -->*/}
                <ul className="navbar-nav ms-auto d-flex flex-row">
                    {/*// Avatar -->*/}
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                            href="#"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-circle-user fs-4"></i>
                        </a>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdownMenuLink"
                        >
                            <li>
                                <Link to={`${mainRoute}/profile`} className="dropdown-item">Mój profil</Link>
                            </li>
                            <li>
                                <Link to={`${mainRoute}/settings`} className="dropdown-item">Ustawienia</Link>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/logout">Wyloguj się</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            {/*// Container wrapper -->*/}
        </nav>
        //Navbar -->
    );
}

export default NavbarMain;