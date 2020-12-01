import React from 'react';
import Button from '../UI/Button/Button';
import classes from './Section.module.css';
const Section = (props) => {
    let id = undefined;
    const idGenerator = (componentName) => {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (componentName + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    if (props.block.params?.printable.value == "yes") {
        id = idGenerator('sct');
    }
    const onPrintClicked = (id) => {
        var prtContent = document.getElementById(id);
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        WinPrint.document.write(prtContent.innerHTML);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
    }
    if (id) {
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