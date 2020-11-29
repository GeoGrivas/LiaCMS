import Link from 'next/link';
import React from 'react';
import classes from './Link.module.css';
const paragraph = (props) => {
    return (
        <Link href={props.block.params.url.value}>
            <a className={classes.link+" "+props.block.params.style?.value}>
                {props.block.params["text"].value}
            </a>
        </Link>);
}

export default paragraph;