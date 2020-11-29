import React from 'react';
import classes from './Row.module.css';
const row=(props)=>(
<div
    className={classes.Row+' row '+props.block.params.backgroundColor?.value}
    style={{justifyContent:props.block.params.justifyContent.value,
        alignItems:props.block.params.alignItems.value}}
    > {props.children.length>0?props.children:"drop something in the row"}
</div>
)

export default row;
