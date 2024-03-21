/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import renderer from 'react-test-renderer';
import {Provider} from "react-redux";
import store from "../../../../../store";
import QrCodeModalContent from "../../../../../components/modal/content/qrcode/QrCodeModalContent";
import {fireEvent, render, screen} from "@testing-library/react";

const setIsModalOpen = jest.fn();

function WrappedComponent() {
    return (
        <Provider store={store}>
            <QrCodeModalContent setIsModalOpen={setIsModalOpen}/>
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