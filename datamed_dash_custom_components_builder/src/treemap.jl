# AUTO GENERATED FILE - DO NOT EDIT

export treemap

"""
    treemap(;kwargs...)

A Treemap component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `data` (Bool | Real | String | Dict | Array; optional)
- `width` (Real; optional)
- `height` (Real; optional)
"""
function treemap(; kwargs...)
        available_props = Symbol[:id, :data, :width, :height]
        wild_props = Symbol[]
        return Component("treemap", "Treemap", "datamed_custom_components", available_props, wild_props; kwargs...)
end

