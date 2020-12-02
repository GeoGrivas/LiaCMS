import React from 'react';
import classes from './Image1.module.css';

const Image1 =(props)=>{
    let classList=[classes.Img];
    if(props.block.params.style?.value!='')
    {
        classList.push(classes[props.block.params.style.value]);
    }
    return <img alt={props.block.params.alt.value} className={classList.join(' ')} src={props.block.params.src.value==='default' ?'/300x300.png':props.block.params.src.value}/>
};

export default Image1;