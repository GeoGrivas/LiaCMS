import React,{useState} from 'react';
function SeoEditor(props) {
    let title=props.title?props.title:'';
    //const[title,setTitle]=useState(props.title?props.title:'');
    const[description,setDescription]=useState(props.description?props.description:'');
    const[image,setImage]=useState(props.image?props.image:'');
    const[type,setType]=useState(props.type?props.type:'');
    console.log(props);
    return (<div>
        <form onSubmit={(e)=>{e.preventDefault(); console.log('save'); props.onSave({title,description,image,type})}}>
            <label>
                Title
        <input defaultValue={title} onChange={(e)=>{title=e.target.value}} />
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