import React, {useEffect} from "react";
import AppRouter from "../routers/AppRouter";
import {useDispatch, useSelector} from "react-redux";
import {fetchDrugs} from "../features/drugs/drugsSlice";
import {fetchUserData} from "../features/user/userSlice";
import changeTheme from "../utils/changeTheme";

function MainPage() {
    const dispatch = useDispatch();
    const darkMode = useSelector(state => state.darkMode);

    useEffect(() => {
        dispatch(fetchDrugs());
        dispatch(fetchUserData());
        changeTheme(darkMode);
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