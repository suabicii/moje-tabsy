import React, {useEffect, useState} from "react";
import ReactModal from "react-modal";

function Modal(props) {
    const [showModal, setShowModal] = useState(false);
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    useEffect(() => {
        setShowModal(props.modalIsOpen);
    });

    return (
        <ReactModal
            isOpen={showModal}
            appElement={document.getElementById('react')}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            style={customStyles}
            contentLabel="Edycja"
        >
            {props.content}
        </ReactModal>
    );
}

export default Modal;