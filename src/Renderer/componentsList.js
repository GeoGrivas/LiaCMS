import dynamic from 'next/dynamic';
const componentsList={
    Paragraph:dynamic(()=>import ('../components/Paragraph/Paragraph')),
    Auxilary:dynamic(()=>import('../hoc/Auxilary')),
    AppContainer:dynamic(()=>import('../components/AppContainer/AppContainer')),
    Authentication:dynamic(()=>import('../components/Authentication/Authentication')),
    InitAuthState:dynamic(()=>import('../components/Authentication/InitAuthState')),
    ButtonLink:dynamic(()=>import('../components/ButtonLink/ButtonLink')),
    Card:dynamic(()=>import('../components/Card/Card')),
    Container:dynamic(()=>import('../components/Container/Container')),
    Header:dynamic(()=>import('../components/Header/Header')),
    Heading:dynamic(()=>import('../components/Heading/Heading')),
    List:dynamic(()=>import('../components/List/List')),
    ListItem:dynamic(()=>import('../components/List/ListItem/ListItem')),
    ResponsiveNavigation:dynamic(()=>import('../components/Navigation/ResponsiveNavigation')),
    NavigationItem:dynamic(()=>import('../components/Navigation/NavigationItems/NavigationItem/NavigationItem')),
    Row:dynamic(()=>import('../components/Row/Row')),
    Column:dynamic(()=>import('../components/Column/Column')),
    Image1:dynamic(()=>import('../components/Card/Image1/Image1'))
};


export default componentsList;