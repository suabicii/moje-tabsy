/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import ProfileForm from "../../../components/forms/ProfileForm";
import {act, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {userData} from '../fixtures/apiData';
import {fetchData} from "../../../utils/fetchData";

const setMockedFetch = mockedResponse => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        json: () => Promise.resolve(mockedResponse)
    }));
};

const renderProfileForm = () => {
    const fetchUserData = fetchData('/fake-api/user-data');
    render(<ProfileForm fetchData={fetchUserData}/>);
};

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it('should correctly display ProfileForm', () => {
    const renderer = new ReactShallowRenderer();
    const fetchData = jest.fn();
    renderer.render(<ProfileForm fetchData={fetchData}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display ProfileForm with user data fetched from API', async () => {
    setMockedFetch(userData);

    renderProfileForm();

    await waitFor(() => expect(screen.getByRole('form')).toHaveFormValues({
        name: userData.name,
        email: userData.email,
        tel_prefix: userData.tel_prefix,
        tel: userData.tel
    }));
});

it('should display modal with positive information after form submission if status is OK', async () => {
    setMockedFetch(userData);
    renderProfileForm();

    setMockedFetch({status: 200});
    await act(() => {
        fireEvent.change(screen.getByTestId('email'), {target: {value: 'new@email.com'}});
        fireEvent.submit(screen.getByRole('form'));
    });

    expect(screen.getByTestId('status-ok')).toBeVisible();
});

it('should display modal with negative information after form submission if status is FAIL', async () => {
    setMockedFetch(userData);
    renderProfileForm();

    await act(() => {
        fireEvent.change(screen.getByTestId('firstName'), {target: {value: 'John'}});
        fireEvent.submit(screen.getByRole('form'));
    });

    expect(screen.getByTestId('status-failed')).toBeVisible();
});