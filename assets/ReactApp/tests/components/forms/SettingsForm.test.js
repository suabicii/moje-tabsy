/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import SettingsForm from "../../../components/forms/SettingsForm";
import {fireEvent, render, screen} from "@testing-library/react";

const renderForm = () => {
    render(<SettingsForm/>);
};

it('should correctly render SettingsForm', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(<SettingsForm/>);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should add remind time input after increasing reminder amount value', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 2}});

    expect(screen.getAllByTestId('remindTime').length).toBeGreaterThan(1);
});

it('should remove remind time input added before after decreasing reminder amount value', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 2}});
    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 1}});

    expect(screen.getAllByTestId('remindTime').length).toBe(1);
});

it('should add remind time input after increasing more than once reminder amount value', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 2}});
    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 3}});

    expect(screen.getAllByTestId('remindTime').length).toBeGreaterThan(2);
});

it('should remove remind time input after decreasing reminder amount value', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 3}});
    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 2}});

    expect(screen.getAllByTestId('remindTime').length).toBe(2);
});

it('should change remind time input amount to correct value after manually writing any reminder amount value any times', () => {
    renderForm();

    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 8}});
    fireEvent.change(screen.getByTestId('reminderAmount'), {target: {value: 4}});

    expect(screen.getAllByTestId('remindTime').length).toBe(4);
});