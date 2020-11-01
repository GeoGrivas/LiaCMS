import React from 'react';
import classes from './SidedrawerToggler.module.css';
const sidedrawerToggler=(props)=>
{
    
    return (
     <div className={classes.DrawerToggle} onClick={props.toggleSidedrawer}>
         <div></div>
         <div></div>
         <div></div>
    </div>
    );
};

export default sidedrawerToggler;