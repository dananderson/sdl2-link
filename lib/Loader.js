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

'use strict';

class Loader {
    constructor() {
        Object.defineProperty(this, 'FILTER_INCLUDE', {
            value: 'include',
            writable: false
        });

        Object.defineProperty(this, 'FILTER_EXCLUDE', {
            value: 'exclude',
            writable: false
        });
    }

    withFastcall(fastcall) {
        this.fastcall = fastcall;
        return this;
    }

    withFFI(ffi, ref) {
        this.ffi = ffi;
        this.ref = ref;
        return this;
    }

    withImage(path = null) {
        this.imageLibrary = true;
        this.imageLibraryPath = path;
        return this;
    }

    withJoystick(path = null) {
        this.joystickLibrary = true;
        this.jotstickLibraryPath = path;
        return this;
    }

    withMixer(path = null) {
        this.mixerLibrary = true;
        this.mixerLibraryPath = path;
        return this;
    }

    withTTF(path = null) {
        this.ttfLibrary = true;
        this.ttfLibraryPath = path;
        return this;
    }

    withFilter(filter, symbols) {
        this.filter = filter
        this.symbols = symbols
    }

    load(path = null) {
        if (!this.fastcall && !this.ffi) {
            throw new Error('FFI or Fastcall must be provided to the Loader.');
        }

        if (this.ffi && !this.ref && !this.fastcall) {
            throw new Error('FFI requires a ref library.');
        }

        this.ref = this.ref || this.fastcall.ref;

        const namespace = {};
        const nativeCallLib = getNativeCallLib.apply(this);

        addHelpers.apply(this, [namespace]);

        const functionFilter = functions => {
            if (!this.filter) {
                return functions
            }

            const filtered = {}

            if (this.FILTER_INCLUDE) {
                this.symbols.forEach(f => {
                    if (f in functions) {
                        filtered[f] = functions[f]
                    }
                })
            } else if (this.FILTER_EXCLUDE) {
              const symbols = this.symbols

              Object.keys(functions).forEach(f => {
                  if (symbols.indexOf(f) < 0) {
                      filtered[f] = functions[f]
                  }
              })
            } else {
                throw Error('Unknown filter: ' + this.filter)
            }

            return filtered
        }

        require('./util-sdl2-library').load(path || getLibPath('SDL2'), functionFilter, nativeCallLib, namespace);

        if (this.imageLibrary) {
            require('./util-sdl2-image-library').load(this.imageLibraryPath || getLibPath('SDL2_image'), functionFilter, nativeCallLib, namespace);
        }

        if (this.joystickLibrary) {
            if (!this.ffi || !this.ref) {
                throw new Error('Joystick and GameController functions require FFI.');
            }
            require('./util-sdl2-joystick-library').load(this.jotstickLibraryPath || getLibPath('SDL2'), functionFilter, getFFI.apply(this), namespace);
        }

        if (this.ttfLibrary) {
            require('./util-sdl2-ttf-library').load(this.ttfLibraryPath || getLibPath('SDL2_ttf'), functionFilter, nativeCallLib, namespace);
        }

        if (this.mixerLibrary) {
            require('./util-sdl2-mixer-library').load(this.mixerLibraryPath || getLibPath('SDL2_mixer'), functionFilter, nativeCallLib, namespace);
        }

        return namespace;
    }

}

function getLibPath(basename) {
    if (process.platform === 'win32') {
        return `${basename}.dll`;
    } else if (process.platform === 'darwin') {
        return `lib${basename}.dylib`;
    }

    return `lib${basename}.so`;
}

function addHelpers(namespace) {
    if (this.fastcall) {
        namespace.toCString = this.fastcall.makeStringBuffer;
        namespace.ref = this.fastcall.ref;

        let ref = namespace.ref;

        namespace.toObject = (buffer) => {
            if (!(buffer instanceof Buffer)) {
                throw new Error('toObject expects a Buffer object.')
            }

            if (buffer.isNull()) {
                return {};
            }

            if (buffer.type.name !== 'StructType' && buffer.type.name !== 'UnionType') {
                throw new Error(`toObject converts Struct and Union Buffer to Object. Got a ${buffer.type.name} Buffer.`)
            }

            if (buffer.type.indirection !== 1) {
                throw new Error(`Cannot cast buffer with indirection of ${buffer.type.indirection}.`);
            }

            if (buffer.length === 0) {
                const repairedBuffer = ref.reinterpret(buffer, buffer.type.size, 0);

                repairedBuffer.type = buffer.type;

                buffer = repairedBuffer;
            }

            return new buffer.type(buffer);
        };

    } else {
        namespace.toCString = this.ref.allocCString;
        namespace.ref = this.ref;
        namespace.toObject = ptr => ptr.deref();
    }

    namespace.fromCString = namespace.ref.readCString;
}

function addTypeHelpers(ref, type) {
    type.toBuffer = jsObject => ref.alloc(type, jsObject);

    return type;
}

function getFFI() {
    const StructType = require('ref-struct-di')(this.ref);
    const UnionType = require('ref-union-di')(this.ref);

    return {
        ffi: this.ffi,
        ref: this.ref,
        Array: require('ref-array-di')(this.ref),
        Struct: definition => addTypeHelpers(this.ref, StructType(definition)),
        Union: definition => addTypeHelpers(this.ref, UnionType(definition)),
    };
}

function getNativeCallLib() {
    if (this.fastcall) {
        return {
            ffi: this.fastcall.ffi,
            ref: this.fastcall.ref,
            Array: this.fastcall.ffi.ArrayType,
            Struct: definition => addTypeHelpers(this.fastcall.ref, this.fastcall.ffi.StructType(definition)),
            Union: definition => addTypeHelpers(this.fastcall.ref, this.fastcall.ffi.UnionType(definition)),
        };
    } else {
        return getFFI.apply(this);
    }
}

module.exports = Loader;
