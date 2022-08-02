/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugForm from "../../../components/forms/DrugForm";
import {fireEvent, render, screen} from "@testing-library/react";
import drugs from "../fixtures/drugs";
import {DrugListContainer} from "../../../container/DrugListContainer";
import {BrowserRouter} from "react-router-dom";
import DrugList from "../../../components/DrugList";

const renderForm = (drug = null) => {
    const setIsFormVisible = jest.fn();
    if (drug) {
        render(
            <DrugListContainer.Provider initialState={drugs}>
                <DrugForm drug={drug} setIsFormVisible={setIsFormVisible}/>
            </DrugListContainer.Provider>
        );
    } else {
        render(
            <DrugListContainer.Provider initialState={drugs}>
                <DrugForm setIsFormVisible={setIsFormVisible}/>
            </DrugListContainer.Provider>
        );
    }
};

it('should correctly render DrugForm', () => {
    const renderer = new ReactShallowRenderer();
    const setIsFormVisible = jest.fn();
    renderer.render(
        <DrugListContainer.Provider>
            <DrugForm setIsFormVisible={setIsFormVisible}/>
        </DrugListContainer.Provider>
    );
    expect(renderer.getRenderOutput).toMatchSnapshot();
});

it('should render drug edit form with drug data', () => {
    renderForm(drugs[0]);

    expect(screen.getByRole('form')).toHaveFormValues({
        name: drugs[0].name,
        unit: drugs[0].unit,
        quantity: drugs[0].quantity,
        quantityMax: drugs[0].quantityMax,
        dosing: drugs[0].dosing,
        daily_dosing: Object.keys(drugs[0].dosingMoments).length,
        hour1: drugs[0].dosingMoments["hour1"],
        hour2: drugs[0].dosingMoments["hour2"]
    });
});

it('should render modal with empty input fields in most and one default value after clicking add button', () => {
    renderForm();
    expect(screen.getByRole('form')).toHaveFormValues({daily_dosing: 1});
});

it('should add dosing moment input after increasing daily dosing input value in add drug form', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 2}});

    expect(screen.getAllByRole('timer').length).toBeGreaterThan(1);
});

it('should remove dosing moment input added before after decreasing daily dosing input value in add drug form', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 2}});
    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 1}});

    expect(screen.getAllByRole('timer').length).toBe(1);
});

it('should add dosing moment input after increasing more than once daily dosing input value in edit drug form', () => {
    renderForm(drugs[0]);

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 2}});
    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 3}});

    expect(screen.getAllByRole('timer').length).toBeGreaterThan(2);
});

it('should remove dosing moment input after decreasing daily dosing input value in edit drug form', () => {
    renderForm(drugs[0]);

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 3}});
    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 2}});

    expect(screen.getAllByRole('timer').length).toBe(2);
});

it('should change dosing moment input amount to correct value after manually writing any daily dosing input value any times in edit drug form', () => {
    renderForm(drugs[0]);

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 8}});
    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 4}});

    expect(screen.getAllByRole('timer').length).toBe(4);
});

it('should remove dosing moment inputs with values from database after decreasing daily dosing input value in edit drug form', () => {
    renderForm(drugs[0]);

    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: 1}}); // decreased value from value equaled 2

    expect(screen.getAllByRole('timer').length).toBe(1);
});

it('should add drug to list', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    render(
        <DrugListContainer.Provider initialState={drugs}>
            <BrowserRouter>
                <DrugList isEditMode={true} customRoot={root}/>
            </BrowserRouter>
        </DrugListContainer.Provider>
    );
    const drugListLengthBeforeUpdate = screen.getAllByTestId('drug').length;

    fireEvent.click(screen.getByTestId('add-drug')); // activate add drug form

    fireEvent.change(screen.getByTestId('drugName'), {target: {value: 'Prozac'}});
    fireEvent.change(screen.getByTestId('unit'), {target: {value: 'pcs'}});
    fireEvent.change(screen.getByTestId('dosing'), {target: {value: '1'}});
    fireEvent.change(screen.getByTestId('quantity'), {target: {value: '120'}});
    fireEvent.change(screen.getByTestId('quantityMax'), {target: {value: '120'}});
    fireEvent.change(screen.getByTestId('dailyDosing'), {target: {value: '1'}});
    fireEvent.change(screen.getByTestId('hour1-test'), {target: {value: '07:00'}});
    fireEvent.submit(screen.getByRole('form'));

    const drugListLengthAfterUpdate = screen.getAllByTestId('drug').length;

    expect(drugListLengthAfterUpdate).toBeGreaterThan(drugListLengthBeforeUpdate);
});