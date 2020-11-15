import React from 'react';
import classes from './DraggableItem.module.css';
const draggableItem=(props)=>(
<div className={classes.draggableItem} draggable="true" onDragStart={(event)=>{props.onDragStart(event,props.data)}} onDragEnd={event=>{props.onDragEnd(event);}}>{props.children}</div>
);

export default draggableItem;