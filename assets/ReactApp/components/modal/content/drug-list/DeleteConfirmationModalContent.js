import React from "react";

function DeleteConfirmationModalContent({setIsModalOpen}) {
    return (
        <div className="container text-center" role="dialog" data-testid="delete-confirmation">
            <h2 className="text-success">Czy na pewno chcesz usunąć dany lek/suplement?</h2>
            <div className="grid mt-2">
                <button className="btn btn-danger me-lg-4" data-testid="yes" onClick={() => {
                    setIsModalOpen(false);
                }}>Tak <i className="fa-solid fa-check"></i>
                </button>
                <button className="btn btn-outline-dark ms-lg-2 mt-lg-0 mt-2" data-testid="no" onClick={() => {
                    setIsModalOpen(false);
                }}>Nie <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    );
}

export default DeleteConfirmationModalContent;