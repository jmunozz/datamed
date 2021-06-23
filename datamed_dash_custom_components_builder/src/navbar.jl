# AUTO GENERATED FILE - DO NOT EDIT

export navbar

"""
    navbar(;kwargs...)

A NavBar component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `url` (String; optional)
- `opts` (optional)
- `value` (optional): . value has the following type: lists containing elements 'value', 'type'.
Those elements have the following types:
  - `value` (String | Real; optional)
  - `type` (String; optional)
- `fireOnSelect` (Bool; optional)
"""
function navbar(; kwargs...)
        available_props = Symbol[:id, :url, :opts, :value, :fireOnSelect]
        wild_props = Symbol[]
        return Component("navbar", "NavBar", "datamed_custom_components", available_props, wild_props; kwargs...)
end

