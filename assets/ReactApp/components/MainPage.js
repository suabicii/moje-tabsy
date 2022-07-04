import React from "react";
import AppRouter from "../routers/AppRouter";

function MainPage() {
    return (
        //Main layout-->
        <main className="dashboard__main">
            <div className="container py-4">
                <AppRouter/>
            </div>
        </main>
        //Main layout-->
    );
}

export default MainPage;