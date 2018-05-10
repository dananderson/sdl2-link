/*
 * Copyright 2018 Daniel Anderson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 * is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const SDL = 'SDL2';
const SDL_IMAGE = 'SDL2_image';
const SDL_TTF = 'SDL2_ttf';
const SDL_MIXER = 'SDL2_mixer';

const SDL_LIBRARIES = {};

SDL_LIBRARIES[SDL] = require('./lib/util-sdl2-library');
SDL_LIBRARIES[SDL_IMAGE] = require('./lib/util-sdl2-image-library');
SDL_LIBRARIES[SDL_TTF] = require('./lib/util-sdl2-ttf-library');
SDL_LIBRARIES[SDL_MIXER] = require('./lib/util-sdl2-mixer-library');

function extendType(ref, type) {
    type.alloc = jsObject => ref.alloc(type, jsObject);

    return type;
}

function getNativeFunctionCallHandler(options) {
    if (!options.ffi) {
        try {
            options.ffi = require('ffi-napi');
        } catch (e) {
            throw new Error('Missing ffi. ffi must be passed in through options or the ffi-napi module must be installed.');
        }
    }

    if (typeof options.fastcall === 'string' || options.fastcall instanceof String) {
        options.fastcall = null;
        if (!options.ref) {
            try {
                options.ref = require('ref-napi');
            } catch (e) {
                throw new Error('Missing ref. ref must be passed in through options or the ref-napi module must be installed.');
            }
        }
    } else {
        if (!options.fastcall) {
            try {
                options.fastcall = require('fastcall');
            } catch (e) {
                throw new Error('Missing fastcall. fastcall must be passed in through options or the fastcall module ' +
                    'must be installed. To exclude fastcall usage, use the option - fastcall: \'exclude\'');
            }
        }

        if (!options.ref) {
            options.ref = options.fastcall.ref;
        }
    }

    const ref = options.ref;
    const ffi = options.ffi;

    const StructType = ffi.StructType || require('ref-struct-di')(ref);
    const UnionType = ffi.UnionType || require('ref-union-di')(ref);

    return {
        ffi: ffi,
        ref: ref,
        fastcall: options.fastcall,
        Array: ffi.ArrayType || require('ref-array-di')(ref),
        Struct: definition => extendType(ref, StructType(definition)),
        Union: definition => extendType(ref, UnionType(definition)),
    };
}

function link(options) {
    options = options || {};
    
    const nativeFunctionCallHandler = getNativeFunctionCallHandler(options);

    let libs = [ SDL ];

    if (options.extensions) {
        if (Array.isArray(options.extensions)) {
            libs = libs.concat(options.extensions);
        } else {
            libs.push(options.extensions);
        }
    }

    libs.forEach((i) => {
        if (!(i in SDL_LIBRARIES)) {
            throw new Error(`Invalid SDL library name: ${i}. Available library names: '${Object.keys(SDL_LIBRARIES).join(', ')}'`);
        }
    });

    const lib = {};

    SDL_LIBRARIES[SDL].loadConstantsAndTypes(nativeFunctionCallHandler, lib);

    libs.forEach((i) => {
        if (i !== SDL) {
            SDL_LIBRARIES[i].loadConstantsAndTypes(nativeFunctionCallHandler, lib);
        }

        SDL_LIBRARIES[i].loadFunctions(nativeFunctionCallHandler, lib);
    });

    lib.ref = options.ref;
    lib.readCString = options.ref.readCString;

    if (options.fastcall) {
        lib.allocCString = options.fastcall.makeStringBuffer;
    } else {
        lib.allocCString = options.ref.allocCString;
    }

    return lib;
}

module.exports = link;
