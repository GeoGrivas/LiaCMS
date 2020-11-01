import classes from './EditorLogin.module.css';
import React from 'react';
import Authentication from '../../../components/Authentication/Authentication';


 const EditorLogin=props=>(
    <div className={classes.LoginContainer}>
        <Authentication/>
    </div>
);
export default EditorLogin;