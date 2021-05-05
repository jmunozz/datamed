# AUTO GENERATED FILE - DO NOT EDIT

searchBar <- function(id=NULL, opts=NULL, value=NULL) {
    
    props <- list(id=id, opts=opts, value=value)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'SearchBar',
        namespace = 'datamed_custom_components',
        propNames = c('id', 'opts', 'value'),
        package = 'datamedCustomComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
