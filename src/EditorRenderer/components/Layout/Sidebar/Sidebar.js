import React from 'react';
import classes from './Sidebar.module.css';

const sidebar=(props)=>(
    <div className={classes.Sidebar}>
        <ul className={classes.List}>
        {props.children}
        </ul>
    </div>
);

export default sidebar;