import React from 'react';
import classes from './Column.module.css';
const column = (props) =>{
        let columClass =' col-'+props.block.params.breakPoint.value;
        if(props.block.params.span.value)
        {
                columClass+='-'+props.block.params.span.value;
        }
        return(
        <div className={classes.Column+columClass}>
                {props.children.length>0?props.children:"drop something in the column"}
        </div>
);}

export default column;