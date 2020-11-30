import dynamic from 'next/dynamic';
const componentsList={
    Paragraph:dynamic(()=>import ('../components/Paragraph/Paragraph'),{ssr:true}),
    Auxilary:dynamic(()=>import('../hoc/Auxilary'),{ssr:true}),
    AppContainer:dynamic(()=>import('../components/AppContainer/AppContainer'),{ssr:true}),
    Authentication:dynamic(()=>import('../components/Authentication/Authentication'),{ssr:true}),
    InitAuthState:dynamic(()=>import('../components/Authentication/InitAuthState'),{ssr:true}),
    ButtonLink:dynamic(()=>import('../components/ButtonLink/ButtonLink'),{ssr:true}),
    Card:dynamic(()=>import('../components/Card/Card'),{ssr:true}),
    Container:dynamic(()=>import('../components/Container/Container'),{ssr:true}),
    Header:dynamic(()=>import('../components/Header/Header'),{ssr:true}),
    Heading:dynamic(()=>import('../components/Heading/Heading'),{ssr:true}),
    List:dynamic(()=>import('../components/List/List'),{ssr:true}),
    ListItem:dynamic(()=>import('../components/List/ListItem/ListItem'),{ssr:true}),
    ResponsiveNavigation:dynamic(()=>import('../components/Navigation/ResponsiveNavigation'),{ssr:true}),
    NavigationItem:dynamic(()=>import('../components/Navigation/NavigationItems/NavigationItem/NavigationItem'),{ssr:true}),
    Row:dynamic(()=>import('../components/Row/Row'),{ssr:true}),
    Column:dynamic(()=>import('../components/Column/Column'),{ssr:true}),
    Image1:dynamic(()=>import('../components/Card/Image1/Image1'),{ssr:true}),
    Content:dynamic(()=>import('../components/Content/Content')),
    Datepicker:dynamic(()=>import('../components/Datepicker/Datepicker')),
    Datepicker2:dynamic(()=>import('../components/Datepicker/Datepicker2'),{ssr:false}),
    CarouselComponent:dynamic(()=>import('../components/Carousel/Carousel')),
    WrappedButton:dynamic(()=>import('../components/UI/Button/WrappedButton')),
    Link:dynamic(()=>import('../components/Link/Link')),
    Section:dynamic(()=>import('../components/Section/Section')),
    SimpleText:dynamic(()=>import('../components/SimpleText/SimpleText'))
};


export default componentsList;