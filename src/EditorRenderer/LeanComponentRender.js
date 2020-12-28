import React from "react";
import componentsList from "./componentsList";

export default function LeanComponentRender(props) {
    let component = null;
    const content=props.content;
    if (props.block.component === "AppContainer") {
        component = componentsList['Auxilary'];
    }
    else if (props.block.component === "Content") {
        component = componentsList['Content'];
        return (React.createElement(component, {
            block: props.block
        }, content));
    }
    else {
        component = componentsList[props.block.component];
    }
    let children = null;
    if (props.block.children) {
        children = props.block.children.map(comp => {
            return <LeanComponentRender key={comp.id + 'l'} block={comp} content={content} />
        });
    }
    
    return (
        React.createElement(component, {
            block: props.block
        }, children)
    );
}
