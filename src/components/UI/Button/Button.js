import React from 'react';
import classes from './Button.module.css';
const Button = (props)=>(
    <button
    disabled={props.disabled}
    className={[classes.button, classes[props.class]].join(' ')} onClick={props.onClick}>{props.children}</button>
);

export default Button;