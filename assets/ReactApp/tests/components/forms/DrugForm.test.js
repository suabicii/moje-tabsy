/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import DrugForm from "../../../components/forms/DrugForm";
import {fireEvent, render, screen} from "@testing-library/react";
import drugs from "../fixtures/drugs";

const renderForm = (drug = null) => {
    const setIsFormVisible = jest.fn();
    if (drug) {
        render(<DrugForm drug={drug} setIsFormVisible={setIsFormVisible}/>);
    } else {
        render(<DrugForm setIsFormVisible={setIsFormVisible}/>);
    }
};

it('should correctly render DrugForm', () => {
    const renderer = new ReactShallowRenderer();
    const setIsFormVisible = jest.fn();
    renderer.render(<DrugForm setIsFormVisible={setIsFormVisible}/>);
    expect(renderer.getRenderOutput).toMatchSnapshot();
});

it('should render modal content with drug data after clicking edit button', () => {
    renderForm(drugs[0]);

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