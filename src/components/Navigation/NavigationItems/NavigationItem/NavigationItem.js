import React from 'react';
import Link from 'next/link';
import classes from './NavigationItem.module.css';
import { useRouter } from 'next/router';
const navigationItem = (props) =>{
    const router = useRouter();
    let activeClass='';
    if (!router.query.page && props.block.params.url.value==='/' || props.block.params.url.value==='/'+router.query.page) {
        activeClass = classes.active;
      }
    return  (
    <li className={classes.NavigationItem}>
        <Link href={'/[[...page]]'} as={props.block.params.url.value}><a className={activeClass}>{props.block.params.text.value}</a></Link>
    </li>
)};


export default navigationItem;