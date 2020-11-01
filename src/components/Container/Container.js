import React from 'react';

 const Container=props=>(
     <div className="container">
          {props.children.length>0?props.children:"drop something in the container"}
     </div>
 );

 export default Container;