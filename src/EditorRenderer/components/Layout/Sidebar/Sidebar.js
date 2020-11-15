import React from 'react';
import classes from './Sidebar.module.css';

const sidebar=(props)=>(
    <div className={classes.Sidebar}>
         {props.children}
      
    </div>
);

export default sidebar;