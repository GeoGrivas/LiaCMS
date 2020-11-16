import React from 'react';
const paragraph = (props)=>{
    return(
    <p className={props.block.params.style?.value}>
        {props.block.params["text"].value}
    </p>);
}

export default paragraph;