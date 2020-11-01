import React from 'react';
//import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';
const logo=(props)=>(
    <div className={classes.Logo} style={{height:props.height}}>
        <img src='https://cdn.vox-cdn.com/thumbor/RGBarB5We5G6uUr2eMDjVGRBER8=/1400x788/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/11897399/firefox_logos.jpg' alt="My Logo"/>
    </div>
);

export default logo;