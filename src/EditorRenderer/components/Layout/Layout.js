import React from 'react';
import classes from './Layout.module.css';

const layout = (props)=>(
<div  onDrop={(event)=>{props.onDrop(event,null)}} className={classes.Main}>{props.children}</div>
);

export default layout;