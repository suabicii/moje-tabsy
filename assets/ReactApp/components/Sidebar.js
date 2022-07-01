import React from "react";

function Sidebar() {
    return (
        // Sidebar -->
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
            <div className="position-sticky">
                <div className="list-group list-group-flush mx-3 mt-4">
                    <a
                        href="#"
                        className="list-group-item list-group-item-action py-2 ripple active"
                        aria-current="true"
                    >
                        <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Strona główna</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple">
                        <i className="fa-solid fa-jar fa-fw me-3"></i><span>Moje leki i suplementy</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"
                    ><i className="fa-solid fa-user fa-fw me-3"></i><span>Mój profil</span></a
                    >
                    <a href="#" className="list-group-item list-group-item-action py-2 ripple"
                    ><i className="fa-solid fa-gear fa-fw me-3"></i><span>Ustawienia</span></a
                    >
                    <a href="/" className="list-group-item list-group-item-action py-2 ripple"
                    ><i className="fa-solid fa-power-off fa-fw me-3"></i><span>Wyloguj się</span></a
                    >
                </div>
            </div>
        </nav>
        //Sidebar -->
    );
}

export default Sidebar;