/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugList from "../../components/DrugList";
import {BrowserRouter} from "react-router-dom";
import {fireEvent, render, screen} from "@testing-library/react";
import {DrugListContainer} from "../../container/DrugListContainer";
import drugs from "./fixtures/drugs";
import {act} from "react-dom/test-utils";

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

it('should correctly render DrugList', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <BrowserRouter>
            <DrugList isEditMode={true}/>
        </BrowserRouter>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should render add drug form after clicking add button', () => {
    renderDrugList();
    fireEvent.click(screen.getByTestId('add-drug'));
    expect(screen.getByRole('form')).toBeVisible();
});

it('should render edit drug form after clicking edit button', () => {
    renderDrugList();
    // click edit button near first list item
    fireEvent.click(screen.getByTestId('edit-drug-1')); // from data-testid, 1 is id of first item
    expect(screen.getByRole('form')).toBeVisible();
});

it('should delete drug from list after clicking delete button',  async () => {
    await act(() => {
        renderDrugList();
    });
    const drugListLengthBeforeDelete = screen.getAllByTestId('drug').length;

    await act(async () => {
        fireEvent.click(screen.getByTestId('remove-drug-1'));
    });
    const drugListLengthAfterDelete = screen.getAllByTestId('drug').length;

    expect(drugListLengthAfterDelete).toBeLessThan(drugListLengthBeforeDelete);
});