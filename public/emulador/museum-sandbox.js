/**
 * ReCiclo Museum - Sandbox de Aislamiento para Versiones de Demostración
 * Archivo: public/emulador/museum-sandbox.js
 *
 * IMPORTANTE: debe cargarse ANTES que cualquier script de la versión (primer <script>
 * del <head> de cada index.html archivado, o inyectado por la página que sirve /run/).
 *
 * Qué aísla (todo vive solo en memoria y se pierde al cerrar la demo):
 *  1. localStorage / sessionStorage (incluido el acceso por propiedad: localStorage.x = 1).
 *  2. document.cookie.
 *  3. IndexedDB (Firebase Auth guarda ahí la sesión; compartiría la sesión real).
 *  4. Red hacia Firebase / Firestore / Google Identity y hacia /api/ del mismo origen:
 *     fetch, XMLHttpRequest, WebSocket, EventSource y sendBeacon.
 */
(function () {
    'use strict';

    var TAG = '[ReCiclo Sandbox]';

    // =========================================================================
    // 1. ALMACENAMIENTO EN MEMORIA (localStorage / sessionStorage)
    // =========================================================================
    function createMemoryStorage() {
        var data = Object.create(null);
        var methods = {
            getItem: function (k) {
                k = String(k);
                return k in data ? data[k] : null;
            },
            setItem: function (k, v) {
                data[String(k)] = String(v);
            },
            removeItem: function (k) {
                delete data[String(k)];
            },
            clear: function () {
                data = Object.create(null);
            },
            key: function (i) {
                var keys = Object.keys(data);
                return i >= 0 && i < keys.length ? keys[i] : null;
            }
        };

        // Proxy: también cubre localStorage.foo = 'x' y localStorage['foo'], que
        // saltarían cualquier parche hecho solo sobre Storage.prototype.
        return new Proxy({}, {
            get: function (_, prop) {
                if (prop === 'length') return Object.keys(data).length;
                if (typeof prop === 'symbol') return undefined;
                if (Object.prototype.hasOwnProperty.call(methods, prop)) return methods[prop];
                return prop in data ? data[prop] : undefined;
            },
            set: function (_, prop, value) {
                if (typeof prop === 'symbol') return true;
                data[String(prop)] = String(value);
                return true;
            },
            deleteProperty: function (_, prop) {
                delete data[prop];
                return true;
            },
            has: function (_, prop) {
                return prop in data || Object.prototype.hasOwnProperty.call(methods, prop);
            },
            ownKeys: function () {
                return Object.keys(data);
            },
            getOwnPropertyDescriptor: function (_, prop) {
                if (prop in data) {
                    return { value: data[prop], writable: true, enumerable: true, configurable: true };
                }
                return undefined;
            }
        });
    }

    function patchStoragePrototypeFallback() {
        // Último recurso si el navegador no deja redefinir window.localStorage.
        if (typeof window.Storage === 'undefined') return;
        var stores = new WeakMap();
        function storeFor(ctx) {
            if (!stores.has(ctx)) stores.set(ctx, new Map());
            return stores.get(ctx);
        }
        var proto = window.Storage.prototype;
        proto.getItem = function (k) {
            var s = storeFor(this);
            k = String(k);
            return s.has(k) ? s.get(k) : null;
        };
        proto.setItem = function (k, v) {
            storeFor(this).set(String(k), String(v));
        };
        proto.removeItem = function (k) {
            storeFor(this).delete(String(k));
        };
        proto.clear = function () {
            storeFor(this).clear();
        };
        proto.key = function (i) {
            var keys = Array.from(storeFor(this).keys());
            return i < keys.length ? keys[i] : null;
        };
        Object.defineProperty(proto, 'length', {
            configurable: true,
            get: function () {
                return storeFor(this).size;
            }
        });
    }

    ['localStorage', 'sessionStorage'].forEach(function (name) {
        try {
            var memory = createMemoryStorage();
            Object.defineProperty(window, name, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return memory;
                }
            });
        } catch (err) {
            console.warn(TAG, 'No se pudo reemplazar ' + name + '; usando parche de prototipo.', err);
            patchStoragePrototypeFallback();
        }
    });

    // =========================================================================
    // 2. COOKIES EN MEMORIA
    // =========================================================================
    try {
        var jar = Object.create(null);
        Object.defineProperty(document, 'cookie', {
            configurable: true,
            get: function () {
                return Object.keys(jar)
                    .map(function (k) {
                        return k + '=' + jar[k];
                    })
                    .join('; ');
            },
            set: function (raw) {
                var str = String(raw);
                var first = str.split(';')[0];
                var i = first.indexOf('=');
                if (i < 0) return;
                var key = first.slice(0, i).trim();
                var value = first.slice(i + 1);
                var maxAge = /max-age\s*=\s*(-?\d+)/i.exec(str);
                var expires = /expires\s*=\s*([^;]+)/i.exec(str);
                var expired =
                    (maxAge && parseInt(maxAge[1], 10) <= 0) ||
                    (expires && !isNaN(Date.parse(expires[1])) && Date.parse(expires[1]) <= Date.now());
                if (expired) delete jar[key];
                else jar[key] = value;
            }
        });
    } catch (err) {
        console.warn(TAG, 'No se pudo aislar document.cookie:', err);
    }

    // =========================================================================
    // 3. INDEXEDDB DESACTIVADO
    //    Firebase Auth cae a almacenamiento en memoria cuando IndexedDB falla.
    // =========================================================================
    try {
        var failingRequest = function () {
            var req = new EventTarget();
            req.readyState = 'pending';
            req.result = undefined;
            req.error = null;
            setTimeout(function () {
                req.readyState = 'done';
                req.error = new DOMException('IndexedDB deshabilitado en modo demostración', 'InvalidStateError');
                var ev = new Event('error', { cancelable: true });
                if (typeof req.onerror === 'function') req.onerror(ev);
                req.dispatchEvent(ev);
            }, 0);
            return req;
        };
        var fakeIDB = {
            open: failingRequest,
            deleteDatabase: failingRequest,
            databases: function () {
                return Promise.resolve([]);
            },
            cmp: function (a, b) {
                return a < b ? -1 : a > b ? 1 : 0;
            }
        };
        Object.defineProperty(window, 'indexedDB', {
            configurable: true,
            get: function () {
                return fakeIDB;
            }
        });
    } catch (err) {
        console.warn(TAG, 'No se pudo aislar indexedDB:', err);
    }

    // =========================================================================
    // 4. NEUTRALIZACIÓN DE RED HACIA LA BASE DE DATOS
    // =========================================================================
    var DB_PATTERNS = [
        'firestore.googleapis.com',
        'identitytoolkit.googleapis.com',
        'securetoken.googleapis.com',
        'firebaseinstallations.googleapis.com',
        'firebase.googleapis.com',
        'firebaseio.com',
        'firebasestorage.app',
        'firebasestorage.googleapis.com',
        'firebaseapp.com',
        'reciclo-aae7b'
    ];

    function toUrlString(input) {
        if (!input) return '';
        if (typeof input === 'string') return input;
        if (typeof input.href === 'string') return input.href; // URL
        if (typeof input.url === 'string') return input.url; // Request
        return String(input);
    }

    function isBlockedUrl(input) {
        var raw = toUrlString(input);
        if (!raw) return false;

        var abs = raw;
        var sameOriginApi = false;
        try {
            var parsed = new URL(raw, window.location.href);
            abs = parsed.href;
            // Cualquier endpoint /api/ del propio dominio podría tocar el backend real.
            sameOriginApi = parsed.origin === window.location.origin && /^\/api(\/|$)/i.test(parsed.pathname);
        } catch (e) {}

        if (sameOriginApi) return true;

        var lower = abs.toLowerCase();
        for (var i = 0; i < DB_PATTERNS.length; i++) {
            if (lower.indexOf(DB_PATTERNS[i]) !== -1) return true;
        }
        return false;
    }

    var MOCK_BODY = {
        ok: true,
        status: 'demo_neutralized',
        documents: [],
        users: [],
        data: {},
        message: 'Operación en modo demostración. No se alteró la base de datos real.'
    };

    // ---- fetch ---------------------------------------------------------------
    var originalFetch = window.fetch;
    if (typeof originalFetch === 'function') {
        window.fetch = function (input, init) {
            if (isBlockedUrl(input)) {
                console.info(TAG, 'fetch a base de datos neutralizado:', toUrlString(input));
                return Promise.resolve(
                    new Response(JSON.stringify(MOCK_BODY), {
                        status: 200,
                        statusText: 'OK (Demo Mock)',
                        headers: { 'Content-Type': 'application/json' }
                    })
                );
            }
            return originalFetch.apply(this, arguments);
        };
    }

    // ---- XMLHttpRequest (se parchea el prototipo para conservar instanceof) --
    if (window.XMLHttpRequest && window.XMLHttpRequest.prototype) {
        var xp = window.XMLHttpRequest.prototype;
        var origOpen = xp.open;
        var origSend = xp.send;

        var fireXhr = function (xhr, type) {
            var ev = new Event(type);
            var handler = xhr['on' + type];
            if (typeof handler === 'function') {
                try {
                    handler.call(xhr, ev);
                } catch (e) {
                    console.error(e);
                }
            }
            try {
                xhr.dispatchEvent(ev);
            } catch (e) {}
        };

        xp.open = function (method, url) {
            this.__museumBlocked = isBlockedUrl(url);
            this.__museumUrl = toUrlString(url);
            return origOpen.apply(this, arguments);
        };

        xp.send = function () {
            if (!this.__museumBlocked) return origSend.apply(this, arguments);

            var xhr = this;
            console.info(TAG, 'XHR a base de datos neutralizado:', xhr.__museumUrl);
            setTimeout(function () {
                var body = JSON.stringify(MOCK_BODY);
                var define = function (prop, value) {
                    try {
                        Object.defineProperty(xhr, prop, { value: value, configurable: true, writable: true });
                    } catch (e) {}
                };
                define('readyState', 4);
                define('status', 200);
                define('statusText', 'OK (Demo Mock)');
                define('responseURL', xhr.__museumUrl);
                define('responseText', body);
                define('response', xhr.responseType === 'json' ? MOCK_BODY : body);
                fireXhr(xhr, 'readystatechange');
                fireXhr(xhr, 'load');
                fireXhr(xhr, 'loadend');
            }, 10);
        };
    }

    // ---- WebSocket / EventSource (Proxy para conservar constantes estáticas) -
    function makeDeadSocket(url) {
        var fake = new EventTarget();
        fake.url = String(url);
        fake.readyState = 3; // CLOSED
        fake.send = function () {};
        fake.close = function () {};
        setTimeout(function () {
            var err = new Event('error');
            var close = new Event('close');
            if (typeof fake.onerror === 'function') fake.onerror(err);
            fake.dispatchEvent(err);
            if (typeof fake.onclose === 'function') fake.onclose(close);
            fake.dispatchEvent(close);
        }, 0);
        return fake;
    }

    ['WebSocket', 'EventSource'].forEach(function (name) {
        var Original = window[name];
        if (typeof Original !== 'function') return;
        window[name] = new Proxy(Original, {
            construct: function (target, args) {
                if (isBlockedUrl(args[0])) {
                    console.info(TAG, name + ' a base de datos bloqueado:', toUrlString(args[0]));
                    return makeDeadSocket(args[0]);
                }
                return Reflect.construct(target, args);
            }
        });
    });

    // ---- sendBeacon ----------------------------------------------------------
    if (navigator && typeof navigator.sendBeacon === 'function') {
        var origBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function (url) {
            if (isBlockedUrl(url)) {
                console.info(TAG, 'sendBeacon neutralizado:', toUrlString(url));
                return true;
            }
            return origBeacon.apply(navigator, arguments);
        };
    }

    console.info(TAG, 'Entorno de demostración activo: almacenamiento en memoria y base de datos protegida.');
})();