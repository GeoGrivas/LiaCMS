import React from 'react';
import classes from './Section.module.css';
const  Section=(props)=>(
    <section className={classes.Section}>
        {props.children}
    </section>
    );

    export default Section;