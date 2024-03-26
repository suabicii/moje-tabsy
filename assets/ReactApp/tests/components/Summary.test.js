/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Summary from "../../components/Summary";
import {render, waitFor} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "../../store";

function WrappedComponent() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Summary/>
            </BrowserRouter>
        </Provider>
    );
}

afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
});

it('should correctly render summary', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <Provider store={store}>
            <Summary/>
        </Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display information about empty drug list in schedule, stock status checker and out of stock dates area', () => {
    const {container} = render(<WrappedComponent/>);

    const emptyInfo = container.querySelectorAll('.drug-list-empty');

    expect(emptyInfo.length).toBeGreaterThan(0);
});

it('should get error if fetching QR code failed', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Cannot fetch QR code'));
    const {container} = render(<WrappedComponent/>);

    await waitFor(() => {
        const qrCode = container.querySelector('#qr-code');
        expect(qrCode).toBeFalsy();
    });
});