/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import ProfileForm from "../../../components/forms/ProfileForm";
import {render, screen, waitFor} from "@testing-library/react";
import {userData} from '../fixtures/apiData';
import {fetchData} from "../../../utils/fetchData";

const unmockedFetch = global.fetch;

beforeAll(() => {
    global.fetch = () => Promise.resolve({
        json: () => Promise.resolve(userData)
    });
});

afterAll(() => {
    global.fetch = unmockedFetch;
});

it('should correctly display ProfileForm', () => {
    const renderer = new ReactShallowRenderer();
    const fetchData = jest.fn();
    renderer.render(<ProfileForm fetchData={fetchData}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display ProfileForm with user data fetched from API', async () => {
    const fetchUserData = fetchData('/fake-api/user-data');

    render(<ProfileForm fetchData={fetchUserData}/>);

    await waitFor(() => expect(screen.getByRole('form')).toHaveFormValues({
        name: userData.name,
        email: userData.email,
        tel_prefix: userData.tel_prefix,
        tel: userData.tel
    }));
});