import React from "react";
import {NavLink} from "react-router-dom";
import {mainRoute} from "../routers/AppRouter";

function Sidebar() {
    return (
        // Sidebar -->
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
            <div className="position-sticky">
                <div className="list-group list-group-flush mx-3 mt-4">
                    <NavLink to={mainRoute} className="list-group-item list-group-item-action py-2 ripple" end>
                        <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Strona główna</span>
                    </NavLink>
                    <NavLink to={`${mainRoute}/drug-list`} className="list-group-item list-group-item-action py-2 ripple">
                        <i className="fa-solid fa-jar fa-fw me-3"></i><span>Moje leki i suplementy</span>
                    </NavLink>
                    <NavLink to={`${mainRoute}/profile`} className="list-group-item list-group-item-action py-2 ripple">
                        <i className="fa-solid fa-user fa-fw me-3"></i><span>Mój profil</span>
                    </NavLink>
                    <NavLink to={`${mainRoute}/settings`} className="list-group-item list-group-item-action py-2 ripple">
                        <i className="fa-solid fa-gear fa-fw me-3"></i><span>Ustawienia</span>
                    </NavLink>
                    <a href="/logout" className="list-group-item list-group-item-action py-2 ripple"
                    ><i className="fa-solid fa-power-off fa-fw me-3"></i><span>Wyloguj się</span></a
                    >
                </div>
            </div>
        </nav>
        //Sidebar -->
    );
}

export default Sidebar;