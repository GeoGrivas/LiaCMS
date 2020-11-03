import React from "react";
import componentsList from "./componentsList";

export default function LeanComponentRender(props) {
    let component = null;
    //console.log(componentsList);
    if (props.block.component === "AppContainer") {
        component = componentsList['Auxilary'];
    }
    else
    {
        component = componentsList[props.block.component];
    }
    let children = null;
    if (props.block.children) {
        children = props.block.children.map(comp => {
            return <LeanComponentRender key={comp.id + 'l'} block={comp} />
        });
    }
    return (
        React.createElement(component, {
            block: props.block
        }, children)
    );
}

//export default LeanComponentRender;