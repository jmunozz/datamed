# AUTO GENERATED FILE - DO NOT EDIT

treemap <- function(id=NULL, data=NULL, width=NULL, height=NULL) {
    
    props <- list(id=id, data=data, width=width, height=height)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Treemap',
        namespace = 'datamed_custom_components',
        propNames = c('id', 'data', 'width', 'height'),
        package = 'datamedCustomComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
