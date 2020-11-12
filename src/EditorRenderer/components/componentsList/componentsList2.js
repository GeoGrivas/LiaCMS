import React from 'react';
import DraggableItem from '../DraggableItem/DraggableItem';

const ComponentsList = (props) => {
    return (<React.Fragment>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "ResponsiveNavigation",
            importLocation: "/Navigation/ResponsiveNavigation",
            type: 'container',
            children: []
        }}>Responsive Navigation 1</DraggableItem>

        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "NavigationItem",
            importLocation: "/Navigation/NavigationItems/NavigationItem/NavigationItem",
            params: { url: { value: "/home" }, text: { value: "Home" } }
        }}>Navigation Link 1</DraggableItem>
        <hr />

        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Heading",
            params: { text: { value: 'alt-click to edit props title' }, size: { type: 'select', value: '1', options: [1, 2, 3, 4, 5, 6] } },
            importLocation: "/Heading/Heading"
        }}>Heading</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Paragraph",
            importLocation: "/Paragraph/Paragraph",
            params: { text: { value: "alt-click to edit props paragraph" } }
        }}>Paragraph</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "ButtonLink",
            importLocation: "/ButtonLink/ButtonLink",
            params: { url: { value: "/" }, text: { value: "button link" } },
        }}>Button Link</DraggableItem>

        <hr />
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Container",
            importLocation: "/Container/Container",
            children: [],
            type: "container"
        }}>Container</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Row",
            importLocation: "/Row/Row",
            children: [],
            params: {
                alignItems: { value: '', type: 'select', options: ['', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'stretch'] },
                justifyContent: { value: '', type: 'select', options: ['', 'center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'stretch'] }
            },
            type: "container"
        }}>Row</DraggableItem>

        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Column",
            importLocation: "/Column/Column",
            params: {
                breakPoint: { value: 'md', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
                span: { value: '', type: 'select', options: ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', ''] },
                textAlign: { value: '', type: 'select', options: ['', 'center', 'start', 'end', 'left', 'right'] }
            },
            children: [],
            type: "container"
        }}>Column</DraggableItem>

        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Header",
            importLocation: "/Header/Header",
            params: { title: { value: "title" }, subtitle: { value: "sub title" }, backgroundImage: { value: "default" } }
        }}>Header</DraggableItem>
        <hr />
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Card",
            importLocation: "/Card/Card",
            children: [],
            type: "container"
        }}>Card</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Image1",
            importLocation: "/Card/Image1/Image1",
            params: { src: { value: "https://dummyimage.com/300.png/09f/fff" }, alt: { value: 'an image!' }, height: { value: '300px' }, width: { value: '300px' } }
        }}>Image1</DraggableItem>
        <hr />
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "List",
            importLocation: "/List/List",
            params: {
                type: { value: 'unordered', options: ['unordered', 'ordered'], type: 'select' },
                style: { value: 'unset', options: ['unset', 'none', 'circle', 'disc', 'square', 'decimal', 'decimal-leading-zero', 'lower-alpha', 'lower-greek', 'lower-latin', 'lower-roman', 'upper-alpha', 'upper-greek', 'upper-latin', 'upper-roman'], type: 'select' }
            },
            children: [],
            type: 'container'
        }}>List</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "ListItem",
            importLocation: "/List/ListItem/ListItem",
            type: 'container',
            children: [],
        }}>List Item</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "InitAuthState",
            importLocation: "/Authentication/InitAuthState",
            children: [],
        }}>Authorization</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "CarouselComponent",
            importLocation: "/Carousel/Carousel",
            type: 'container',
            children: []
        }}>Carousel</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Datepicker",
            importLocation: "/Datepicker/Datepicker",
            params: {
                maxRange: { value: '0' },
                minRange: { value: '0' },
                disabledDatesUrl: { value: '' },
                minDate: { value: '' },
                maxDate: { value: '' },
                numberOfMonths: { value: 1 }
            }
        }}>Datepicker</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Datepicker2",
            importLocation: "/Datepicker/Datepicker2",
            params: {
                propertyId: { value: '463' }
            }
        }}>Datepicker2</DraggableItem>
        <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
            component: "Authentication",
            importLocation: "/Authentication/Authentication",
            type: 'container',
            children: []
        }}>Login</DraggableItem>
        {props.layoutEditing ?
            <DraggableItem onDragEnd={props.draggingEndedHandler} onDragStart={props.onDragHandler} data={{
                component: "Content",
                importLocation: "/Content/Content"
            }}>Content</DraggableItem> : null}
    </React.Fragment>)
}


export default ComponentsList;