import React from 'react';
import Button from '../UI/Button/Button';
import classes from './Section.module.css';
const Section = (props) => {
    const id=props.block.id;
    const onPrintClicked = (sctid) => {
        const sectionId=sctid;
        var prtContent = document.getElementById(sectionId);
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
    }
    if (props.block.params?.printable.value == "yes") {
        return (
            <div>
                <div style={{
                    position: 'sticky',
                    top: 0, float: 'right'
                }}>
                    <Button class={"primary"} onClick={() => { onPrintClicked(id) }}>Print this</Button>
                </div>
                <section id={id} className={classes.Section}>
                    {props.children}
                </section>
            </div>);
    } else {

        return (
            <section className={classes.Section}>
                {props.children}
            </section>
        );
    }
}

export default Section;