/**
 * @jest-environment jsdom
 * */
import React from "react";
import renderer from 'react-test-renderer';
import {Provider} from "react-redux";
import store from "../../../../../store";
import QrCodeModalContent from "../../../../../components/modal/content/qrcode/QrCodeModalContent";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import exampleQrCodeSrc from "../../../fixtures/exampleQrCodeSrc";

const setIsModalOpen = jest.fn();

function WrappedComponent({isQrCodeRequested}) {
    return (
        <Provider store={store}>
            <QrCodeModalContent isQrCodeRequested={isQrCodeRequested} setIsModalOpen={setIsModalOpen}/>
        </Provider>
    );
}

it('should correctly render QrCodeModalContent', () => {
    const tree = renderer.create(<WrappedComponent/>);

    expect(tree).toMatchSnapshot();
});

it('should close modal after clicking button', () => {
    render(<WrappedComponent/>);

    fireEvent.click(screen.getByTestId('btn-close-modal'));

    expect(setIsModalOpen).toBeCalled();
});

it('should get QR code', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
        text: () => Promise.resolve(`<img id="qr-code" src="${exampleQrCodeSrc}" alt="qr code">`)
    }));
    const {container} = render(<WrappedComponent isQrCodeRequested={true}/>);

    await waitFor(() => {
        const qrCode = container.querySelector('#qr-code');
        expect(qrCode).toBeTruthy();
    });
});

it('should display error if fetching QR code failed', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject({
        text: () => Promise.reject('Error')
    }));
    const {container} = render(<WrappedComponent isQrCodeRequested={true}/>);

    await waitFor(() => {
        const qrError = container.querySelector('#qr-error');
        expect(qrError).toBeTruthy();
    });
});
