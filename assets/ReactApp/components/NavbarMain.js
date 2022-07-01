import React from "react";

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
                <a className="navbar-brand fst-italic d-none d-lg-block" href="#">Moje-Tabsy.pl <i
                    className="fa-solid fa-pills"></i></a>
                {/*// Search form -->*/}
                <form className="d-none d-md-flex input-group w-auto my-auto">
                    <input
                        id="searchInput"
                        autoComplete="off"
                        type="search"
                        className="form-control rounded-start dashboard__search"
                        placeholder='Wyszukaj'
                    />
                    <label htmlFor="searchInput" className="visually-hidden">Wyszukaj</label>
                    <span className="input-group-text border-0"><i className="fas fa-search"></i></span>
                </form>

                {/*// Right links -->*/}
                <ul className="navbar-nav ms-auto d-flex flex-row">
                    {/*// Notification dropdown -->*/}
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link me-3 me-lg-0 notifications-dropdown dropdown-toggle hidden-arrow"
                            href="#"
                            id="notificationDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fas fa-bell"></i>
                            <span className="badge rounded-pill badge-notification bg-danger">1</span>
                        </a>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="notificationDropdown"
                        >
                            <li>
                                <a className="dropdown-item" href="#">Some news</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">Another news</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </li>
                        </ul>
                    </li>

                    {/*// Icon dropdown -->*/}
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="m-0">🇵🇱</i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li>
                                <a className="dropdown-item" href="#"
                                ><i>🇵🇱</i> Polski
                                    <i className="fa fa-check text-success ms-2"></i
                                    ></a>
                            </li>
                            <li>
                                <hr className="dropdown-divider"/>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#"><i>🇬🇧</i> English</a>
                            </li>
                        </ul>
                    </li>

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
                                <a className="dropdown-item" href="#">Mój profil</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">Ustawienia</a>
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