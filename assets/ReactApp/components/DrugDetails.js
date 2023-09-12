import React from "react";
import DosingMoments from "./DosingMoments";

function DrugDetails({drug}) {
    return (
        <>
            <button
                type="button"
                className="btn dropdown-toggle border-0 pt-0 pb-1 px-1 ml-2"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseHours${drug.id}`}
                aria-expanded="false"
                aria-controls={`#collapseHours${drug.id}`}
            >
                Szczegóły
            </button>
            <div className="list-group collapse mt-2" id={`collapseHours${drug.id}`}>
                <h6>Godziny przyjmowania dawek:</h6>
                <ul className="list-group">
                    <DosingMoments drugId={drug.id} content={drug.dosingMoments}
                                   className="list-group-item"/>
                </ul>
            </div>
        </>
    );
}

export default DrugDetails;