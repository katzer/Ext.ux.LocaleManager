/*
    The MIT License (MIT)

    Copyright (c) 2013 appPlant UG

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
    FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
    COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

Ext.define('Ext.ux.LocaleManager', {
    alternateClassName: 'Ext.ux.LocaleMgr',

    singleton: true,

    requires: [
        'Ext.Function',
        'Ext.Array',
        'Ext.String',
        'Ext.XTemplate'
    ],

    /**
     * @private {Hash}
     * Speichert alle Lokalisierungen ab.
     */
    _locales: {},

    config: {
        /**
         * @cfg {String} defaultLocale
         * Welche Lokalisierung verwendet werden soll.
         * @accessor
         */
        defaultLocale: null,

        /**
         * @cfg {String} fallbackLocale
         * Welche Lokalisierung verwendet werden soll, falls es für die Standardlokalisierung keinen Eintrag gibt.
         * @accessor
         */
        fallbackLocale: 'en'
    },

    /**
     * @private
     */
    constructor: function (config) {
        this.initConfig(config);
        this.callSuper(arguments);

        l = Ext.Function.alias(this, 'localize');
    },

    /**
     * Fügt die Lokalisierung einer Sprache hinzu.
     *
     * @param {String[]} languages Die Namen der Sprachen
     * @param {Hash}     locales   Die Lokalisierungen
     */
    addLocales: function (languages, newLocales) {
        Ext.Array.each(Ext.Array.from(languages), function (language) {
            if (!this._locales[language])
                this._locales[language] = {};

            var locales = this._locales[language];

            for (var key in newLocales) {
                //<debug>
                    if (locales[key])
                        Ext.Logger.warn('Eine Lokalisierung für ' + language + ':' + key + ' existiert bereits');
                //</debug>

                locales[key] = newLocales[key];
            }

            if (!this.getDefaultLocale()) {
                var language = navigator.cordovaLanguage || navigator.language || navigator.userLanguage;

                this.setDefaultLocale(language.split('-')[0]);
            }
        }, this)
    },

    /**
     * @private
     *
     * Die Lokalisierungen einer Sprache.
     *
     * @param {String} language Der Name der Sprache
     * @return {Hash}
     */
    getLocales: function (language) {
        return this._locales[language]
    },

    /**
     * Lokalisiert einen Begriff.
     *
     * @param {String} locale Der zu lokalisierende Begriff
     * @return {String}
     */
    localize: function (locale) {
        var defaultLocales  = this.getLocales(this.getDefaultLocale()),
            fallbackLocales = this.getLocales(this.getFallbackLocale());

        if (defaultLocales || fallbackLocales) {
            var args  = Ext.Array.from(arguments).slice(1),
                value = (defaultLocales || fallbackLocales)[locale];

            if (Ext.isArray(value))
                value = Ext.XTemplate.create(value);

            if (Ext.isObject(value) && !(value instanceof Ext.XTemplate)) {
                value = value[args.shift()] || value['default'];

                if (Ext.isArray(value)) {
                    value = Ext.XTemplate.create(value);
                }
            };

            if (value instanceof Ext.XTemplate) {
                return value.apply(args[0] || {});
            } else if (value && args.length > 0) {
                return Ext.String.format.apply(Ext.String, [value].concat(args));
            } else {
                return value;
            };
        };
    }
})