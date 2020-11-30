import React from 'react';
const SimpleText = (props)=>{
    return(
    <span className={props.block.params.style?.value}>
        {props.block.params["text"].value}
    </span>);
}

export default SimpleText;