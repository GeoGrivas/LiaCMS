import React from 'react';

 const Container=props=>(
     <div className={props.block.params.type?.value +" "+props.block.params?.backgroundColor.value}>
          {props.children.length>0?props.children:"drop something in the container"}
     </div>
 );

 export default Container;