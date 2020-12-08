import React, { Component } from 'react';
import Aux from '../../../hoc/Auxilary';
import EditorInput from './EditorInput/EditorInput';
import classes from './ParamsEditor.module.css';
class ParamsEditor extends Component {

  state = {
    optionsOpen: false
  };

  toggleOptions = (event) => {
    event?event.stopPropagation():null;
    this.setState({ optionsOpen: !this.state.optionsOpen });
  }



  render() {
    let inputs = null;
    if (this.props.component.params) {
      const keys = Object.keys(this.props.component.params);
      inputs = keys.map(key => (<Aux key={this.props.component.id + key}>
        
        <EditorInput name={key} input={this.props.component.params[key]} />
        <br /></Aux>));
    }
    return (

      <div id={"paramsEditor"+this.props.component.id} className="ParamsEditor">
        <div className="Options">
          {inputs !== null ? <button className={classes.Edit+' '+classes.Button} onClick={this.toggleOptions} style={{ zIndex: this.props.component.level + 2 }}>Edit</button> : null}
          <div className={classes.Button} draggable={true}
                onDragStart={(event) => { event.stopPropagation(); this.props.onDragStart(event, this.props.component) }}
                onDragEnd={event => { this.props.onDragEnded(event) }}>
                  &#x2723;
              </div>
          <button className={classes.Remove+' '+classes.Button} onClick={(event) => {this.props.onRemove(this.props.component) }} style={{ zIndex: this.props.component.level + 2 }}>&times;</button>
        </div>
        <div className='ParamsEditorBody' onClick={(event)=>{event.stopPropagation()}}>
          {inputs !== null ?
            <div style={{ display: this.state.optionsOpen ? "block" : "none"}}>
              <button className={classes.Button+' '+classes.Close} onClick={(event) => { event.preventDefault(); event.stopPropagation(); this.toggleOptions(); }} style={{ zIndex: this.props.component.level + 2 }}>&times;</button>
          <span>{'Editing:'+this.props.component.component}</span>
              <form onSubmit={(event) => { this.props.onEdit(event, this.props.component) }}>
                <h4 style={{textAlign:'center'}}>Parameters:</h4>
                {inputs}
                <hr/>
                <button className={classes.Button+' '+classes.Save} type="submit">Save</button>
              </form>
            </div>
            : null}
        </div>
      </div>
    );
  }
}



export default ParamsEditor;