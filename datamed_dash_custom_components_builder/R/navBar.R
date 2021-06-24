# AUTO GENERATED FILE - DO NOT EDIT

navBar <- function(id=NULL, url=NULL, opts=NULL, value=NULL, fireOnSelect=NULL) {
    
    props <- list(id=id, url=url, opts=opts, value=value, fireOnSelect=fireOnSelect)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'NavBar',
        namespace = 'datamed_custom_components',
        propNames = c('id', 'url', 'opts', 'value', 'fireOnSelect'),
        package = 'datamedCustomComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
