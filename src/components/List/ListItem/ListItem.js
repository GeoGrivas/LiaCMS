import React from 'react';


const ListItem = props => (
    <li>{props.children.length>0?props.children:'drop something here!'}</li>
);

export default ListItem;