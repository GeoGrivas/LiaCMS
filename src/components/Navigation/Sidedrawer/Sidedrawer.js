import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import Backdrop from '../../UI/Backdrop/Backdrop';
import classes from '../Sidedrawer/Sidedrawer.module.css';
import Aux from '../../../hoc/Auxilary';
const sidedrawer=(props)=>
{
    let attachedClasses=[classes.SideDrawer,classes.Close];
    if(props.open)
    {
        attachedClasses=[classes.SideDrawer,classes.Open];
    }
    return (
        <Aux>
        <Backdrop show={props.open} click={props.close}/>
        <div className={attachedClasses.join(' ')}>
            <Logo value={props.logo} height='11%'></Logo>
            <nav onClick={props.close}>
            <NavigationItems navItems={props.navItems} isAuthenticated={props.isAuth}></NavigationItems>
            </nav>
        </div>
        </Aux>
    );
};

export default sidedrawer;