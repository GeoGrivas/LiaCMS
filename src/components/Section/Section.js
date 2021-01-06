import React from 'react';
import Button from '../UI/Button/Button';
import classes from './Section.module.css';
const Section = (props) => {
    const onPrintClicked = (event) => {
        event.target.classList.add('print');
        window.print();
    }
    if (props.block.params?.printable.value == "yes") {
        return (
            <div>
                <div style={{
                    position: 'sticky',
                    top: 0, float: 'right'
                }}>
                    <Button class={"primary"} onClick={(e) => { onPrintClicked(e) }}>Print this</Button>
                </div>
                <section className={classes.Section +" "+props.block.params?.backgroundColor?.value}>
                    {props.children}
                </section>
            </div>);
    } else {

        return (
            <section className={classes.Section +" "+props.block.params?.backgroundColor?.value}>
                {props.children}
            </section>
        );
    }
}

export default Section;