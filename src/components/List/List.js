import React from 'react';
import classes from './List.module.css';
const List =props=>{
    let list=null;
    if(props.block.params.type.value==='unordered')
    {
        list=(<ul className={classes.List} style={{listStyleType:props.block.params.style.value}}>
            {props.children}
        </ul>);
    }else
    {
        list=(<ol className={classes.List} style={{listStyleType:props.block.params.style.value}}>
            {props.children}
        </ol>);
    }
    return list;
};

export default List;