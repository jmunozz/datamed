# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class Treemap(Component):
    """A Treemap component.
ExampleComponent is an example component.
It takes a property, `label`, and
displays it.
It renders an input with the property `value`
which is editable by the user.

Keyword arguments:
- id (string; optional): The ID used to identify this component in Dash callbacks.
- data (boolean | number | string | dict | list; optional)
- width (number; optional)
- height (number; optional)"""
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, data=Component.UNDEFINED, width=Component.UNDEFINED, height=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'data', 'width', 'height']
        self._type = 'Treemap'
        self._namespace = 'datamed_custom_components'
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'data', 'width', 'height']
        self.available_wildcard_properties =            []

        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs
        args = {k: _locals[k] for k in _explicit_args if k != 'children'}

        for k in []:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')
        super(Treemap, self).__init__(**args)
