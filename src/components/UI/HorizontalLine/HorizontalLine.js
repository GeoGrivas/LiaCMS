
import React from 'react';
import classes from './HorizontalLine.module.css';
const HorizontalLine=(props)=>(
    <hr className={[classes.Hr,classes[props.block.params.style.value]].join(' ')}/>
);
export default HorizontalLine;