import React from 'react';
const Heading = (props) => {
    switch (props.block.params.size.value) {
        case '1':
            return (
                <h1 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h1>);
        case '2':
            return (
                <h2 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h2>);
        case '3':
            return (
                <h3 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h3>);
        case '4':
            return (
                <h4 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h4>);
        case '5':
            return (
                <h5 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h5>);
        case '6':
            return (
                <h6 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h6>);
        default:
            return (
                <h1 className={props.block.params.style?.value}>
                    {props.block.params["text"].value}
                </h1>);
    }
}

export default Heading;