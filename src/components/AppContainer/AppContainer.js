import React from 'react';
import classes from './AppContainer.module.css';
const appContainer = (props) => (<div className={classes.AppContainer}>
    {props.children}
 </div>);

export default appContainer;