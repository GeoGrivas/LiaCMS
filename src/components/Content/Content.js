import React from 'react';

export default function Content(props){
return <div style={{height:!props.children?'50vh':''}}>{props.children?props.children:(<div style={{textAlign:'center'}}><h2>CONTENT</h2></div>)}</div>
}