import React from "react";
import Sidebar from "./Sidebar";
import NavbarMain from "./NavbarMain";

function Header() {
    return (
        //Main Navigation-->
        <div className="mb-5">
            <Sidebar/>
            <NavbarMain/>
        </div>
        //Main Navigation-->
    );
}

export default Header;