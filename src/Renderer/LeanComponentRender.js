import React from "react";
import dynamic from 'next/dynamic';

const LeanComponentRender = props => {
    let component = null;
    if (props.block.component === "AppContainer") {
        component = dynamic(() => import('../hoc/Auxilary'));
    }
    else
        component = dynamic(() => import('../components' + props.block.importLocation));
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

export default LeanComponentRender;