import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


const CarouselComponent = (props) => {
    let carouselItemCounter=0;
    const carouselContent = props.children && props.children!==null && props.children.length>0?props.children.map(child => (<div key={'carouselItem'+carouselItemCounter++} >{child}</div>)):<div>drop something</div>;
    return (<Carousel>
        {carouselContent}
    </Carousel>)
}


export default CarouselComponent;