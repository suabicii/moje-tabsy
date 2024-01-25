/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DeleteConfirmationModalContent
    from "../../../../../components/modal/content/drug-list/DeleteConfirmationModalContent";
import {fireEvent, render, screen} from "@testing-library/react";

it('should correctly render DeleteConfirmationModalContent', () => {
    const renderer = new ReactShallowRenderer();
    const setIsModalOpen = jest.fn();

    renderer.render(<DeleteConfirmationModalContent setIsModalOpen={setIsModalOpen}/>);

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should close modal after clicking "No"', () => {
    const setIsModalOpen = jest.fn();
    render(<DeleteConfirmationModalContent setIsModalOpen={setIsModalOpen}/>);

    fireEvent.click(screen.getByTestId('no'));

    expect(setIsModalOpen).toBeCalledWith(false);
});