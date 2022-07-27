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

const renderDrugList = () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    render(
        <DrugListContainer.Provider initialState={drugs}>
            <BrowserRouter>
                <DrugList isEditMode={true} customRoot={root}/>
            </BrowserRouter>
        </DrugListContainer.Provider>
    );
};

it('should correctly render modal content with form', () => {
    const renderer = new ReactShallowRenderer();
    const setIsModalOpen = jest.fn();
    renderer.render(<DrugModalContent drug={drugs[0]} setIsModalOpen={setIsModalOpen}/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should render modal content with drug data after clicking edit button', () => {
    renderDrugList();

    // click edit button near first list item
    fireEvent.click(screen.getByTestId('edit-drug-1')); // from data-testid, 1 is id of first item

    expect(screen.getByRole('form')).toHaveFormValues({
        name: drugs[0].name,
        unit: drugs[0].unit,
        quantity: drugs[0].quantity,
        quantityMax: drugs[0].quantityMax,
        dosing: drugs[0].dosing,
        daily_dosing: Object.keys(drugs[0].dosingMoments).length,
        hour1: drugs[0].dosingMoments["1"],
        hour2: drugs[0].dosingMoments["2"]
    });
});

it('should render modal with empty input fields in most and one default value after clicking add button', () => {
    renderDrugList();
    fireEvent.click(screen.getByTestId('add-drug'));
    expect(screen.getByRole('form')).toHaveFormValues({daily_dosing: 1});
});

it('should add dosing moment input after increasing daily dosing input value in add drug form', () => {
    renderDrugList();
    fireEvent.click(screen.getByTestId('add-drug'));

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 2}});

    expect(screen.getAllByRole('timer').length).toBeGreaterThan(1);
}); 