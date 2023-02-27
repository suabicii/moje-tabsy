import React, {useEffect} from "react";
import AppRouter from "../routers/AppRouter";
import {useDispatch} from "react-redux";
import {fetchDrugs} from "../features/drugs/drugsSlice";
import {fetchUserData} from "../features/user/userSlice";

function MainPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDrugs());
        dispatch(fetchUserData());
    }, []);

    return (
        <main className="dashboard__main">
            <div className="container py-4">
                <AppRouter/>
            </div>
        </main>
    );
}

export default MainPage;