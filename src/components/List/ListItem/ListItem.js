import React from 'react';
import classes from './ListItem.module.css';

const ListItem = props => (
    <li className={classes.ListItem}>{props.children.length>0?props.children:'drop something here!'}</li>
);

export default ListItem;