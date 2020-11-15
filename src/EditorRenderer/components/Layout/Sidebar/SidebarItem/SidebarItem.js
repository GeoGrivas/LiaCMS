import React from 'react';
import classes from './SidebarItem.module.css';
const sidebarItem=(props)=>(
<div className={classes.SidebarItem+' '+(props.scrollable?classes.scrollable:'')}>{props.children}</div>
);

export default sidebarItem;