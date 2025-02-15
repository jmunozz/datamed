# AUTO GENERATED FILE - DO NOT EDIT

accordion <- function(children=NULL, id=NULL, label=NULL, labelClass=NULL, isOpenOnFirstRender=NULL) {
    
    props <- list(children=children, id=id, label=label, labelClass=labelClass, isOpenOnFirstRender=isOpenOnFirstRender)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'Accordion',
        namespace = 'datamed_custom_components',
        propNames = c('children', 'id', 'label', 'labelClass', 'isOpenOnFirstRender'),
        package = 'datamedCustomComponents'
        )

    structure(component, class = c('dash_component', 'list'))
}
