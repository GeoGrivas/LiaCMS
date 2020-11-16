import React from 'react';
import classes from './Sidebar.module.css';

const sidebar=(props)=>(
    <div id='sidebar' className={classes.Sidebar}>
         {props.children}
      
    </div>
);

export default sidebar;