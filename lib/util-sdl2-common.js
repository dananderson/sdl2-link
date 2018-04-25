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

exports.createLibWithCommonTypes = (ffi, ref, complexTypes) => {
    let t = complexTypes;
    let lib = {};

    lib.SDL_version = t.Struct({
        major: 'uint8',
        minor: 'uint8',
        patch: 'uint8',
    });

    lib.SDL_Point = t.Struct({ x: 'int', y: 'int' });

    let SDL_Rect = lib.SDL_Rect = t.Struct({ x: 'int', y: 'int', w: 'int', h: 'int' });

    lib.SDL_RWOps = t.Struct({
        size: ffi.Function('int64', [ 'void*' ]),
        seek: ffi.Function('int64', [ 'void*', 'int64' ]),
        read: ffi.Function('size_t', [ 'void*', 'void*', 'size_t', 'size_t' ]),
        write: ffi.Function('size_t', [ 'void*', 'void*', 'size_t', 'size_t' ]),
        close: ffi.Function('int', [ 'void*' ]),
        type: 'uint32',
        hidden: t.Union({
            a: t.Struct({ x: 'uint8*', y: 'uint8*', z: 'uint8*' }),
            b: t.Struct({ x: 'void*', y: 'void*' }),
        }),
    });

    let SDL_Color = lib.SDL_Color = t.Struct({ r: 'uint8', g: 'uint8', b: 'uint8', a: 'uint8' });
    let SDL_ColorPtr = ref.refType(SDL_Color);

    let SDL_Palette = lib.SDL_Palette = t.Struct({ ncolors: 'int', colors: SDL_ColorPtr, version: 'uint32', refcount: 'int' });
    let SDL_PalettePtr = ref.refType(SDL_Palette);

    lib.SDL_PixelFormat = t.Struct({
        format: 'uint32',
        palette: SDL_PalettePtr,
        BitsPerPixel: 'uint8',
        BytesPerPixel: 'uint8',
        padding: t.Array('uint8', 56),
        Rmask: 'uint32',
        Gmask: 'uint32',
        Bmask: 'uint32',
        Amask: 'uint32',
        Rloss: 'uint8',
        Gloss: 'uint8',
        Bloss: 'uint8',
        Aloss: 'uint8',
        Rshift: 'uint8',
        Gshift: 'uint8',
        Bshift: 'uint8',
        Ashift: 'uint8',
        refcount: 'int',
        next: 'void*'
    });
    let SDL_PixelFormatPtr = ref.refType(lib.SDL_PixelFormat);

    lib.SDL_SWSURFACE = 0;
    lib.SDL_PREALLOC = 0x00000001;
    lib.SDL_RLEACCEL = 0x00000002;
    lib.SDL_DONTFREE = 0x00000004;

    lib.SDL_Surface = t.Struct({
        flags: 'uint32',
        format: SDL_PixelFormatPtr,
        w: 'int',
        h: 'int',
        pitch: 'int',
        pixels: 'void*',
        userdata: 'void*',
        locked: 'int',
        lock_data: 'void*',
        clip_rect: SDL_Rect,
        map: 'void*',
        refcount: 'int',
    });

    return lib;
};
