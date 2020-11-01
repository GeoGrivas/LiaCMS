import React from 'react';
import classes from './Image1.module.css';


const Image1 =(props)=>(
    <img alt={props.block.params.alt.value} className={classes.Img} src={props.block.params.src.value}/>
);

export default Image1;