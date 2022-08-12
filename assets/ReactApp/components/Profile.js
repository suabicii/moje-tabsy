import React from "react";
import ProfileForm from "./forms/ProfileForm";
import {fetchData} from "../utils/fetchData";

function Profile({fakeApiUrl}) { // fakeApiUrl – for test environment
    const apiUrl = fakeApiUrl || '/api/user-data';
    const fetchUserData = fetchData(apiUrl);

    return (
        <>
            <h1 className="text-center mt-5 mt-md-0">Mój profil</h1>
            <ProfileForm fetchData={fetchUserData}/>
        </>
    );
}

export default Profile;