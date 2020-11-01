import React from 'react';
import classes from './SidebarItem.module.css';
const sidebarItem=(props)=>(
<li className={classes.SidebarItem}>{props.children}</li>
);

export default sidebarItem;