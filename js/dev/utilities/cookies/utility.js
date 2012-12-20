/**
@appular {utility} cookies - get, set, and expire cookies
@define Cookies
*/
define([
    'jquery',
    'underscore'
], function($, _) {
    
    var Cookies = {
        
        /**
        @doc {function} set - set a cookie
            @param {string} key - name of cookie
            @param {string} value - value of cookie
            @param {object} [options] - number of days for expiration
                @property {string} options.[path]='/'
                @property {domain} options.[domain]=window.location.hostname.split('.').slice(-2).join('.')
                @property {string} options.[expires]=''
        */
        set: function (key, value, options) {
            options = $.extend({
                path: '/',
                domain: window.location.hostname.split('.').slice(-2).join('.'),
                expires: ''
            }, options);
            
            if (_.isNumber(options.expires)) {
                // If a number is passed in, make it work like 'max-age' only for days
                options.expires = new Date(new Date().getTime() + options.expires * 24 * 60 * 60 * 1000);
            } else if (_.isString(options.expires)) {
                // Allow multiple string formats for dates
                options.expires = new Date(options.expires);
            }
                    
            document.cookie = encodeURIComponent(key) + '=' + (String(value)).replace(/[^!#-+\--:<-\[\]-~]/g, encodeURIComponent) + ';path=' + options.path + ';domain=' + options.domain + ';expires=' + options.expires.toGMTString();
        },

        /**
        @doc {function} get - get a cookie
            @param {string} name - name of cookie
            @return {string||null} cookie - returns cookie if it exists, null if it doesn't
        */
        get: function(name) {
            var nameEQ = encodeURIComponent(name) + '=',
                cookiesArray = document.cookie.split(';');

            for(var i=0; i < cookiesArray.length; i++) {
                var cookie = cookiesArray[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
                }
            }

            return null;
        },

        /**
        @doc {function} expire - expires a cookie
            @param {string} name - name of cookie
        */
        expire: function(name) {
            this.set(name, '', {
                expires: -1
            });
        },

        /**
        @doc {function} isEnabled - check if cookies are enabled
            @return {boolean} isEnabled - true if cookies are enabled
        */
        isEnabled: function () {
            this.set('cookiesIsEnabledTest', '1');
            var isEnabled = (this.get('cookiesIsEnabledTest') === '1') ? true : false;
            this.expire('cookiesIsEnabledTest');
            return isEnabled;
        }
    };

    return Cookies;
});