import React, {useEffect, useState} from "react";
import ReactModal from "react-modal";
import {useSelector} from "react-redux";

function Modal({content, customRoot, modalIsOpen}) {
    const root = customRoot || document.getElementById('react'); // customRoot is for test purposes
    const darkMode = useSelector(state => state.darkMode);
    const backgroundColor = darkMode ? '#343A40' : '#FFFFF';
    const [showModal, setShowModal] = useState(false);
    const customStyles = {
        content: {
            backgroundColor,
            borderColor: backgroundColor,
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        },
    };

    useEffect(() => {
        setShowModal(modalIsOpen);
    });

    ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.4)';

    return (
        <ReactModal
            isOpen={showModal}
            appElement={root}
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            style={customStyles}
            contentLabel="Edycja"
        >
            {content}
        </ReactModal>
    );
}

export default Modal;