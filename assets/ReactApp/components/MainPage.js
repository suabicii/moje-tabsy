import React from "react";
import AppRouter from "../routers/AppRouter";

function MainPage() {
    return (
        <main className="dashboard__main">
            <div className="container py-4">
                <AppRouter/>
            </div>
        </main>
    );
}

export default MainPage;