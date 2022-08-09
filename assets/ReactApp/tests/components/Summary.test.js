/**
 * @jest-environment jsdom
 * */
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import Summary from "../../components/Summary";
import {render, screen} from "@testing-library/react";
import {DrugListContainer} from "../../container/DrugListContainer";
import drugs from "./fixtures/drugs";
import {BrowserRouter} from "react-router-dom";
import dayjs from "dayjs";

it('should correctly render summary', () => {
    const renderer = new ReactShallowRenderer();
    renderer.render(
        <DrugListContainer.Provider initialState={drugs}>
            <Summary/>
        </DrugListContainer.Provider>
    );

    expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it('should display drug dosing schedule with correct values', () => {
    render(
        <DrugListContainer.Provider initialState={drugs}>
            <BrowserRouter>
                <Summary customDate={dayjs('2022-01-01T16:00:00')}/>
            </BrowserRouter>
        </DrugListContainer.Provider>
    );

    expect(screen.getByTestId('schedule-drugName').textContent).toContain('Xanax');
    expect(screen.getByTestId('schedule-dosingHour').textContent).toContain('18:00');
});