import React from 'react';
import classes from './Label.module.css';
const Label =(props)=>(
    <span className={classes.label +" "+classes[props.block.params.style?.value]}>
        {props.block.params["text"].value}
    </span>
)

export default Label;