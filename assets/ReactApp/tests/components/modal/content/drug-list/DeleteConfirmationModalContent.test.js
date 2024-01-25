/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DeleteConfirmationModalContent
    from "../../../../../components/modal/content/drug-list/DeleteConfirmationModalContent";
import {fireEvent, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../../../../store";

const setIsModalOpen = jest.fn();
const confirmDeletion = jest.fn();

function WrappedComponent() {
    return (
        <Provider store={store}>
            <DeleteConfirmationModalContent setIsModalOpen={setIsModalOpen} drugId={1} confirmDeletion={confirmDeletion}/>
        </Provider>
    );
}

it('should correctly render DeleteConfirmationModalContent', () => {
    const renderer = new ReactShallowRenderer();

    renderer.render(<WrappedComponent/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should close modal after clicking "No"', () => {
    render(<WrappedComponent/>);

    fireEvent.click(screen.getByTestId('no'));

    expect(setIsModalOpen).toBeCalledWith(false);
});