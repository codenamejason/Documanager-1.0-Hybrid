'use strict';

(function() {
    var provider = app.data.documanager10 = new Everlive({
            offlineStorage: true,
            appId: 'w2rcjozjc61vb696',
            scheme: 'https',
            authentication: {
                persist: true
            }
        }),
        accessTokenCacheKey = 'documanager10_access_token',
        providerAuthentication = provider.authentication,
        providerLogin = provider.Users.login,
        authentication = {
            setCachedAccessToken: function setCachedAccessToken(token) {
                if (localStorage) {
                    localStorage.setItem(accessTokenCacheKey, JSON.stringify(token));
                } else {
                    app[accessTokenCacheKey] = token;
                }
            },
            getCachedAccessToken: function getCachedAccessToken() {
                if (localStorage) {
                    return JSON.parse(localStorage.getItem(accessTokenCacheKey));
                } else {
                    return app[accessTokenCacheKey];
                }
            },
            getCacheAccessTokenFn: function getCacheAccessTokenFn(callback) {
                return function cacheAccessToken(data) {
                    if (data && data.result) {
                        authentication.setCachedAccessToken(data.result);
                    }

                    callback(data);
                };
            },
            loadCachedAccessToken: function loadCachedAccessToken() {
                var token = authentication.getCachedAccessToken();

                if (token) {
                    providerAuthentication.setAuthorization(
                        token.access_token,
                        token.token_type,
                        token.principal_id);

                    provider.Users.currentUser(function _currentUserSuccess(data) {
                        if (data.result) {
                            app.user = data.result;
                        } else {
                            authentication.setCachedAccessToken(null);
                            providerAuthentication.clearAuthorization();
                        }
                    }, function _currentUserFailure(err) {
                        authentication.setCachedAccessToken(null);
                        providerAuthentication.clearAuthorization();
                    });
                }
            }
        };

    authentication.loadCachedAccessToken();
    provider.Users.login = function cacheAccessTokenLogin(
        email, password, success, error) {
        providerLogin.call(this, email, password,
            authentication.getCacheAccessTokenFn(success), error);
    };

    function _readyTimeout() {
        if (!provider.sbReady) {
            provider.sbReady = true;
            provider._emitter.emit('sbReady');
        }
    }

    provider.sbProviderReady = function sbProviderReady(callback) {
        if (provider.sbReady) {
            return callback();
        } else {
            provider.once('sbReady', callback);
        }
    }

    document.addEventListener('online', function _appOnline() {
        provider.offline(false);
        provider.sync();
        _readyTimeout();
    });

    document.addEventListener('offline', function _appOffline() {
        provider.offline(true);
        _readyTimeout();
    });

    window.setTimeout(_readyTimeout, 2000);

}());

// START_CUSTOM_CODE_documanager10
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_documanager10