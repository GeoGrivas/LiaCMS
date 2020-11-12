import React, { useState,useEffect } from 'react';
import Modal from '../../../components/UI/Modal/Modal';
function SeoEditor(props) {

    const [state,setState]=useState({
        title:props.title!==null?props.title:'' ,
        description:props.description!==null?props.description:'' ,
        image:props.image!==null?props.image:'' ,
        type:props.type!==null?props.type:''
    });
    const [showModal,setShowModal]=useState(false);
    useEffect(() => {
       setShowModal(true);
    },[]);
    return (
        <Modal show={showModal} modalClosed={props.modalClosed}>
            <div>
                <form onSubmit={(e) => { e.preventDefault(); console.log('save'); props.onSave({ title:state.title, description:state.description, image:state.image, type:state.type }) }}>
                    <label>
                        Title
        <input value={state.title} onChange={(e) => { setState((prevState)=>({...prevState,title:e.target.value})) }} />
                    </label>
                    <label>
                        Description
        <input value={state.description} onChange={(e) => { setState((prevState)=>({...prevState,description:e.target.value})) }} />
                    </label>
                    <label>
                        Image
        <input value={state.image} onChange={(e) => { setState((prevState)=>({...prevState,image:e.target.value})) }} />
                    </label>
                    <label>
                        Type
        <input value={state.type} onChange={(e) => { setState((prevState)=>({...prevState,type:e.target.value})) }} />
                    </label>
                    <button type="submit">Save</button>
                </form>
            </div>
        </Modal>
    );
}

export default SeoEditor;