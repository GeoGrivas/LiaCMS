import React, { useState, useEffect } from 'react';
import Modal from '../../../components/UI/Modal/Modal';
function SeoEditor(props) {

    const [state, setState] = useState({
        title: props.title !== null ? props.title : '',
        description: props.description !== null ? props.description : '',
        image: props.image !== null ? props.image : '',
        type: props.type !== null ? props.type : ''
    });
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setShowModal(true);
    }, []);
    const closeModal = () => {
        setShowModal(false);
        setTimeout(() => {
            props.modalClosed();
        }, 500);
    };
    return (
        <Modal show={showModal} modalClosed={closeModal}>
            <div>
                <form onSubmit={(e) => { e.preventDefault(); console.log('save'); props.onSave({ title: state.title, description: state.description, image: state.image, type: state.type }) }}>
                    <div >
                        <label>
                            Title
        <input value={state.title} onChange={(e) => { const value=e.target.value; setState((prevState) => ({ ...prevState, title: value })) }} />
                        </label>
                    </div>
                    <div>

                        <label>
                            Description
        <input value={state.description} onChange={(e) => { const value=e.target.value; setState((prevState) => ({ ...prevState, description: value })) }} />
                        </label>
                    </div>
                    <div>

                        <label>
                            Image
        <input value={state.image} onChange={(e) => { const value=e.target.value; setState((prevState) => ({ ...prevState, image: value })) }} />
                        </label>
                    </div>
                    <div>

                        <label>
                            Type
        <input value={state.type} onChange={(e) => { const value=e.target.value; setState((prevState) => ({ ...prevState, type: value })) }} />
                        </label>
                    </div>
                    <div>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default SeoEditor;