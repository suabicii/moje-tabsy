import React from "react";
import Sidebar from "./Sidebar";
import NavbarMain from "./NavbarMain";

function Header() {
    return (
        //Main Navigation-->
        <header className="mb-5">
            <Sidebar/>
            <NavbarMain/>
        </header>
        //Main Navigation-->
    );
}

export default Header;