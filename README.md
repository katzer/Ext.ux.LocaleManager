Ext.ux.LocaleManager
====================

Simple localization support for [Extjs](http://www.sencha.com/products/extjs/) and [SenchaTouch](http://www.sencha.com/products/touch/) components.

## Adding the Plugin to your project
The plugin has to be required within `app.js` and the locals has to be added before any localized view component can be loaded.
```javascript
// app.js

Ext.application({
    requires: [
        'Ext.ux.LocaleManager'
    ]
})
```

## Using the plugin
You can either use the `Ext.ux.LocalMgr.localize(key)` or the global `l(key)` to localize a given key.
```javascript
Ext.define('MyLocalizedApp.view.Example', {
    items: [{
        label: l('firstname')
    },{
        label: l('color', 'red')
    },{
        label: l('my-name-is', 'Sebastián', 'Katzer')
    },{
        label: l('msg-was-forwarded-to-sap', msg.getData())
    }]
});
```

## Adding locales
```javascript
Ext.ux.LocaleMgr.addLocales(['en', 'en-US', 'en-GB'], {
    // Single key-value pair
    firstname: 'Firstname',
    
    // Key with multiple values
    color: { black: 'Black', red: 'Red', default: 'Gold' }
    
    // Value as a string with placeholders
    'my-name-is': 'My name is {0} {1}.',
    
    // Value as an Ext.XTemplate
    'msg-was-forwarded-to-sap': ['The message {id} has been forwarded to SAP.']
})
```

## License

This source code is released under the [MIT License](http://opensource.org/licenses/MIT).
