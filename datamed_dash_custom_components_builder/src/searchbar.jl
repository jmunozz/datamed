# AUTO GENERATED FILE - DO NOT EDIT

export searchbar

"""
    searchbar(;kwargs...)

A SearchBar component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.
Keyword arguments:
- `id` (String; optional): The ID used to identify this component in Dash callbacks.
- `opts` (optional)
- `value` (optional): . value has the following type: lists containing elements 'value', 'type'.
Those elements have the following types:
  - `value` (String | Real; optional)
  - `type` (String; optional)
- `fireOnSelect` (Bool; optional)
"""
function searchbar(; kwargs...)
        available_props = Symbol[:id, :opts, :value, :fireOnSelect]
        wild_props = Symbol[]
        return Component("searchbar", "SearchBar", "datamed_custom_components", available_props, wild_props; kwargs...)
end

