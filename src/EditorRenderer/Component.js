import React, { Component } from "react";
import ParamsEditor from './components/ParamsEditor/ParamsEditor';
import Aux from '../hoc/Auxilary';
import dynamic from 'next/dynamic';
class ComponentRender extends Component {

  dragFollow = true;
  mouseDown = false;
  onMouseDown = (event) => {
    this.mouseDown = true;
    const coords = { x: event.pageX, y: event.pageY };
    setTimeout(() => {
      if (this.mouseDown) {
        if (this.dragFollow === true) {
          let drag = document.getElementById(this.props.block.id + 'drag');
          if (drag) {
            drag.style.top = coords.y - 5 + 'px';
            drag.style.left = coords.x - 5 + 'px';
            drag.style.display = 'block';
          }
        }
      }
    }, 250);
  }
  onClick = (event, id) => {
    event.stopPropagation();
    
    if (event.altKey) {
      event.preventDefault();
    }
    let elements = document.getElementsByClassName('selected_component');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('selected_component');
    }
    elements = document.querySelectorAll('.show_editor');
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('show_editor');
    }
    if (event.altKey) {
      event.target.classList.add('selected_component');
      if (document.getElementById('paramsEditor' + id))
        document.getElementById('paramsEditor' + id).classList.add('show_editor');
      if(this.props.block.type==='container')
      {
        for(let i =0;i<this.props.block.children.length;i++)
        {
          document.getElementById('paramsEditor' + this.props.block.children[i].id).classList.add('show_editor');
          //document.getElementById('paramsEditor' + this.props.block.children[i].id).style.display='inline-block';
        }
      }
    }
  }
  onMouseUp = (event) => {
    this.mouseDown = false;
    let drag = document.getElementById(this.props.block.id + 'drag');
    if (drag) {
      drag.style.display = 'none';
      drag.style.top = 0;
      drag.style.left = 0;
    }
  }

  onDragStart = () => {
    this.dragFollow = false;
  }
  onDragEnd = () => {
    this.dragFollow = true;
  }
  render() {
    let component=null;
    if(this.props.ignoreAppContainer && this.props.block.component==="AppContainer")
    {
      component = dynamic(() => import('../hoc/Auxilary'));
    }else if(this.props.block.component==="Content" && this.props.content){
      return this.props.content;
      //this.props.block.children=this.props.content;
    }else{
      component = dynamic(() => import('../components' + this.props.block.importLocation));
    }
    let children = null;
   // const level = this.props.block.level ? this.props.block.level : 0;
    if(this.props.children)
    {
      children=this.props.children;
    }else if (this.props.block.type && this.props.block.type === "container" && this.props.block.children !== null && this.props.block.children !== undefined) {
      children = this.props.block.children.map(comp => {
        //comp.level = level + 1;
        return <ComponentRender key={comp.id + 'l'} block={comp} methods={this.props.methods}/>
      });
    }
    return (


        <section //style={{ zIndex: this.props.block.level ? this.props.block.level : 0 }}
          onMouseUp={event => { this.onMouseUp(event); }}
          onMouseDown={event => { this.onMouseDown(event); }}
          onClick={event => { this.onClick(event, this.props.block.id) }}
          onDragOver={(event) => { event.preventDefault(); }}
          className='editorContainer'
          id={this.props.block.id}
          onDrop={event => { this.props.methods.onDragOver(event, this.props.block); this.props.methods.onDraggingEnded(event); }}
        >

          {this.props.block.ignoreHover ? null :
            <Aux>
              <div id={this.props.block.id + 'drag'} draggable={true}
                style={{ height: '15px', width: '15px',  position: "absolute", display: 'none' }}
                onDragStart={(event) => { event.stopPropagation(); this.props.methods.onDragStart(event, this.props.block) }}
                onDragEnd={event => { this.props.methods.onDraggingEnded(event) }}>
              </div>

              <ParamsEditor component={this.props.block} onEdit={this.props.methods.onEdit} onDragEnded={this.props.methods.onDraggingEnded} onRemove={this.props.methods.onRemove} onDragStart={this.props.methods.onDragStart} />
            </Aux>

          }
          {React.createElement(component, {
            block: this.props.block
          }, children)}

        </section>
    );
  }
}

export default ComponentRender;