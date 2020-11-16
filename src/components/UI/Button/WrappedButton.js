import React from 'react';
import Button from './Button';

const WrappedButton=(props)=>{
return <Button class={props.block.params.style?.value}>{ props.block.params.text?.value}</Button>
}


export default WrappedButton;