import React from 'react';
//import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';
const logo = (props) => (
    <div className={classes.Logo} style={{ height: props.height }}>
        {props.value.startsWith("http") ?
            <img src={props.value} alt="My Logo" />
            : <h2>{props.value}</h2>
        }
    </div>
);

export default logo;