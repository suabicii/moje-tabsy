import React from "react";
import {useSelector} from "react-redux";

function DeleteConfirmationModalContent({setIsModalOpen, confirmDeletion, drugId}) {
    const darkMode = useSelector(state => state.darkMode);

    return (
        <div className="container text-center" role="dialog" data-testid="delete-confirmation">
            <h2 className="text-danger-emphasis">Czy na pewno chcesz usunąć dany lek/suplement?</h2>
            <div className="grid mt-4">
                <button className="btn btn-danger me-lg-2" data-testid="yes" onClick={() => {
                    confirmDeletion(drugId);
                    setIsModalOpen(false);
                }}>Tak <i className="fa-solid fa-check"></i>
                </button>
                <button className={`btn btn-${darkMode ? 'light' : 'dark'} ms-lg-2 mt-lg-0 mt-2`} data-testid="no" onClick={() => {
                    setIsModalOpen(false);
                }}>Nie <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
    );
}

export default DeleteConfirmationModalContent;