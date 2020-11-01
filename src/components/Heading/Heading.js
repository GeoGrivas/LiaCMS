import React from 'react';
const Heading = (props) => {
    switch (props.block.params.size.value) {
        case '1':
            return (
                <h1>
                    {props.block.params["text"].value}
                </h1>);
        case '2':
            return (
                <h2>
                    {props.block.params["text"].value}
                </h2>);
        case '3':
            return (
                <h3>
                    {props.block.params["text"].value}
                </h3>);
        case '4':
            return (
                <h4>
                    {props.block.params["text"].value}
                </h4>);
        case '5':
            return (
                <h5>
                    {props.block.params["text"].value}
                </h5>);
        case '6':
            return (
                <h6>
                    {props.block.params["text"].value}
                </h6>);
        default:
            return (
                <h1>
                    {props.block.params["text"].value}
                </h1>);
    }
}

export default Heading;