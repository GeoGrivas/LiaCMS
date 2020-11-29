import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import SidedrawerToggler from '../SidedrawerToggler/SidedrawerToggler';
const toolbar=(props)=>(
    <header className={classes.Toolbar+" "+props.backgroundColor}>
        <SidedrawerToggler toggleSidedrawer={props.toggleSidedrawer}/>
        <Logo value={props.logo} height='80%'></Logo>
        <nav className={classes.DesktopOnly}>
            <NavigationItems navItems={props.navItems} isAuthenticated={props.isAuth}></NavigationItems>
        </nav>
    </header>
);

export default toolbar;