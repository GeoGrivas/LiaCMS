import React from 'react';

const draggableItem=(props)=>(
<div draggable="true" onDragStart={(event)=>{props.onDragStart(event,props.data)}} onDragEnd={event=>{props.onDragEnd(event);}}>{props.children}</div>
);

export default draggableItem;