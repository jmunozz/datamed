# AUTO GENERATED FILE - DO NOT EDIT

export accordion

"""
    accordion(;kwargs...)
    accordion(children::Any;kwargs...)
    accordion(children_maker::Function;kwargs...)


An Accordion component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `children` (a list of or a singular dash component, string or number; optional)
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `label` (String; optional)
- `isOpenOnFirstRender` (Bool; optional)
"""
function accordion(; kwargs...)
        available_props = Symbol[:children, :id, :label, :isOpenOnFirstRender]
        wild_props = Symbol[]
        return Component("accordion", "Accordion", "datamed_custom_components", available_props, wild_props; kwargs...)
end

accordion(children::Any; kwargs...) = accordion(;kwargs..., children = children)
accordion(children_maker::Function; kwargs...) = accordion(children_maker(); kwargs...)

