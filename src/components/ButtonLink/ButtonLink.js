import React from 'react';
import classes from './ButtonLink.module.css';


const ButtonLink=(props)=>(
<a className={classes.ButtonLink} href={props.block.params.url.value}>{props.block.params.text.value}</a>
);

export default ButtonLink;