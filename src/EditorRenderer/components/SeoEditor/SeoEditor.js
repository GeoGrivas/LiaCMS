import React,{useState} from 'react';
function SeoEditor(props) {

    const[title,setTitle]=useState(props.title);
    const[description,setDescription]=useState(props.description);
    const[image,setImage]=useState(props.image);
    const[type,setType]=useState(props.type);
    return (<div>
        <form onSubmit={(e)=>{e.preventDefault(); props.onSave({title,description,image,type})}}>
            <label>
                Title
        <input value={title} onChange={(e)=>{setTitle(e.target.value)}} />
            </label>
            <label>
                Description
        <input value={description} onChange={(e)=>{setDescription(e.target.value)}} />
            </label>
            <label>
                Image
        <input value={image} onChange={(e)=>{setImage(e.target.value)}} />
            </label>
            <label>
                Type
        <input value={type} onChange={(e)=>{setType(e.target.value)}} />
            </label>
            <button type="submit">Save</button>
        </form>
    </div>);
}

export default SeoEditor;