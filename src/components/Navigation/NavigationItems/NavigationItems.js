import React from 'react';
import classes from './NavigationItems.module.css';
const navigationItems = (props) => {
   
    return (<ul className={classes.NavigationItems}>
        {props.navItems}
    </ul>);
};

export default navigationItems;