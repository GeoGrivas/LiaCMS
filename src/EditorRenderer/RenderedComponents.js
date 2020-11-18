import React from 'react';
import ComponentRender from './Component';
import LeanComponentRender from '../Renderer/LeanComponentRender';
const RenderedComponents=(props)=>{
    const renderedComponents = props.contentComponents.map(block => {
        return <ComponentRender key={block.id + 's'} block={block} methods={props.methods} />;
      });
    let layoutRenderedComponents=null;
    if(!props.layoutEditing && props.layoutComponents){
      layoutRenderedComponents = props.layoutComponents.map(block => {
        return <LeanComponentRender key={block.id + 's'} block={block} methods={props.methods} ignoreAppContainer={true} content={props.contentComponents.map(block => {
          return <ComponentRender key={block.id + 's'} block={block} methods={props.methods} />;
        })[0]} />;
      });
    }
      return (<React.Fragment>{props.layoutEditing ? renderedComponents : layoutRenderedComponents}</React.Fragment>);
};

export default React.memo(RenderedComponents);