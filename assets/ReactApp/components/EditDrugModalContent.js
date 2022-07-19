import React from "react";

function EditDrugModalContent(props) {
    return (
        <>
            <button className="btn btn-close" onClick={() => {
                props.setIsEditModalOpen(false);
            }}>
            </button>
            <h3 className="mt-2">Edytuj</h3>
        </>
    );
}

export default EditDrugModalContent;