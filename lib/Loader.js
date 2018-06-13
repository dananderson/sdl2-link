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

class Loader {

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

    load(path = null) {
        if (!this.fastcall && !this.ffi) {
            throw new Error('FFI or Fastcall must be provided to the Loader.');
        }

        if (this.ffi && !this.ref) {
            throw new Error('FFI requires a ref library.');
        }

        const namespace = {};
        const nativeCallLib = getNativeCallLib.apply(this);

        addHelpers.apply(this, [namespace]);

        require('./util-sdl2-library').load(path || getLibPath('SDL2'), nativeCallLib, namespace);

        if (this.imageLibrary) {
            require('./util-sdl2-image-library').load(this.imageLibraryPath || getLibPath('SDL2_image'), nativeCallLib, namespace);
        }

        if (this.joystickLibrary) {
            if (!this.ffi || !this.ref) {
                throw new Error('Joystick and GameController functions require FFI.');
            }
            require('./util-sdl2-joystick-library').load(this.jotstickLibraryPath || getLibPath('SDL2'), getFFI.apply(this), namespace);
        }

        if (this.ttfLibrary) {
            require('./util-sdl2-ttf-library').load(this.ttfLibraryPath || getLibPath('SDL2_ttf'), nativeCallLib, namespace);
        }

        if (this.mixerLibrary) {
            require('./util-sdl2-mixer-library').load(this.mixerLibraryPath || getLibPath('SDL2_mixer'), nativeCallLib, namespace);
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
    } else {
        namespace.toCString = this.ref.allocCString;
        namespace.ref = this.ref;
    }

    namespace.fromCString = namespace.ref.readCString;

    let ref = namespace.ref;

    namespace.reinterpret = (buffer) => {
        if (buffer.isNull() || buffer.length === buffer.type.size) {
            return buffer;
        }

        let result = ref.reinterpret(buffer, buffer.type.size, 0);
        result.type = buffer.type;
        return result;
    };
}

function extendType(ref, type) {
    type.alloc = jsObject => ref.alloc(type, jsObject);

    return type;
}

function getFFI() {
    const StructType = require('ref-struct-di')(this.ref);
    const UnionType = require('ref-union-di')(this.ref);

    return {
        ffi: this.ffi,
        ref: this.ref,
        Array: require('ref-array-di')(this.ref),
        Struct: definition => extendType(this.ref, StructType(definition)),
        Union: definition => extendType(this.ref, UnionType(definition)),
        patchFunctions: (namespace, templates) => namespace
    };
}

function getNativeCallLib() {
    if (this.fastcall) {
        return {
            ffi: this.fastcall.ffi,
            ref: this.fastcall.ref,
            Array: this.fastcall.ffi.ArrayType,
            Struct: definition => extendType(this.fastcall.ref, this.fastcall.ffi.StructType(definition)),
            Union: definition => extendType(this.fastcall.ref, this.fastcall.ffi.UnionType(definition)),
            patchFunctions,
        };
    } else {
        return getFFI.apply(this);
    }
}

function patchFunctions(namespace, templates) {
    Object.keys(templates).forEach(name => {
        let template = templates[name];
        if (template.length > 0 && template[0].indirection === 2 && template[0].name === 'StructType') {
            let func = namespace[name];
            let reinterpret = namespace.reinterpret;
            namespace[name] = (...args) => reinterpret(func(args));
        }
    });

    return namespace;
}

module.exports = Loader;
