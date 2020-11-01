import React from 'react';
import classes from './Header.module.css';
//import img from '../../assets/code.jpg';
//import Image from 'next/image';
const Header = props => {
    return (
    <div className={classes.Header} style={{ backgroundImage: "url(" + (props.block.params.backgroundImage.value==='default' ?'/code.jpg':props.block.params.backgroundImage.value) + ")" }}>
        <div className={classes.MessageContainer}>
            <div className={classes.Message}>
                <h1>{props.block.params.title.value}</h1>
                <span>{props.block.params.subtitle.value}</span>
            </div>
        </div>
    </div>);}

export default Header;