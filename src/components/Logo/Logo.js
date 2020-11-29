import React from 'react';
//import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';
const logo = (props) => {
    if (props.value.startsWith("http")) {
        return (
            <div className={classes.Logo} style={{ height: props.height }}>
                <img src={props.value} alt="My Logo" />
            </div>);
    } else {
        return (<h2>{props.value}</h2>);
    }
};

export default logo;