# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class NavBar(Component):
    """A NavBar component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.

Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks.
- url (string; optional)
- opts (optional)
- value (dict; optional): value has the following type: dict containing keys 'value', 'type'.
Those keys have the following types:
  - value (string | number; optional)
  - type (string; optional)
- fireOnSelect (boolean; optional)"""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, url=Component.UNDEFINED, opts=Component.UNDEFINED, value=Component.UNDEFINED, fireOnSelect=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'url', 'opts', 'value', 'fireOnSelect']
        self._type = 'NavBar'
        self._namespace = 'datamed_custom_components'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'url', 'opts', 'value', 'fireOnSelect']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(NavBar, self).__init__(**args)
