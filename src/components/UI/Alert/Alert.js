import React from 'react';
import classes from './Alert.module.css';
const Alert=(props)=>{
    return(
    <div className={classes.alert + " "+ classes[props.class]}>
        <button className={classes.closeBtn} onClick={props.onClose}>&times;</button>
        {props.children}
    </div>);
}

export default Alert;