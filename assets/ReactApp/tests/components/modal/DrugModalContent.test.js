/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugModalContent from "../../../components/modal/DrugModalContent";
import DrugList from "../../../components/DrugList";
import {BrowserRouter} from "react-router-dom";
import drugs from "../fixtures/drugs";
import {DrugListContainer} from "../../../container/DrugListContainer";
import {fireEvent, render, screen} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

it('should correctly render modal content with form', () => {
    const renderer = new ReactShallowRenderer();
    const setIsModalOpen = jest.fn();
    renderer.render(<DrugModalContent drug={drugs[0]} setIsModalOpen={setIsModalOpen}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should render modal content with drug data after clicking edit button', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    render(
        <DrugListContainer.Provider initialState={drugs}>
            <BrowserRouter>
                <DrugList isEditMode={true} customRoot={root}/>
            </BrowserRouter>
        </DrugListContainer.Provider>
    );

    // click edit button near first list item
    fireEvent.click(screen.getByTestId('edit-drug-1')); // from data-testid, 1 is id of first item

    expect(screen.getByRole('form')).toHaveFormValues({
        name: drugs[0].name,
        unit: drugs[0].unit,
        quantity: drugs[0].quantity,
        quantityMax: drugs[0].quantityMax,
        dosing: drugs[0].dosing,
        hour1: drugs[0].dosingMoments["1"],
        hour2: drugs[0].dosingMoments["2"]
    });
});