import React, {useState} from "react";
import {sendOrDeleteData} from "../../utils/sendOrDeleteData";
import Modal from "../modal/Modal";
import StatusOkModalContent from "../modal/content/profile-form/StatusOkModalContent";
import StatusFailModalContent from "../modal/content/profile-form/StatusFailModalContent";
import {useDispatch, useSelector} from "react-redux";
import {setUserData} from "../../features/user/userSlice";

function ProfileForm() {
    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [inputValues, setInputValues] = useState(userData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postRequestStatus, setPostRequestStatus] = useState(undefined);

    const handleInputChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        setInputValues(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = async () => {
        await sendOrDeleteData(null, inputValues, 'POST', 'change-user-data').then(response => {
            if (response.status === 200) {
                setPostRequestStatus('OK');
                dispatch(setUserData(inputValues));
            } else {
                setPostRequestStatus('FAIL');
            }
            console.log(response);
        }).catch(error => {
            console.log(error);
        });
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="card mt-3">
                <div className="card-header text-center">Ustawienia profilu</div>
                <div className="card-body">
                    <form role="form" name="profile_form" onSubmit={async e => {
                        e.preventDefault();
                        await handleSubmit();
                    }}>
                        <div className="form-floating mt-3">
                            <input type="text" className="form-control" id="name" name="name"
                                   placeholder="Imię" data-testid="firstName" defaultValue={userData.name}
                                   onChange={handleInputChange} required
                            />
                            <label htmlFor="name">Imię</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="email" className="form-control" id="email" name="email"
                                   placeholder="Email" data-testid="email" defaultValue={userData.email}
                                   onChange={handleInputChange} required
                            />
                            <label htmlFor="name">Email</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="password" className="form-control" id="oldPassword" name="oldPassword"
                                   placeholder="Stare hasło" data-testid="oldPassword" onChange={handleInputChange}
                            />
                            <label htmlFor="name">Stare hasło</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="password" className="form-control" id="newPassword" name="newPassword"
                                   placeholder="Nowe hasło" data-testid="newPassword" onChange={handleInputChange}
                            />
                            <label htmlFor="name">Nowe hasło</label>
                        </div>
                        <div className="form-floating mt-3">
                            <input type="password" className="form-control" id="newPasswordRepeated"
                                   name="newPasswordRepeated"
                                   placeholder="Nowe hasło" data-testid="newPasswordRepeated"
                                   onChange={handleInputChange}
                            />
                            <label htmlFor="name">Powtórz nowe hasło</label>
                        </div>
                        <div className="d-grid mt-3">
                            <button className="btn btn-primary">Zapisz <i className="fa-solid fa-floppy-disk"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {
                postRequestStatus === 'OK' ?
                    <Modal isOpen={isModalOpen} content={<StatusOkModalContent setIsModalOpen={setIsModalOpen}/>}/> :
                    <Modal isOpen={isModalOpen} content={<StatusFailModalContent setIsModalOpen={setIsModalOpen}/>}/>
            }
        </>
    );
}

export default ProfileForm;