import React from 'react';
const paragraph = (props)=>{
    return(
    <p>
        {props.block.params["text"].value}
    </p>);
}

export default paragraph;