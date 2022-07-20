import React from "react";

function DrugModalContent(props) {
    return (
        <>
            <button className="btn btn-close" onClick={() => {
                props.setIsModalOpen(false);
            }}>
            </button>
            <h3 className="mt-2 text-center">Edytuj</h3>
            <form onSubmit={e => {
                e.preventDefault();
            }}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-floating mt-3">
                            <input type="text" className="form-control" id="name" placeholder="Nazwa"/>
                            <label htmlFor="name">Nazwa</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="text" className="form-control" id="unit" placeholder="Jednostka"/>
                            <label htmlFor="unit">Jednostka (szt., ml. itp.)</label>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-floating mt-3">
                            <input type="number" step="1" className="form-control" id="quantity" placeholder="Bieżąca ilość"/>
                            <label htmlFor="quantity">Bieżąca ilość</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="number" step="1" className="form-control" id="quantityMax"
                                   placeholder="Ilość całkowita"/>
                            <label htmlFor="quantityMax">Ilość całkowita</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating mt-3">
                    <input type="number" step="1" className="form-control" id="dosing"
                           placeholder="Dawkowanie (ile razy dziennie)" value="1" aria-valuemin="1"/>
                    <label htmlFor="dosing">Dawkowanie (ile razy dziennie)</label>
                </div>
                <div className="dosing-hours mt-3">
                    <h4 className="text-center">Godziny przyjęcia dawki</h4>
                    <div className="input-group mt-3">
                        <span className="input-group-text"><i
                            className="fa-solid fa-clock"></i></span>
                        <input type="time" name="hour1" className="form-control" aria-label="Godzina przyjęcia dawki"/>
                    </div>
                </div>
                <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-info px-5">Zapisz</button>
                    <button type="button" className="btn btn-outline-dark px-5" onClick={() => {
                        props.setIsModalOpen(false);
                    }}>
                        Anuluj
                    </button>
                </div>
            </form>
        </>
    );
}

export default DrugModalContent;