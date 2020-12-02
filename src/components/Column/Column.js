import React from 'react';
import classes from './Column.module.css';
const column = (props) =>{
        let breakPoint=props.block.params.breakPoint.value;

        let columClass =' col'+(breakPoint!=''?"-"+breakPoint:'');
        if(props.block.params.span.value)
        {
                columClass+='-'+props.block.params.span.value;
        }
        return(
        <div className={classes.Column+columClass} style={{textAlign:props.block.params.textAlign?props.block.params.textAlign.value:''}}>
                {props.children.length>0?props.children:"drop something in the column"}
        </div>
);}

export default column;