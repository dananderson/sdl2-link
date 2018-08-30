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

const keys = require('./util-sdl2-keys');

function loadConstantsAndTypes(nativeCallLib, ns) {
    const ffi = nativeCallLib.ffi;
    const ref = nativeCallLib.ref;
    const types = nativeCallLib;
    const isLittleEndian = ref.endianness === 'LE';

    ns.SDL_version = types.Struct({
        major: 'uint8',
        minor: 'uint8',
        patch: 'uint8',
    });

    ns.SDL_INIT_TIMER = 0x00000001;
    ns.SDL_INIT_AUDIO = 0x00000010;
    ns.SDL_INIT_VIDEO = 0x00000020;
    ns.SDL_INIT_JOYSTICK = 0x00000200;
    ns.SDL_INIT_HAPTIC = 0x00001000;
    ns.SDL_INIT_GAMECONTROLLER = 0x00002000;
    ns.SDL_INIT_EVENTS = 0x00004000;
    ns.SDL_INIT_NOPARACHUTE = 0x00100000;
    ns.SDL_INIT_EVERYTHING = (ns.SDL_INIT_TIMER | ns.SDL_INIT_AUDIO | ns.SDL_INIT_VIDEO |
        ns.SDL_INIT_EVENTS | ns.SDL_INIT_JOYSTICK | ns.SDL_INIT_HAPTIC | ns.SDL_INIT_GAMECONTROLLER);

    ns.SDL_FALSE = 0;
    ns.SDL_TRUE = 1;
    
    ns.SDL_Point = types.Struct({ x: 'int', y: 'int' });

    const SDL_PointPtr = ref.refType(ns.SDL_Point);

    const SDL_Rect = ns.SDL_Rect = types.Struct({ x: 'int', y: 'int', w: 'int', h: 'int' });

    ns.SDL_LIL_ENDIAN = 1234;
    ns.SDL_BIG_ENDIAN = 4321;
    ns.SDL_BYTEORDER = isLittleEndian ? ns.SDL_LIL_ENDIAN : ns.SDL_BIG_ENDIAN;

    ns.SDL_Keymod = {
        KMOD_NONE: 0x0000,
        KMOD_LSHIFT: 0x0001,
        KMOD_RSHIFT: 0x0002,
        KMOD_LCTRL: 0x0040,
        KMOD_RCTRL: 0x0080,
        KMOD_LALT: 0x0100,
        KMOD_RALT: 0x0200,
        KMOD_LGUI: 0x0400,
        KMOD_RGUI: 0x0800,
        KMOD_NUM: 0x1000,
        KMOD_CAPS: 0x2000,
        KMOD_MODE: 0x4000,
        KMOD_RESERVED: 0x8000,
    };

    ns.KMOD_CTRL = (ns.KMOD_LCTRL | ns.KMOD_RCTRL);
    ns.KMOD_SHIFT = (ns.KMOD_LSHIFT | ns.KMOD_RSHIFT);
    ns.KMOD_ALT = (ns.KMOD_LALT | ns.KMOD_RALT);
    ns.KMOD_GUI = (ns.KMOD_LGUI | ns.KMOD_RGUI);

    keys.loadConstants(ns);

    ns.SDL_RWOPS_UNKNOWN = 0;
    ns.SDL_RWOPS_WINFILE = 1;
    ns.SDL_RWOPS_STDFILE = 2;
    ns.SDL_RWOPS_JNIFILE = 3;
    ns.SDL_RWOPS_MEMORY = 4;
    ns.SDL_RWOPS_MEMORY_RO = 5;

    ns.RW_SEEK_SET = 0;
    ns.RW_SEEK_CUR = 1;
    ns.RW_SEEK_END = 2;

    ns.RW_WriteFunc = ffi.Function('size_t', [ 'void*', 'void*', 'size_t', 'size_t' ]);
    ns.RW_CloseFunc = ffi.Function('int', [ 'void*' ]);
    ns.RW_ReadFunc = ffi.Function('size_t', [ 'void*', 'void*', 'size_t', 'size_t' ]);
    ns.RW_SeekFunc = ffi.Function('int64', [ 'void*', 'int64' ]);
    ns.RW_SizeFunc = ffi.Function('int64', [ 'void*' ]);

    ns.SDL_RWops = types.Struct({
        size: ns.RW_SizeFunc,
        seek: ns.RW_SeekFunc,
        read: ns.RW_ReadFunc,
        write: ns.RW_WriteFunc,
        close: ns.RW_CloseFunc,
        type: 'uint32',
        hidden: types.Union({
            androidio: types.Struct({ fileNameRef: 'void*', inputStreamRef: 'void*', readableByteChannelRef: 'void*', readMethod: 'void*', assetFileDescriptorRef: 'void*', position: 'long', size: 'long', offset: 'long' }),
            windowsio: types.Struct({ append: 'int', h: 'void*', buffer: types.Struct({ data: 'void*', size: 'size_t', left: 'size_t' }) }),
            stdio: types.Struct({ autoclose: 'int', fp: 'void*' }),
            mem: types.Struct({ base: 'uint8*', here: 'uint8*', stop: 'uint8*' }),
            unknown: types.Struct({ data1: 'void*', data2: 'void*' }),
        }),
    });

    const SDL_Color = ns.SDL_Color = types.Struct({ r: 'uint8', g: 'uint8', b: 'uint8', a: 'uint8' });
    const SDL_ColorPtr = ref.refType(SDL_Color);

    const SDL_Palette = ns.SDL_Palette = types.Struct({ ncolors: 'int', colors: SDL_ColorPtr, version: 'uint32', refcount: 'int' });
    const SDL_PalettePtr = ref.refType(SDL_Palette);

    ns.SDL_PixelFormat = types.Struct({
        format: 'uint32',
        palette: SDL_PalettePtr,
        BitsPerPixel: 'uint8',
        BytesPerPixel: 'uint8',
        padding: types.Array('uint8', 2),
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
    const SDL_PixelFormatPtr = ref.refType(ns.SDL_PixelFormat);

    ns.SDL_ALPHA_OPAQUE = 255;
    ns.SDL_ALPHA_TRANSPARENT = 0;
    
    ns.SDL_PIXELTYPE_UNKNOWN = 0;
    ns.SDL_PIXELTYPE_INDEX1 = 1;
    ns.SDL_PIXELTYPE_INDEX4 = 2;
    ns.SDL_PIXELTYPE_INDEX8 = 3;
    ns.SDL_PIXELTYPE_PACKED8 = 4;
    ns.SDL_PIXELTYPE_PACKED16 = 5;
    ns.SDL_PIXELTYPE_PACKED32 = 6;
    ns.SDL_PIXELTYPE_ARRAYU8 = 7;
    ns.SDL_PIXELTYPE_ARRAYU16 = 8;
    ns.SDL_PIXELTYPE_ARRAYU32 = 9;
    ns.SDL_PIXELTYPE_ARRAYF16 = 10;
    ns.SDL_PIXELTYPE_ARRAYF32 = 11;

    ns.SDL_BITMAPORDER_NONE = 0;
    ns.SDL_BITMAPORDER_4321 = 1;
    ns.SDL_BITMAPORDER_1234 = 2;

    ns.SDL_PACKEDORDER_NONE = 0;
    ns.SDL_PACKEDORDER_XRGB = 1;
    ns.SDL_PACKEDORDER_RGBX = 2;
    ns.SDL_PACKEDORDER_ARGB = 3;
    ns.SDL_PACKEDORDER_RGBA = 4;
    ns.SDL_PACKEDORDER_XBGR = 5;
    ns.SDL_PACKEDORDER_BGRX = 6;
    ns.SDL_PACKEDORDER_ABGR = 7;
    ns.SDL_PACKEDORDER_BGRA = 8;

    ns.SDL_ARRAYORDER_NONE = 0;
    ns.SDL_ARRAYORDER_RGB = 1;
    ns.SDL_ARRAYORDER_RGBA = 2;
    ns.SDL_ARRAYORDER_ARGB = 3;
    ns.SDL_ARRAYORDER_BGR = 4;
    ns.SDL_ARRAYORDER_BGRA = 5;
    ns.SDL_ARRAYORDER_ABGR = 6;

    ns.SDL_PACKEDLAYOUT_NONE = 0;
    ns.SDL_PACKEDLAYOUT_332 = 1;
    ns.SDL_PACKEDLAYOUT_4444 = 2;
    ns.SDL_PACKEDLAYOUT_1555 = 3;
    ns.SDL_PACKEDLAYOUT_5551 = 4;
    ns.SDL_PACKEDLAYOUT_565 = 5;
    ns.SDL_PACKEDLAYOUT_8888 = 6;
    ns.SDL_PACKEDLAYOUT_2101010 = 7;
    ns.SDL_PACKEDLAYOUT_1010102 = 8;

    ns.SDL_SWSURFACE = 0;
    ns.SDL_PREALLOC = 0x00000001;
    ns.SDL_RLEACCEL = 0x00000002;
    ns.SDL_DONTFREE = 0x00000004;

    ns.SDL_FOURCC = (a, b, c, d) => ((a << 0) & 0xFF) | ((b << 8) & 0xFF) | ((c << 16) & 0xFF) | ((d << 24) & 0xFF);
    ns.SDL_DEFINE_PIXELFOURCC = ns.SDL_FOURCC;
    ns.SDL_DEFINE_PIXELFORMAT = (type, order, layout, bits, bytes) =>
        ((1 << 28) | ((type) << 24) | ((order) << 20) | ((layout) << 16) | ((bits) << 8) | ((bytes) << 0));

    ns.SDL_PIXELFORMAT_UNKNOWN = 0;
    ns.SDL_PIXELFORMAT_INDEX1LSB = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_INDEX1, ns.SDL_BITMAPORDER_4321, 0, 1, 0),
    ns.SDL_PIXELFORMAT_INDEX1MSB = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_INDEX1, ns.SDL_BITMAPORDER_1234, 0, 1, 0);
    ns.SDL_PIXELFORMAT_INDEX4LSB = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_INDEX4, ns.SDL_BITMAPORDER_4321, 0, 4, 0);
    ns.SDL_PIXELFORMAT_INDEX4MSB = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_INDEX4, ns.SDL_BITMAPORDER_1234, 0, 4, 0);
    ns.SDL_PIXELFORMAT_INDEX8 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_INDEX8, 0, 0, 8, 1);
    ns.SDL_PIXELFORMAT_RGB332 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED8, ns.SDL_PACKEDORDER_XRGB, ns.SDL_PACKEDLAYOUT_332, 8, 1);
    ns.SDL_PIXELFORMAT_RGB444 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_XRGB, ns.SDL_PACKEDLAYOUT_4444, 12, 2);
    ns.SDL_PIXELFORMAT_RGB555 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_XRGB, ns.SDL_PACKEDLAYOUT_1555, 15, 2);
    ns.SDL_PIXELFORMAT_BGR555 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_XBGR, ns.SDL_PACKEDLAYOUT_1555, 15, 2);
    ns.SDL_PIXELFORMAT_ARGB4444 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_ARGB, ns.SDL_PACKEDLAYOUT_4444, 16, 2);
    ns.SDL_PIXELFORMAT_RGBA4444 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_RGBA, ns.SDL_PACKEDLAYOUT_4444, 16, 2);
    ns.SDL_PIXELFORMAT_ABGR4444 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_ABGR, ns.SDL_PACKEDLAYOUT_4444, 16, 2);
    ns.SDL_PIXELFORMAT_BGRA4444 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_BGRA, ns.SDL_PACKEDLAYOUT_4444, 16, 2);
    ns.SDL_PIXELFORMAT_ARGB1555 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_ARGB, ns.SDL_PACKEDLAYOUT_1555, 16, 2);
    ns.SDL_PIXELFORMAT_RGBA5551 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_RGBA, ns.SDL_PACKEDLAYOUT_5551, 16, 2);
    ns.SDL_PIXELFORMAT_ABGR1555 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_ABGR, ns.SDL_PACKEDLAYOUT_1555, 16, 2);
    ns.SDL_PIXELFORMAT_BGRA5551 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_BGRA, ns.SDL_PACKEDLAYOUT_5551, 16, 2);
    ns.SDL_PIXELFORMAT_RGB565 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_XRGB, ns.SDL_PACKEDLAYOUT_565, 16, 2);
    ns.SDL_PIXELFORMAT_BGR565 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED16, ns.SDL_PACKEDORDER_XBGR, ns.SDL_PACKEDLAYOUT_565, 16, 2);
    ns.SDL_PIXELFORMAT_RGB24 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_ARRAYU8, ns.SDL_ARRAYORDER_RGB, 0, 24, 3);
    ns.SDL_PIXELFORMAT_BGR24 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_ARRAYU8, ns.SDL_ARRAYORDER_BGR, 0, 24, 3);
    ns.SDL_PIXELFORMAT_RGB888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_XRGB, ns.SDL_PACKEDLAYOUT_8888, 24, 4);
    ns.SDL_PIXELFORMAT_RGBX8888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_RGBX, ns.SDL_PACKEDLAYOUT_8888, 24, 4);
    ns.SDL_PIXELFORMAT_BGR888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_XBGR, ns.SDL_PACKEDLAYOUT_8888, 24, 4);
    ns.SDL_PIXELFORMAT_BGRX8888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_BGRX, ns.SDL_PACKEDLAYOUT_8888, 24, 4);
    ns.SDL_PIXELFORMAT_ARGB8888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_ARGB, ns.SDL_PACKEDLAYOUT_8888, 32, 4);
    ns.SDL_PIXELFORMAT_RGBA8888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_RGBA, ns.SDL_PACKEDLAYOUT_8888, 32, 4);
    ns.SDL_PIXELFORMAT_ABGR8888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_ABGR, ns.SDL_PACKEDLAYOUT_8888, 32, 4);
    ns.SDL_PIXELFORMAT_BGRA8888 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_BGRA, ns.SDL_PACKEDLAYOUT_8888, 32, 4);
    ns.SDL_PIXELFORMAT_ARGB2101010 = ns.SDL_DEFINE_PIXELFORMAT(ns.SDL_PIXELTYPE_PACKED32, ns.SDL_PACKEDORDER_ARGB, ns.SDL_PACKEDLAYOUT_2101010, 32, 4);
        
    ns.SDL_PIXELFORMAT_YV12 = ns.SDL_DEFINE_PIXELFOURCC(0x59, 0x56, 0x31, 0x32);
    ns.SDL_PIXELFORMAT_IYUV = ns.SDL_DEFINE_PIXELFOURCC(0x49, 0x59, 0x55, 0x56);
    ns.SDL_PIXELFORMAT_YUY2 = ns.SDL_DEFINE_PIXELFOURCC(0x59, 0x55, 0x59, 0x32);
    ns.SDL_PIXELFORMAT_UYVY = ns.SDL_DEFINE_PIXELFOURCC(0x55, 0x59, 0x56, 0x59);
    ns.SDL_PIXELFORMAT_YVYU = ns.SDL_DEFINE_PIXELFOURCC(0x59, 0x56, 0x59, 0x55);
    ns.SDL_PIXELFORMAT_NV12 = ns.SDL_DEFINE_PIXELFOURCC(0x4E, 0x56, 0x31, 0x32);
    ns.SDL_PIXELFORMAT_NV21 = ns.SDL_DEFINE_PIXELFOURCC(0x4E, 0x56, 0x32, 0x31);
    ns.SDL_PIXELFORMAT_EXTERNAL_OES = ns.SDL_DEFINE_PIXELFOURCC(0x4F, 0x45, 0x53, 0x20);
    
    if (isLittleEndian) {
        ns.SDL_PIXELFORMAT_RGBA32 = ns.SDL_PIXELFORMAT_ABGR8888;
        ns.SDL_PIXELFORMAT_ARGB32 = ns.SDL_PIXELFORMAT_BGRA8888;
        ns.SDL_PIXELFORMAT_BGRA32 = ns.SDL_PIXELFORMAT_ARGB8888;
        ns.SDL_PIXELFORMAT_ABGR32 = ns.SDL_PIXELFORMAT_RGBA8888;
    } else {
        ns.SDL_PIXELFORMAT_RGBA32 = ns.SDL_PIXELFORMAT_RGBA8888;
        ns.SDL_PIXELFORMAT_ARGB32 = ns.SDL_PIXELFORMAT_ARGB8888;
        ns.SDL_PIXELFORMAT_BGRA32 = ns.SDL_PIXELFORMAT_BGRA8888;
        ns.SDL_PIXELFORMAT_ABGR32 = ns.SDL_PIXELFORMAT_ABGR8888;
    }

    ns.SDL_PIXELFLAG = x => ((x >> 28) & 0x0F);
    ns.SDL_PIXELTYPE = x => ((x >> 24) & 0x0F);
    ns.SDL_PIXELORDER = x => ((x >> 20) & 0x0F);
    ns.SDL_PIXELLAYOUT = x => ((x >> 16) & 0x0F);
    ns.SDL_BITSPERPIXEL = x => ((x >> 8) & 0xFF);
    ns.SDL_BYTESPERPIXEL = x => (ns.SDL_ISPIXELFORMAT_FOURCC(x) ?
        (((x === ns.SDL_PIXELFORMAT_YUY2) || (x === ns.SDL_PIXELFORMAT_UYVY) || (x === ns.SDL_PIXELFORMAT_YVYU)) ? 2 : 1)
        : ((x >> 0) & 0xFF));

    ns.SDL_ISPIXELFORMAT_INDEXED = format =>
        (!ns.SDL_ISPIXELFORMAT_FOURCC(format) &&
         ((ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_INDEX1) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_INDEX4) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_INDEX8)));

    ns.SDL_ISPIXELFORMAT_PACKED = format =>
        (!ns.SDL_ISPIXELFORMAT_FOURCC(format) &&
         ((ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_PACKED8) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_PACKED16) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_PACKED32)));

    ns.SDL_ISPIXELFORMAT_ARRAY = format =>
        (!ns.SDL_ISPIXELFORMAT_FOURCC(format) &&
         ((ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_ARRAYU8) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_ARRAYU16) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_ARRAYU32) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_ARRAYF16) ||
          (ns.SDL_PIXELTYPE(format) === ns.SDL_PIXELTYPE_ARRAYF32)));

    ns.SDL_ISPIXELFORMAT_ALPHA = format =>
        ((ns.SDL_ISPIXELFORMAT_PACKED(format) &&
         ((ns.SDL_PIXELORDER(format) === ns.SDL_PACKEDORDER_ARGB) ||
          (ns.SDL_PIXELORDER(format) === ns.SDL_PACKEDORDER_RGBA) ||
          (ns.SDL_PIXELORDER(format) === ns.SDL_PACKEDORDER_ABGR) ||
          (ns.SDL_PIXELORDER(format) === ns.SDL_PACKEDORDER_BGRA))) ||
        (ns.SDL_ISPIXELFORMAT_ARRAY(format) &&
         ((ns.SDL_PIXELORDER(format) === ns.SDL_ARRAYORDER_ARGB) ||
          (ns.SDL_PIXELORDER(format) === ns.SDL_ARRAYORDER_RGBA) ||
          (ns.SDL_PIXELORDER(format) === ns.SDL_ARRAYORDER_ABGR) ||
          (ns.SDL_PIXELORDER(format) === ns.SDL_ARRAYORDER_BGRA))));

    ns.SDL_ISPIXELFORMAT_FOURCC = format => ((format) && (ns.SDL_PIXELFLAG(format) !== 1));
    
    ns.SDL_Surface = types.Struct({
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

    ns.SDL_RELEASED = 0;
    ns.SDL_PRESSED = 1;

    ns.SDL_QUERY = -1;
    ns.SDL_IGNORE = 0;
    ns.SDL_DISABLE = 0;
    ns.SDL_ENABLE = 1;
    
    ns.SDL_EventType = {
        SDL_FIRSTEVENT: 0,
        SDL_QUIT: 256,
        SDL_APP_TERMINATING: 257,
        SDL_APP_LOWMEMORY: 258,
        SDL_APP_WILLENTERBACKGROUND: 259,
        SDL_APP_DIDENTERBACKGROUND: 260,
        SDL_APP_WILLENTERFOREGROUND: 261,
        SDL_APP_DIDENTERFOREGROUND: 262,
        SDL_WINDOWEVENT: 512,
        SDL_SYSWMEVENT: 513,
        SDL_KEYDOWN: 768,
        SDL_KEYUP: 769,
        SDL_TEXTEDITING: 770,
        SDL_TEXTINPUT: 771,
        SDL_KEYMAPCHANGED: 772,
        SDL_MOUSEMOTION: 1024,
        SDL_MOUSEBUTTONDOWN: 1025,
        SDL_MOUSEBUTTONUP: 1026,
        SDL_MOUSEWHEEL: 1027,
        SDL_JOYAXISMOTION: 1536,
        SDL_JOYBALLMOTION: 1537,
        SDL_JOYHATMOTION: 1538,
        SDL_JOYBUTTONDOWN: 1539,
        SDL_JOYBUTTONUP: 1540,
        SDL_JOYDEVICEADDED: 1541,
        SDL_JOYDEVICEREMOVED: 1542,
        SDL_CONTROLLERAXISMOTION: 1616,
        SDL_CONTROLLERBUTTONDOWN: 1617,
        SDL_CONTROLLERBUTTONUP: 1618,
        SDL_CONTROLLERDEVICEADDED: 1619,
        SDL_CONTROLLERDEVICEREMOVED: 1620,
        SDL_CONTROLLERDEVICEREMAPPED: 1621,
        SDL_FINGERDOWN: 1792,
        SDL_FINGERUP: 1793,
        SDL_FINGERMOTION: 1794,
        SDL_DOLLARGESTURE: 2048,
        SDL_DOLLARRECORD: 2049,
        SDL_MULTIGESTURE: 2050,
        SDL_CLIPBOARDUPDATE: 2304,
        SDL_DROPFILE: 4096,
        SDL_AUDIODEVICEADDED: 4352,
        SDL_AUDIODEVICEREMOVED: 4353,
        SDL_RENDER_TARGETS_RESET: 8192,
        SDL_RENDER_DEVICE_RESET: 8193,
        SDL_USEREVENT: 32768,
        SDL_LASTEVENT: 65535,
    };

    const SDL_KeySym = ns.SDL_KeySym = types.Struct({ scancode: 'uint32', sym: 'int', mod: 'uint16', unused: 'uint32' });

    const SDL_DropEvent = ns.SDL_DropEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', file: 'char**' });
    const SDL_QuitEvent = ns.SDL_QuitEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32' });
    const SDL_CommonEvent = ns.SDL_CommonEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32' });
    const SDL_ControllerDeviceEvent = ns.SDL_ControllerDeviceEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int' });
    const SDL_JoyDeviceEvent = ns.SDL_JoyDeviceEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int' });
    const SDL_TextInputEvent = ns.SDL_TextInputEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', text: types.Array('uint8', 32) });
    const SDL_TextEditingEvent = ns.SDL_TextEditingEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', text: types.Array('uint8', 32), start: 'int', length: 'int' });
    const SDL_SysWMEvent = ns.SDL_SysWMEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', msg: 'void*' });
    const SDL_WindowEvent = ns.SDL_WindowEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', event: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', d1: 'int', d2: 'int' });
    const SDL_KeyboardEvent = ns.SDL_KeyboardEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', state: 'uint8', repeat: 'uint8', p2: 'uint8', p3: 'uint8', keysym: SDL_KeySym });
    const SDL_UserEvent = ns.SDL_UserEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', code: 'int', d1: 'void*', d2: 'void*' });
    const SDL_MouseMotionEvent = ns.SDL_MouseMotionEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', which: 'uint32', state: 'uint32', x: 'int', y: 'int', xrel: 'int', yrel: 'int' });
    const SDL_MouseButtonEvent = ns.SDL_MouseButtonEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', which: 'uint32', state: 'uint8', clicks: 'uint8', p1: 'uint8', x: 'int', y: 'int' });
    const SDL_MouseWheelEvent = ns.SDL_MouseWheelEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', which: 'uint32', x: 'int', y: 'int', direction: 'uint32' });
    const SDL_DollarGestureEvent = ns.SDL_DollarGestureEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', touchId: 'int64', gestureId: 'int64', numFingers: 'uint32', error: 'float', x: 'float', y: 'float' });
    const SDL_MultiGestureEvent = ns.SDL_MultiGestureEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', touchId: 'int64', dTheta: 'float', dDist: 'float', x: 'float', y: 'float', numFingers: 'uint16', padding: 'uint16' });
    const SDL_TouchFingerEvent = ns.SDL_TouchFingerEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', touchId: 'int64', fingerId: 'int64', x: 'float', y: 'float', dx: 'float', dy: 'float', pressure: 'float' });
    const SDL_AudioDeviceEvent = ns.SDL_AudioDeviceEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'uint32', iscapture: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8' });
    const SDL_ControllerButtonEvent = ns.SDL_ControllerButtonEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', button: 'uint8', state: 'uint8', p1: 'uint8', p2: 'uint8' });
    const SDL_ControllerAxisEvent = ns.SDL_ControllerAxisEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', button: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', value: 'int16', p4: 'uint16' });
    const SDL_JoyButtonEvent = ns.SDL_JoyButtonEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', button: 'uint8', state: 'uint8', p1: 'uint8', p2: 'uint8' });
    const SDL_JoyHatEvent = ns.SDL_JoyHatEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', hat: 'uint8', value: 'uint8', p1: 'uint8', p2: 'uint8' });
    const SDL_JoyBallEvent = ns.SDL_JoyBallEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', ball: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', xrel: 'int16', yrel: 'int16' });
    const SDL_JoyAxisEvent = ns.SDL_JoyAxisEvent =
        types.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', axis: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', value: 'int16', p4: 'uint16' });

    const SDL_Event = ns.SDL_Event = types.Union({
        type: 'uint32',
        common: SDL_CommonEvent,
        window: SDL_WindowEvent,
        key: SDL_KeyboardEvent,
        edit: SDL_TextEditingEvent,
        text: SDL_TextInputEvent,
        motion: SDL_MouseMotionEvent,
        button: SDL_MouseButtonEvent,
        wheel: SDL_MouseWheelEvent,
        jaxis: SDL_JoyAxisEvent,
        jball: SDL_JoyBallEvent,
        jhat: SDL_JoyHatEvent,
        jbutton: SDL_JoyButtonEvent,
        jdevice: SDL_JoyDeviceEvent,
        caxis: SDL_ControllerAxisEvent,
        cbutton: SDL_ControllerButtonEvent,
        cdevice: SDL_ControllerDeviceEvent,
        adevice: SDL_AudioDeviceEvent,
        quit: SDL_QuitEvent,
        user: SDL_UserEvent,
        syswm: SDL_SysWMEvent,
        tfinger: SDL_TouchFingerEvent,
        mgesture: SDL_MultiGestureEvent,
        dgesture: SDL_DollarGestureEvent,
        drop: SDL_DropEvent,
        padding: types.Array('uint8', 56),
    });

    const SDL_EventPtr = ref.refType(SDL_Event);

    ns.SDL_EventFilter = ffi.Function('int', [ 'void*', SDL_EventPtr ]);

    ns.SDL_eventaction = {
        SDL_ADDEVENT: 0,
        SDL_PEEKEVENT: 1,
        SDL_GETEVENT: 2,
    };

    ns.SDL_WINDOWPOS_UNDEFINED = 0x1FFF0000;
    ns.SDL_WINDOWPOS_CENTERED = 0x2FFF0000;

    ns.SDL_WindowFlags = {
        SDL_WINDOW_FULLSCREEN: 1,
        SDL_WINDOW_OPENGL: 2,
        SDL_WINDOW_SHOWN: 4,
        SDL_WINDOW_HIDDEN: 8,
        SDL_WINDOW_BORDERLESS: 16,
        SDL_WINDOW_RESIZABLE: 32,
        SDL_WINDOW_MINIMIZED: 64,
        SDL_WINDOW_MAXIMIZED: 128,
        SDL_WINDOW_INPUT_GRABBED: 256,
        SDL_WINDOW_INPUT_FOCUS: 512,
        SDL_WINDOW_MOUSE_FOCUS: 1024,
        SDL_WINDOW_FULLSCREEN_DESKTOP: 4097,
        SDL_WINDOW_FOREIGN: 2048,
        SDL_WINDOW_ALLOW_HIGHDPI: 8192,
        SDL_WINDOW_MOUSE_CAPTURE: 16384,
    };

    ns.SDL_WindowEventID = {
        SDL_WINDOWEVENT_NONE: 0,
        SDL_WINDOWEVENT_SHOWN: 1,
        SDL_WINDOWEVENT_HIDDEN: 2,
        SDL_WINDOWEVENT_EXPOSED: 3,
        SDL_WINDOWEVENT_MOVED: 4,
        SDL_WINDOWEVENT_RESIZED: 5,
        SDL_WINDOWEVENT_SIZE_CHANGED: 6,
        SDL_WINDOWEVENT_MINIMIZED: 7,
        SDL_WINDOWEVENT_MAXIMIZED: 8,
        SDL_WINDOWEVENT_RESTORED: 9,
        SDL_WINDOWEVENT_ENTER: 10,
        SDL_WINDOWEVENT_LEAVE: 11,
        SDL_WINDOWEVENT_FOCUS_GAINED: 12,
        SDL_WINDOWEVENT_FOCUS_LOST: 13,
        SDL_WINDOWEVENT_CLOSE: 14,
    };

    ns.SDL_GLattr = {
        SDL_GL_RED_SIZE: 0,
        SDL_GL_GREEN_SIZE: 1,
        SDL_GL_BLUE_SIZE: 2,
        SDL_GL_ALPHA_SIZE: 3,
        SDL_GL_BUFFER_SIZE: 4,
        SDL_GL_DOUBLEBUFFER: 5,
        SDL_GL_DEPTH_SIZE: 6,
        SDL_GL_STENCIL_SIZE: 7,
        SDL_GL_ACCUM_RED_SIZE: 8,
        SDL_GL_ACCUM_GREEN_SIZE: 9,
        SDL_GL_ACCUM_BLUE_SIZE: 10,
        SDL_GL_ACCUM_ALPHA_SIZE: 11,
        SDL_GL_STEREO: 12,
        SDL_GL_MULTISAMPLEBUFFERS: 13,
        SDL_GL_MULTISAMPLESAMPLES: 14,
        SDL_GL_ACCELERATED_VISUAL: 15,
        SDL_GL_RETAINED_BACKING: 16,
        SDL_GL_CONTEXT_MAJOR_VERSION: 17,
        SDL_GL_CONTEXT_MINOR_VERSION: 18,
        SDL_GL_CONTEXT_EGL: 19,
        SDL_GL_CONTEXT_FLAGS: 20,
        SDL_GL_CONTEXT_PROFILE_MASK: 21,
        SDL_GL_SHARE_WITH_CURRENT_CONTEXT: 22,
        SDL_GL_FRAMEBUFFER_SRGB_CAPABLE: 23,
        SDL_GL_CONTEXT_RELEASE_BEHAVIOR: 24,
    };

    ns.SDL_GLprofile = {
        SDL_GL_CONTEXT_PROFILE_CORE: 1,
        SDL_GL_CONTEXT_PROFILE_COMPATIBILITY: 2,
        SDL_GL_CONTEXT_PROFILE_ES: 4,
    };

    ns.SDL_GLcontextFlag = {
        SDL_GL_CONTEXT_DEBUG_FLAG: 1,
        SDL_GL_CONTEXT_FORWARD_COMPATIBLE_FLAG: 2,
        SDL_GL_CONTEXT_ROBUST_ACCESS_FLAG: 4,
        SDL_GL_CONTEXT_RESET_ISOLATION_FLAG: 8,
    };

    ns.SDL_GLcontextReleaseFlag = {
        SDL_GL_CONTEXT_RELEASE_BEHAVIOR_NONE: 0,
        SDL_GL_CONTEXT_RELEASE_BEHAVIOR_FLUSH: 1,
    };

    ns.SDL_HitTestResult = {
        SDL_HITTEST_NORMAL: 0,
        SDL_HITTEST_DRAGGABLE: 1,
        SDL_HITTEST_RESIZE_TOPLEFT: 2,
        SDL_HITTEST_RESIZE_TOP: 3,
        SDL_HITTEST_RESIZE_TOPRIGHT: 4,
        SDL_HITTEST_RESIZE_RIGHT: 5,
        SDL_HITTEST_RESIZE_BOTTOMRIGHT: 6,
        SDL_HITTEST_RESIZE_BOTTOM: 7,
        SDL_HITTEST_RESIZE_BOTTOMLEFT: 8,
        SDL_HITTEST_RESIZE_LEFT: 9,
    };

    ns.SDL_DisplayMode = types.Struct({ format: 'uint32', w: 'int', h: 'int', refresh_rate: 'int', driverdata: 'void*' });

    ns.SDL_HitTest = ffi.Function('uint32', [ 'void*', SDL_PointPtr, 'void*' ]);

    ns.SDL_BlendMode = {
        SDL_BLENDMODE_NONE: 0,
        SDL_BLENDMODE_BLEND: 1,
        SDL_BLENDMODE_ADD: 2,
        SDL_BLENDMODE_MOD: 4,
    };

    ns.SDL_HAPTIC_CONSTANT     = (1<<0);
    ns.SDL_HAPTIC_SINE         = (1<<1);
    ns.SDL_HAPTIC_LEFTRIGHT    = (1<<2);
    ns.SDL_HAPTIC_TRIANGLE     = (1<<3);
    ns.SDL_HAPTIC_SAWTOOTHUP   = (1<<4);
    ns.SDL_HAPTIC_SAWTOOTHDOWN = (1<<5);
    ns.SDL_HAPTIC_RAMP         = (1<<6);
    ns.SDL_HAPTIC_SPRING       = (1<<7);
    ns.SDL_HAPTIC_DAMPER       = (1<<8);
    ns.SDL_HAPTIC_INERTIA      = (1<<9);
    ns.SDL_HAPTIC_FRICTION     = (1<<10);
    ns.SDL_HAPTIC_CUSTOM       = (1<<11);
    ns.SDL_HAPTIC_GAIN         = (1<<12);
    ns.SDL_HAPTIC_AUTOCENTER   = (1<<13);
    ns.SDL_HAPTIC_STATUS       = (1<<14);
    ns.SDL_HAPTIC_PAUSE        = (1<<15);
    ns.SDL_HAPTIC_POLAR        = 0;
    ns.SDL_HAPTIC_CARTESIAN    = 1;
    ns.SDL_HAPTIC_SPHERICAL    = 2;
    ns.SDL_HAPTIC_INFINITY     = 4294967295;

    ns.SDL_HapticDirection = types.Struct({ type: 'uint8', dir: types.Array('int', 3)});

    ns.SDL_HapticConstant = types.Struct({
        type: 'uint16',
        direction: ns.SDL_HapticDirection,
        length: 'uint32',
        delay: 'uint16',
        button: 'uint16',
        interval: 'uint16',
        level: 'int16',
        attack_length: 'uint16',
        attack_level: 'uint16',
        fade_length: 'uint16',
        fade_level: 'uint16',
    });

    ns.SDL_HapticPeriodic = types.Struct({
        type: 'uint16',
        direction: ns.SDL_HapticDirection,
        length: 'uint32',
        delay: 'uint16',
        button: 'uint16',
        interval: 'uint16',
        period: 'uint16',
        magnitude: 'int16',
        offset: 'int16',
        phase: 'uint16',
        attack_length: 'uint16',
        attack_level: 'uint16',
        fade_length: 'uint16',
        fade_level: 'uint16',
    });

    ns.SDL_HapticCondition = types.Struct({
        type: 'uint16',
        direction: ns.SDL_HapticDirection,
        length: 'uint32',
        delay: 'uint16',
        button: 'uint16',
        interval: 'uint16',
        right_sat: types.Array('uint16', 3),
        left_sat: types.Array('uint16', 3),
        right_coeff: types.Array('int16', 3),
        left_coeff: types.Array('int16', 3),
        deadband: types.Array('uint16', 3),
        center: types.Array('int16', 3),
    });

    ns.SDL_HapticRamp = types.Struct({
        type: 'uint16',
        direction: ns.SDL_HapticDirection,
        length: 'uint32',
        delay: 'uint16',
        button: 'uint16',
        interval: 'uint16',
        start: 'int16',
        end: 'int16',
        attack_length: 'uint16',
        attack_level: 'uint16',
        fade_length: 'uint16',
        fade_level: 'uint16',
    });

    ns.SDL_HapticLeftRight = types.Struct({
        type: 'uint16',
        length: 'uint32',
        large_magnitude: 'uint16',
        small_magnitude: 'uint16',
    });

    ns.SDL_HapticCustom = types.Struct({
        type: 'uint16',
        direction: ns.SDL_HapticDirection,
        length: 'uint32',
        delay: 'uint16',
        button: 'uint16',
        interval: 'uint16',
        channels: 'uint8',
        period: 'uint16',
        samples: 'uint16',
        data: 'uint16*',
        attack_length: 'uint16',
        attack_level: 'uint16',
        fade_length: 'uint16',
        fade_level: 'uint16',
    });

    ns.SDL_HapticEffect = types.Union({
        type: 'uint32',
        constant: ns.SDL_HapticConstant,
        periodic: ns.SDL_HapticPeriodic,
        condition: ns.SDL_HapticCondition,
        ramp: ns.SDL_HapticRamp,
        leftright: ns.SDL_HapticLeftRight,
        custom: ns.SDL_HapticCustom,
    });

    ns.SDL_RendererFlags = {
        SDL_RENDERER_SOFTWARE: 1,
        SDL_RENDERER_ACCELERATED: 2,
        SDL_RENDERER_PRESENTVSYNC: 4,
        SDL_RENDERER_TARGETTEXTURE: 8,
    };

    ns.SDL_TextureAccess = {
        SDL_TEXTUREACCESS_STATIC: 0,
        SDL_TEXTUREACCESS_STREAMING: 1,
        SDL_TEXTUREACCESS_TARGET: 2,
    };

    ns.SDL_TextureModulate = {
        SDL_TEXTUREMODULATE_NONE: 0,
        SDL_TEXTUREMODULATE_COLOR: 1,
        SDL_TEXTUREMODULATE_ALPHA: 2,
    };

    ns.SDL_RendererFlip = {
        SDL_FLIP_NONE: 0,
        SDL_FLIP_HORIZONTAL: 1,
        SDL_FLIP_VERTICAL: 2,
    };

    ns.SDL_RendererInfo = types.Struct({
        name: 'char*',
        flags: 'uint32',
        num_texture_formats: 'uint32',
        texture_formats: types.Array('uint32', 16),
        max_texture_width: 'int',
        max_texture_height: 'int',
    });

    ns.SDL_Finger = types.Struct({ id: 'int64', x: 'float', y: 'float', pressure: 'float' });

    ns.SDL_TOUCH_MOUSEID = 0xFFFFFFFF;

    ns.SDL_HintPriority = {
        SDL_HINT_DEFAULT: 0,
        SDL_HINT_NORMAL: 1,
        SDL_HINT_OVERRIDE: 2,
    };

    ns.SDL_HintCallback = ffi.Function('void', [ 'void*', 'char*', 'char*', 'char*' ]);

    ns.SDL_TimerCallback = ffi.Function('uint32', [ 'uint32', 'void*' ]);

    ns.SDL_SystemCursor = {
        SDL_SYSTEM_CURSOR_ARROW: 0,
        SDL_SYSTEM_CURSOR_IBEAM: 1,
        SDL_SYSTEM_CURSOR_WAIT: 2,
        SDL_SYSTEM_CURSOR_CROSSHAIR: 3,
        SDL_SYSTEM_CURSOR_WAITARROW: 4,
        SDL_SYSTEM_CURSOR_SIZENWSE: 5,
        SDL_SYSTEM_CURSOR_SIZENESW: 6,
        SDL_SYSTEM_CURSOR_SIZEWE: 7,
        SDL_SYSTEM_CURSOR_SIZENS: 8,    
        SDL_SYSTEM_CURSOR_SIZEALL: 9,
        SDL_SYSTEM_CURSOR_NO: 10,
        SDL_SYSTEM_CURSOR_HAND: 11,
        SDL_NUM_SYSTEM_CURSORS: 12,
    };

    ns.SDL_MouseWheelDirection = {
        SDL_MOUSEWHEEL_NORMAL: 0,
        SDL_MOUSEWHEEL_FLIPPED: 1
    };

    ns.SDL_BUTTON = x => 1 << (x - 1);
    ns.SDL_BUTTON_LEFT = 1;
    ns.SDL_BUTTON_MIDDLE = 2;
    ns.SDL_BUTTON_RIGHT = 3;
    ns.SDL_BUTTON_X1 = 4;
    ns.SDL_BUTTON_X2 = 5;
    ns.SDL_BUTTON_LMASK = ns.SDL_BUTTON(ns.SDL_BUTTON_LEFT);
    ns.SDL_BUTTON_MMASK = ns.SDL_BUTTON(ns.SDL_BUTTON_MIDDLE);
    ns.SDL_BUTTON_RMASK = ns.SDL_BUTTON(ns.SDL_BUTTON_RIGHT);
    ns.SDL_BUTTON_X1MASK = ns.SDL_BUTTON(ns.SDL_BUTTON_X1);
    ns.SDL_BUTTON_X2MASK = ns.SDL_BUTTON(ns.SDL_BUTTON_X2);

    ns.SDL_AUDIO_MASK_BITSIZE = 0xFF;
    ns.SDL_AUDIO_MASK_DATATYPE = 1 << 8;
    ns.SDL_AUDIO_MASK_ENDIAN = 1 << 12;
    ns.SDL_AUDIO_MASK_SIGNED = 1<<15;
    ns.SDL_AUDIO_BITSIZE = x => x & ns.SDL_AUDIO_MASK_BITSIZE;
    ns.SDL_AUDIO_ISFLOAT = x => x & ns.SDL_AUDIO_MASK_DATATYPE;
    ns.SDL_AUDIO_ISBIGENDIAN = x => x & ns.SDL_AUDIO_MASK_ENDIAN;
    ns.SDL_AUDIO_ISSIGNED = x => x & ns.SDL_AUDIO_MASK_SIGNED;
    ns.SDL_AUDIO_ISINT = x => !ns.SDL_AUDIO_ISFLOAT(x);
    ns.SDL_AUDIO_ISLITTLEENDIAN = x => !ns.SDL_AUDIO_ISBIGENDIAN(x);
    ns.SDL_AUDIO_ISUNSIGNED = x => !ns.SDL_AUDIO_ISSIGNED(x);

    ns.AUDIO_U8 = 0x0008;
    ns.AUDIO_S8 = 0x8008;
    ns.AUDIO_U16LSB = 0x0010;
    ns.AUDIO_S16LSB = 0x8010;
    ns.AUDIO_U16MSB = 0x1010;
    ns.AUDIO_S16MSB = 0x9010;
    ns.AUDIO_U16 = ns.AUDIO_U16LSB;
    ns.AUDIO_S16 = ns.AUDIO_S16LSB;

    ns.AUDIO_S32LSB = 0x8020;
    ns.AUDIO_S32MSB = 0x9020;
    ns.AUDIO_S32 = ns.AUDIO_S32LSB;

    ns.AUDIO_F32LSB = 0x8120;
    ns.AUDIO_F32MSB = 0x9120;
    ns.AUDIO_F32 = ns.AUDIO_F32LSB;

    ns.AUDIO_U16SYS = isLittleEndian ? ns.AUDIO_U16LSB : ns.AUDIO_U16MSB;
    ns.AUDIO_S16SYS = isLittleEndian ? ns.AUDIO_S16LSB : ns.AUDIO_S16MSB;
    ns.AUDIO_S32SYS = isLittleEndian ? ns.AUDIO_S32LSB : ns.AUDIO_S32MSB;
    ns.AUDIO_F32SYS = isLittleEndian ? ns.AUDIO_F32LSB : ns.AUDIO_F32MSB;

    ns.SDL_AUDIO_ALLOW_FREQUENCY_CHANGE = 0x00000001;
    ns.SDL_AUDIO_ALLOW_FORMAT_CHANGE = 0x00000002;
    ns.SDL_AUDIO_ALLOW_CHANNELS_CHANGE = 0x00000004;
    ns.SDL_AUDIO_ALLOW_ANY_CHANGE = (ns.SDL_AUDIO_ALLOW_FREQUENCY_CHANGE | ns.SDL_AUDIO_ALLOW_FORMAT_CHANGE | ns.SDL_AUDIO_ALLOW_CHANNELS_CHANGE);

    ns.SDL_MIX_MAXVOLUME = 128;

    ns.SDL_AudioStatus = {
        SDL_AUDIO_STOPPED: 0,
        SDL_AUDIO_PLAYING: 1,
        SDL_AUDIO_PAUSED: 2,
    };

    const SDL_AudioCallback = ns.SDL_AudioCallback = ffi.Function('void', [ 'void*', 'uint8*', 'int' ]);

    ns.SDL_AudioSpec = types.Struct({
        freq: 'int',
        format: 'uint16',
        channels: 'uint8',
        silence: 'uint8',
        samples: 'uint16',
        padding: 'uint16',
        size: 'uint32',
        callback: SDL_AudioCallback,
        userdata: 'void*',
    });

    const SDL_AudioFilter = ns.SDL_AudioFilter = ffi.Function('void', [ 'void*', 'uint16' ]);

    ns.SDL_AudioCVT = types.Struct({
        needed: 'int',
        src_format: 'uint16',
        dst_format: 'uint16',
        rate_incr: 'double',
        buf: 'uint8*',
        len: 'int',
        len_cvt: 'int',
        len_mult: 'int',
        len_ratio: 'double',
        filters: types.Array(SDL_AudioFilter, 10),
        filter_index: 'int',
    });

    ns.SDL_NONSHAPEABLE_WINDOW = -1;
    ns.SDL_INVALID_SHAPE_ARGUMENT = -2;
    ns.SDL_WINDOW_LACKS_SHAPE = -3;

    ns.WindowShapeMode = {
        ShapeModeDefault: 0,
        ShapeModeBinarizeAlpha: 1,
        ShapeModeReverseBinarizeAlpha: 2,
        ShapeModeColorKey: 3,
    };

    const SDL_WindowShapeParams = ns.SDL_WindowShapeParams = types.Union({
        binarizationCutoff: 'uint8',
        colorKey: SDL_Color,
    });

    ns.SDL_WindowShapeMode = types.Struct({
        mode: 'int',
        parameters: SDL_WindowShapeParams,
    });

    return ns;
}

exports.load = (path, functionFilter, nativeCallLib, ns) => {
    const ref = nativeCallLib.ref;
    const functionTemplates = {};
    const readPermission = ref.allocCString("rb");

    loadConstantsAndTypes(nativeCallLib, ns);

    /* SDL.h */

    Object.assign(functionTemplates, {
        SDL_Init:          [ 'int',    [ 'uint32' ] ],
        SDL_InitSubSystem: [ 'int',    [ 'uint32' ] ],
        SDL_QuitSubSystem: [ 'void',   [ 'uint32' ] ],
        SDL_WasInit:       [ 'uint32', [ 'uint32' ] ],
        SDL_Quit:          [ 'int',    [ ] ],
    });

    /* SDL_version.h */

    const SDL_version = ns.SDL_version;
    const SDL_versionPtr = ref.refType(SDL_version);
    
    Object.assign(functionTemplates, {
        SDL_GetVersion: [ 'void', [ SDL_versionPtr ] ],
        SDL_GetRevision: [ 'char*', [ ] ],
        SDL_GetRevisionNumber: [ 'int', [ ] ],
    });

    /* SDL_error.h */

    Object.assign(functionTemplates, {
        SDL_GetError: [ 'char*', [ ] ],
        SDL_ClearError: [ 'void', [ ] ],
    });

    /* SDL_rwops.h */

    const SDL_RWops = ns.SDL_RWops;
    const SDL_RWopsPtr = ref.refType(SDL_RWops);
    
    Object.assign(functionTemplates, {
        SDL_RWFromFile: [ SDL_RWopsPtr, [ 'char*', 'char*' ] ],
        SDL_RWFromFP: [ SDL_RWopsPtr, [ 'void*', 'int' ] ],
        SDL_RWFromMem: [ SDL_RWopsPtr, [ 'void*', 'int' ] ],
        SDL_RWFromConstMem: [ SDL_RWopsPtr, [ 'void*', 'int' ] ],
        SDL_AllocRW: [ SDL_RWopsPtr, [ ] ],
        SDL_FreeRW: [ 'void', [ SDL_RWopsPtr ] ],
        SDL_ReadU8: [ 'uint8', [ SDL_RWopsPtr ] ],
        SDL_ReadLE16: [ 'uint16', [ SDL_RWopsPtr ] ],
        SDL_ReadBE16: [ 'uint16', [ SDL_RWopsPtr ] ],
        SDL_ReadLE32: [ 'uint32', [ SDL_RWopsPtr ] ],
        SDL_ReadBE32: [ 'uint32', [ SDL_RWopsPtr ] ],
        SDL_ReadLE64: [ 'uint64', [ SDL_RWopsPtr ] ],
        SDL_ReadBE64: [ 'uint64', [ SDL_RWopsPtr ] ],
        SDL_WriteU8: [ 'size_t', [ SDL_RWopsPtr, 'uint8' ] ],
        SDL_WriteLE16: [ 'size_t', [ SDL_RWopsPtr, 'uint16' ] ],
        SDL_WriteBE16: [ 'size_t', [ SDL_RWopsPtr, 'uint16' ] ],
        SDL_WriteLE32: [ 'size_t', [ SDL_RWopsPtr, 'uint32' ] ],
        SDL_WriteBE32: [ 'size_t', [ SDL_RWopsPtr, 'uint32' ] ],
        SDL_WriteLE64: [ 'size_t', [ SDL_RWopsPtr, 'uint64' ] ],
        SDL_WriteBE64: [ 'size_t', [ SDL_RWopsPtr, 'uint64' ] ],
    });
    
    /* SDL_rect.h */

    const SDL_Point = ns.SDL_Point;
    const SDL_PointPtr = ref.refType(SDL_Point);
    const SDL_Rect = ns.SDL_Rect;
    const SDL_RectPtr = ref.refType(SDL_Rect);

    Object.assign(functionTemplates, {
        SDL_GetError: [ 'char*', [ ] ],
        SDL_HasIntersection: [ 'int', [ SDL_RectPtr, SDL_RectPtr ] ],
        SDL_IntersectRect: [ 'int', [ SDL_RectPtr, SDL_RectPtr, SDL_RectPtr ] ],
        SDL_UnionRect: [ 'void', [ SDL_RectPtr, SDL_RectPtr, SDL_RectPtr ] ],
        SDL_EnclosePoints: [ 'int', [ SDL_PointPtr, 'int', SDL_RectPtr, SDL_RectPtr ] ],
        SDL_IntersectRectAndLine: [ 'int', [ SDL_RectPtr, 'int*', 'int*', 'int*', 'int*' ] ],
    });
    
    ns.SDL_PointInRect = (pointRef, rectRef) => {
        const p = pointRef.deref();
        const r = rectRef.deref();
        
        return ( (p.x >= r.x) && (p.x < (r.x + r.w)) && (p.y >= r.y) && (p.y < (r.y + r.h)) ) ? ns.SDL_TRUE : ns.SDL_FALSE;
    };

    ns.SDL_RectEmpty = (rectRef) => {
        if (rectRef.isNull()) {
            return ns.SDL_TRUE;
        }

        const r = rectRef.deref();
        return ((r.w <= 0) || (r.h <= 0)) ? ns.SDL_TRUE : ns.SDL_FALSE;
    };

    ns.SDL_RectEquals = (aRef, bRef) => {
        const a = aRef.deref();
        const b = bRef.deref();
        
        if (a.isNull() || b.isNull()) {
            return false;
        }
        
        return ((a.x === b.x) && (a.y === b.y) && (a.w === b.w) && (a.h === b.h)) ? ns.SDL_TRUE : ns.SDL_FALSE;
    };
    
    /* SDL_pixels.h */

    const SDL_Color = ns.SDL_Color;
    const SDL_ColorPtr = ref.refType(SDL_Color);
    const SDL_Palette = ns.SDL_Palette;
    const SDL_PalettePtr = ref.refType(SDL_Palette);
    const SDL_PixelFormat = ns.SDL_PixelFormat;
    const SDL_PixelFormatPtr = ref.refType(SDL_PixelFormat);

    Object.assign(functionTemplates, {
        SDL_GetPixelFormatName:     [ 'char*',            [ 'uint32' ] ],
        SDL_PixelFormatEnumToMasks: [ 'uint32',           [ 'uint32', 'int*', 'uint32*', 'uint32*', 'uint32*', 'uint32*' ] ],
        SDL_MasksToPixelFormatEnum: [ 'uint32',           [ 'int', 'uint32', 'uint32', 'uint32', 'uint32' ] ],
        SDL_FreeFormat:             [ 'void',             [ SDL_PixelFormatPtr ] ],
        SDL_SetPixelFormatPalette:  [ 'int',              [ SDL_PixelFormatPtr, SDL_PalettePtr ] ],
        SDL_SetPaletteColors:       [ 'int',              [ SDL_PalettePtr, SDL_ColorPtr, 'int', 'int' ] ],
        SDL_FreePalette:            [ 'void',             [ SDL_PalettePtr ] ],
        SDL_MapRGB:                 [ 'uint32',           [ SDL_PixelFormatPtr, 'uint8', 'uint8', 'uint8' ] ],
        SDL_MapRGBA:                [ 'uint32',           [ SDL_PixelFormatPtr, 'uint8', 'uint8', 'uint8', 'uint8' ] ],
        SDL_GetRGB:                 [ 'void',             [ 'uint32', SDL_PixelFormatPtr, 'uint8*', 'uint8*', 'uint8*' ] ],
        SDL_GetRGBA:                [ 'void',             [ 'uint32', SDL_PixelFormatPtr, 'uint8*', 'uint8*', 'uint8*', 'uint8*' ] ],
        SDL_CalculateGammaRamp:     [ 'void',             [ 'float', 'uint16*' ] ],
        SDL_AllocFormat:            [ SDL_PixelFormatPtr, [ 'uint32' ] ],
        SDL_AllocPalette:           [ SDL_PalettePtr,     [ 'int' ] ],
    });

    /* SDL_surface.h */

    const SDL_Surface = ns.SDL_Surface;
    const SDL_SurfacePtr = ref.refType(SDL_Surface);

    Object.assign(functionTemplates, {
        SDL_FreeSurface:            [ 'void',           [ SDL_SurfacePtr ]],
        SDL_SetSurfacePalette:      [ 'int',            [ SDL_SurfacePtr, SDL_PalettePtr ]],
        SDL_LockSurface:            [ 'int',            [ SDL_SurfacePtr ]],
        SDL_UnlockSurface:          [ 'void',           [ SDL_SurfacePtr ]],
        SDL_SaveBMP_RW:             [ 'int',            [ SDL_SurfacePtr, SDL_RWopsPtr, 'int' ]],
        SDL_SetSurfaceRLE:          [ 'int',            [ SDL_SurfacePtr, 'int' ]],
        SDL_SetColorKey:            [ 'int',            [ SDL_SurfacePtr, 'int', 'uint32' ]],
        SDL_GetColorKey:            [ 'int',            [ SDL_SurfacePtr, 'uint32*' ]],
        SDL_SetSurfaceColorMod:     [ 'int',            [ SDL_SurfacePtr, 'uint8', 'uint8', 'uint8' ]],
        SDL_GetSurfaceColorMod:     [ 'int',            [ SDL_SurfacePtr, 'uint8*', 'uint8*', 'uint8*' ]],
        SDL_SetSurfaceAlphaMod:     [ 'int',            [ SDL_SurfacePtr, 'uint8' ]],
        SDL_GetSurfaceAlphaMod:     [ 'int',            [ SDL_SurfacePtr, 'uint8*' ]],
        SDL_SetSurfaceBlendMode:    [ 'int',            [ SDL_SurfacePtr, 'uint32' ]],
        SDL_GetSurfaceBlendMode:    [ 'int',            [ SDL_SurfacePtr, 'uint32*' ]],
        SDL_SetClipRect:            [ 'uint32',         [ SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_GetClipRect:            [ 'void',           [ SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_ConvertPixels:          [ 'int',            [ 'int', 'int', 'uint32', 'void*', 'int', 'uint32', 'void*', 'int' ]],
        SDL_FillRect:               [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, 'uint32' ]],
        SDL_FillRects:              [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, 'int', 'uint32' ]],
        SDL_UpperBlit:              [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_LowerBlit:              [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_SoftStretch:            [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_UpperBlitScaled:        [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_LowerBlitScaled:        [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_CreateRGBSurface:       [ SDL_SurfacePtr,   [ 'uint32', 'int', 'int', 'int', 'uint32', 'uint32', 'uint32', 'uint32' ]],
        SDL_CreateRGBSurfaceFrom:   [ SDL_SurfacePtr,   [ 'void*', 'int', 'int', 'int', 'int', 'uint32', 'uint32', 'uint32', 'uint32' ]],
        SDL_LoadBMP_RW:             [ SDL_SurfacePtr,   [ SDL_RWopsPtr, 'int' ]],
        SDL_ConvertSurface:         [ SDL_SurfacePtr,   [ SDL_SurfacePtr, SDL_PixelFormatPtr, 'uint32' ]],
        SDL_ConvertSurfaceFormat:   [ SDL_SurfacePtr,   [ SDL_SurfacePtr, 'uint32', 'uint32' ]],
    });

    ns.SDL_BlitSurface = () => ns.SDL_UpperBlit.apply(null, arguments);
    ns.SDL_BlitScaled = () => ns.SDL_UpperBlitScaled.apply(null, arguments);

    /* SDL_events.h */

    const SDL_EventPtr = ref.refType(ns.SDL_Event);
    const SDL_EventFilter = ns.SDL_EventFilter;
    const SDL_EventFilterPtr = ref.refType(SDL_EventFilter);

    Object.assign(functionTemplates, {
        SDL_PollEvent:          ['int',     [ SDL_EventPtr ]],
        SDL_PumpEvents:         ['void',    [ ]],
        SDL_PeepEvents:         ['int',     [ SDL_EventPtr, 'int', 'uint32', 'uint32', 'uint32' ]],
        SDL_HasEvent:           ['uint32',  [ 'uint32' ]],
        SDL_HasEvents:          ['uint32',  [ 'uint32', 'uint32' ]],
        SDL_FlushEvent:         ['void',    [ 'uint32' ]],
        SDL_FlushEvents:        ['void',    [ 'uint32', 'uint32' ]],
        SDL_WaitEvent:          ['int',     [ SDL_EventPtr ]],
        SDL_WaitEventTimeout:   ['int',     [ SDL_EventPtr, 'int' ] ],
        SDL_EventState:         ['uint8',   [ 'uint32', 'int' ]],
        SDL_RegisterEvents:     ['uint32',  [ 'int' ]],
        SDL_AddEventWatch:      ['void',    [ SDL_EventFilter, 'void*' ]],
        SDL_FilterEvents:       ['void',    [ SDL_EventFilter, 'void*' ]],
        SDL_SetEventFilter:     ['void',    [ SDL_EventFilter, 'void*' ]],
        SDL_GetEventFilter:     ['uint32',  [ SDL_EventFilterPtr, 'void**' ]],
        SDL_DelEventWatch:      ['void',    [ SDL_EventFilter, 'void*' ]],
        SDL_PushEvent:          ['int',     [ SDL_EventPtr ]],
    });

    /* SDL_video.h */

    const SDL_DisplayMode = ns.SDL_DisplayMode;
    const SDL_DisplayModePtr = ref.refType(SDL_DisplayMode);
    const SDL_HitTest = ns.SDL_HitTest;

    Object.assign(functionTemplates, {
        SDL_GetNumVideoDrivers:         [ 'int' ,               [  ]],
        SDL_GetVideoDriver:             [ 'char*',              [ 'int' ]],
        SDL_VideoInit:                  [ 'int',                [ 'char*' ]],
        SDL_VideoQuit:                  [ 'void',               [  ]],
        SDL_GetCurrentVideoDriver:      [ 'char*',              [  ]],
        SDL_GetNumVideoDisplays:        [ 'int',                [  ]],
        SDL_GetDisplayName:             [ 'char*',              [ 'int' ]],
        SDL_GetDisplayBounds:           [ 'int',                [ 'int', SDL_RectPtr ]],
        SDL_GetDisplayDPI:              [ 'int',                [ 'int', 'float*', 'float*', 'float*' ]],
        SDL_GetNumDisplayModes:         [ 'int',                [ 'int' ]],
        SDL_GetDisplayMode:             [ 'int',                [ 'int', 'int', SDL_DisplayModePtr ]],
        SDL_GetDesktopDisplayMode:      [ 'int',                [ 'int', SDL_DisplayModePtr ]],
        SDL_GetCurrentDisplayMode:      [ 'int',                [ 'int', SDL_DisplayModePtr ]],
        SDL_GetWindowDisplayIndex:      [ 'int',                [ 'void*' ]],
        SDL_SetWindowDisplayMode:       [ 'int',                [ 'void*', SDL_DisplayModePtr ]],
        SDL_GetWindowDisplayMode:       [ 'int',                [ 'void*', SDL_DisplayModePtr ]],
        SDL_GetWindowPixelFormat:       [ 'uint32',             [ 'void*' ]],
        SDL_CreateWindow:               [ 'void*',              [ 'char*', 'int', 'int', 'int', 'int', 'uint32' ]],
        SDL_CreateWindowFrom:           [ 'void*',              [ 'void*' ]],
        SDL_GetWindowID:                [ 'uint32',             [ 'void*' ]],
        SDL_GetWindowFromID:            [ 'void*',              [ 'uint32' ]],
        SDL_GetWindowFlags:             [ 'uint32',             [ 'void*' ]],
        SDL_SetWindowTitle:             [ 'void',               [ 'void*', 'char*' ]],
        SDL_GetWindowTitle:             [ 'char*',              [ 'void*' ]],
        SDL_SetWindowIcon:              [ 'void',               [ 'void*', SDL_SurfacePtr ]],
        SDL_SetWindowData:              [ 'void*',              [ 'void*', 'char*', 'void*' ]],
        SDL_GetWindowData:              [ 'void*',              [ 'void*', 'char*' ]],
        SDL_SetWindowPosition:          [ 'void',               [ 'void*', 'int', 'int' ]],
        SDL_GetWindowPosition:          [ 'void',               [ 'void*', 'int*', 'int*' ]],
        SDL_SetWindowSize:              [ 'void',               [ 'void*', 'int', 'int' ]],
        SDL_GetWindowSize:              [ 'void',               [ 'void*', 'int*', 'int*' ]],
        SDL_SetWindowMinimumSize:       [ 'void',               [ 'void*', 'int', 'int' ]],
        SDL_GetWindowMinimumSize:       [ 'void',               [ 'void*', 'int*', 'int*' ]],
        SDL_SetWindowMaximumSize:       [ 'void',               [ 'void*', 'int', 'int' ]],
        SDL_GetWindowMaximumSize:       [ 'void',               [ 'void*', 'int*', 'int*' ]],
        SDL_SetWindowBordered:          [ 'void',               [ 'void*', 'uint32' ]],
        SDL_ShowWindow:                 [ 'void',               [ 'void*' ]],
        SDL_HideWindow:                 [ 'void',               [ 'void*' ]],
        SDL_RaiseWindow:                [ 'void',               [ 'void*' ]],
        SDL_MaximizeWindow:             [ 'void',               [ 'void*' ]],
        SDL_MinimizeWindow:             [ 'void',               [ 'void*' ]],
        SDL_RestoreWindow:              [ 'void',               [ 'void*' ]],
        SDL_SetWindowFullscreen:        [ 'int',                [ 'void*', 'uint32' ]],
        SDL_UpdateWindowSurface:        [ 'int',                [ 'void*' ]],
        SDL_UpdateWindowSurfaceRects:   [ 'int',                [ 'void*', SDL_RectPtr, 'int' ]],
        SDL_SetWindowGrab:              [ 'void',               [ 'void*', 'uint32' ]],
        SDL_GetWindowGrab:              [ 'uint32',             [ 'void*' ]],
        SDL_GetGrabbedWindow:           [ 'void*',              [  ]],
        SDL_SetWindowBrightness:        [ 'int',                [ 'void*', 'float']],
        SDL_GetWindowBrightness:        [ 'float',              [ 'void*' ]],
        SDL_SetWindowGammaRamp:         [ 'int',                [ 'void*', 'uint16*', 'uint16*', 'uint16*' ]],
        SDL_GetWindowGammaRamp:         [ 'int',                [ 'void*', 'uint16*', 'uint16*', 'uint16*' ]],
        SDL_SetWindowHitTest:           [ 'int',                [ 'void*', SDL_HitTest, 'void*' ]],
        SDL_DestroyWindow:              [ 'void',               [ 'void*' ]],
        SDL_IsScreenSaverEnabled:       [ 'uint32',             [  ]],
        SDL_EnableScreenSaver:          [ 'void',               [  ]],
        SDL_DisableScreenSaver:         [ 'void',               [  ]],
        SDL_GL_LoadLibrary:             [ 'int',                [ 'char*' ]],
        SDL_GL_GetProcAddress:          [ 'void*',              [ 'char*' ]],
        SDL_GL_UnloadLibrary:           [ 'void',               [  ]],
        SDL_GL_ExtensionSupported:      [ 'uint32',             [ 'char*' ]],
        SDL_GL_ResetAttributes:         [ 'void',               [  ]],
        SDL_GL_SetAttribute:            [ 'int',                [ 'uint32', 'int' ]],
        SDL_GL_GetAttribute:            [ 'int',                [ 'uint32', 'int*' ]],
        SDL_GL_CreateContext:           [ 'void*',              [ 'void*' ]],
        SDL_GL_MakeCurrent:             [ 'int',                [ 'void*', 'void*' ]],
        SDL_GL_GetCurrentWindow:        [ 'void*',              [  ]],
        SDL_GL_GetCurrentContext:       [ 'void*',              [  ]],
        SDL_GL_GetDrawableSize:         [ 'void',               [ 'void*', 'int*', 'int*' ]],
        SDL_GL_SetSwapInterval:         [ 'int',                [ 'int' ]],
        SDL_GL_GetSwapInterval:         [ 'int',                [  ]],
        SDL_GL_SwapWindow:              [ 'void',               [ 'void*' ]],
        SDL_GL_DeleteContext:           [ 'void',               [ 'void*' ]],
        SDL_GetClosestDisplayMode:      [ SDL_DisplayModePtr,   [ 'int', SDL_DisplayModePtr, SDL_DisplayModePtr ]],
        SDL_GetWindowSurface:           [ SDL_SurfacePtr,       [ 'void*' ]],
    });

    /* SDL_mouse.h */

    Object.assign(functionTemplates, {
        SDL_ShowCursor: [ 'int',  [ 'int' ] ],
        SDL_GetMouseFocus: [ 'void*', [ ] ],
        SDL_GetMouseState: [ 'uint32', [ 'int*', 'int*' ] ],
        SDL_GetGlobalMouseState: [ 'uint32', [ 'int*', 'int*' ] ],
        SDL_GetRelativeMouseState: [ 'uint32', [ 'int*', 'int*' ] ],
        SDL_WarpMouseInWindow: [ 'void', [ 'void*', 'int', 'int' ] ],
        SDL_WarpMouseGlobal: [ 'int', [ 'int', 'int' ] ],
        SDL_SetRelativeMouseMode: [ 'int', [ 'int' ] ],
        SDL_CaptureMouse: [ 'int', [ 'int' ] ],
        SDL_GetRelativeMouseMode: [ 'int', [ ] ],
        SDL_CreateCursor: [ 'void*', [ 'uint8*', 'uint8*', 'int', 'int', 'int', 'int' ] ],
        SDL_CreateColorCursor: [ 'void*', [ SDL_SurfacePtr, 'int', 'int' ] ],
        SDL_CreateSystemCursor: [ 'void*', [ 'int' ] ],
        SDL_SetCursor: [ 'void', [ 'void*' ] ],
        SDL_GetCursor: [ 'void*', [ ] ],
        SDL_GetDefaultCursor: [ 'void*', [ ] ],
        SDL_FreeCursor: [ 'void', [ 'void*' ] ],
    });

    /* SDL_haptic.h */

    const SDL_HapticEffectPtr = ref.refType(ns.SDL_HapticEffect);

    Object.assign(functionTemplates, {
        SDL_NumHaptics:                 [ 'int',    [ ] ],
        SDL_HapticName:                 [ 'char*',  [ 'int' ] ],
        SDL_HapticOpen:                 [ 'void*',  [ 'int' ] ],
        SDL_HapticOpened:               [ 'int',    [ 'int' ] ],
        SDL_HapticIndex:                [ 'int',    [ 'void*' ] ],
        SDL_MouseIsHaptic:              [ 'int',    [ ] ],
        SDL_HapticOpenFromMouse:        [ 'void*',  [ ] ],
        SDL_JoystickIsHaptic:           [ 'int',    [ 'void*' ] ],
        SDL_HapticOpenFromJoystick:     [ 'void*',  [ 'void*' ] ],
        SDL_HapticClose:                [ 'void',   [ 'void*' ] ],
        SDL_HapticNumEffects:           [ 'int',    [ 'void*' ] ],
        SDL_HapticNumEffectsPlaying:    [ 'int',    [ 'void*' ] ],
        SDL_HapticQuery:                [ 'uint32', [ 'void*'] ],
        SDL_HapticNumAxes:              [ 'int',    [ 'void*' ] ],
        SDL_HapticEffectSupported:      [ 'int',    [ 'void*', SDL_HapticEffectPtr ] ],
        SDL_HapticNewEffect:            [ 'int',    [ 'void*', SDL_HapticEffectPtr ] ],
        SDL_HapticUpdateEffect:         [ 'int',    [ 'void*', 'int', SDL_HapticEffectPtr ] ],
        SDL_HapticRunEffect:            [ 'int',    [ 'void*', 'int', 'uint32' ] ],
        SDL_HapticStopEffect:           [ 'int',    [ 'void*', 'int' ] ],
        SDL_HapticDestroyEffect:        [ 'void',   [ 'void*', 'int' ] ],
        SDL_HapticGetEffectStatus:      [ 'int',    [ 'void*', 'int' ] ],
        SDL_HapticSetGain:              [ 'int',    [ 'void*', 'int' ] ],
        SDL_HapticSetAutocenter:        [ 'int',    [ 'void*', 'int' ] ],
        SDL_HapticPause:                [ 'int',    [ 'void*' ] ],
        SDL_HapticUnpause:              [ 'int',    [ 'void*' ] ],
        SDL_HapticStopAll:              [ 'int',    [ 'void*' ] ],
        SDL_HapticRumbleSupported:      [ 'int',    [ 'void*' ] ],
        SDL_HapticRumbleInit:           [ 'int',    [ 'void*' ] ],
        SDL_HapticRumblePlay:           [ 'int',    [ 'void*', 'float', 'uint32'  ] ],
        SDL_HapticRumbleStop:           [ 'int',    [ 'void*' ] ],
    });
    
    /* SDL_render.h */

    const SDL_RendererInfoPtr = ref.refType(ns.SDL_RendererInfo);

    Object.assign(functionTemplates, {
        SDL_GetNumRenderDrivers: ['int', []],
        SDL_GetRenderDriverInfo: ['int', ['int', SDL_RendererInfoPtr]],
        SDL_CreateWindowAndRenderer: ['int', ['int', 'int', 'uint32', 'void**', 'void**']],
        SDL_CreateRenderer: ['void*', ['void*', 'int', 'uint32']],
        SDL_CreateSoftwareRenderer: ['void*', ['void*']],
        SDL_GetRenderer: ['void*', ['void*']],
        SDL_GetRendererInfo: ['int', ['void*', SDL_RendererInfoPtr]],
        SDL_GetRendererOutputSize: ['int', ['void*', 'int*', 'int*']],
        SDL_CreateTexture: ['void*', ['void*', 'uint32', 'int', 'int', 'int']],
        SDL_CreateTextureFromSurface: ['void*', ['void*', 'void*']],
        SDL_QueryTexture: ['int', ['void*', 'uint32*', 'int*', 'int*', 'int*']],
        SDL_SetTextureColorMod: ['int', ['void*', 'uint8', 'uint8', 'uint8']],
        SDL_GetTextureColorMod: ['int', ['void*', 'uint8*', 'uint8*', 'uint8*']],
        SDL_SetTextureAlphaMod: ['int', ['void*', 'uint8']],
        SDL_GetTextureAlphaMod: ['int', ['void*', 'uint8*']],
        SDL_SetTextureBlendMode: ['int', ['void*', 'uint32']],
        SDL_GetTextureBlendMode: ['int', ['void*', 'uint32*']],
        SDL_UpdateTexture: ['int', ['void*', SDL_RectPtr, 'void*', 'int']],
        SDL_UpdateYUVTexture: ['int', ['void*', SDL_RectPtr, 'uint8*', 'int', 'uint8*', 'int', 'uint8*', 'int']],
        SDL_LockTexture: ['int', ['void*', SDL_RectPtr, 'void**', 'int*']],
        SDL_UnlockTexture: ['void', ['void*']],
        SDL_RenderTargetSupported: ['uint32', ['void*']],
        SDL_SetRenderTarget: ['int', ['void*', 'void*']],
        SDL_GetRenderTarget: ['void*', ['void*']],
        SDL_RenderSetLogicalSize: ['int', ['void*', 'int', 'int']],
        SDL_RenderGetLogicalSize: ['void', ['void*', 'int*', 'int*']],
        SDL_RenderSetViewport: ['int', ['void*', SDL_RectPtr]],
        SDL_RenderGetViewport: ['void', ['void*', SDL_RectPtr]],
        SDL_RenderSetClipRect: ['int', ['void*', SDL_RectPtr]],
        SDL_RenderGetClipRect: ['void', ['void*', SDL_RectPtr]],
        SDL_RenderIsClipEnabled: ['uint32', ['void*']],
        SDL_RenderSetScale: ['int', ['void*', 'float', 'float']],
        SDL_RenderGetScale: ['void', ['void*', 'float*', 'float*']],
        SDL_SetRenderDrawColor: ['int', ['void*', 'uint8', 'uint8', 'uint8', 'uint8']],
        SDL_GetRenderDrawColor: ['int', ['void*', 'uint8*', 'uint8*', 'uint8*', 'uint8*']],
        SDL_SetRenderDrawBlendMode: ['int', ['void*', 'uint32']],
        SDL_GetRenderDrawBlendMode: ['int', ['void*', 'uint32*']],
        SDL_RenderClear: ['int', ['void*']],
        SDL_RenderDrawPoint: ['int', ['void*', 'int', 'int']],
        SDL_RenderDrawPoints: ['int', ['void*', SDL_PointPtr, 'int']],
        SDL_RenderDrawLine: ['int', ['void*', 'int', 'int', 'int', 'int']],
        SDL_RenderDrawLines: ['int', ['void*', SDL_PointPtr, 'int']],
        SDL_RenderDrawRect: ['int', ['void*', SDL_RectPtr]],
        SDL_RenderDrawRects: ['int', ['void*', SDL_RectPtr, 'int']],
        SDL_RenderFillRect: ['int', ['void*', SDL_RectPtr]],
        SDL_RenderFillRects: ['int', ['void*', SDL_RectPtr, 'int']],
        SDL_RenderCopy: ['int', ['void*', 'void*', SDL_RectPtr, SDL_RectPtr]],
        SDL_RenderCopyEx: ['int', ['void*', 'void*', SDL_RectPtr, SDL_RectPtr, 'double', SDL_PointPtr, 'uint32']],
        SDL_RenderReadPixels: ['int', ['void*', SDL_RectPtr, 'uint32', 'void*', 'int']],
        SDL_RenderPresent: ['void', ['void*']],
        SDL_DestroyTexture: ['void', ['void*']],
        SDL_DestroyRenderer: ['void', ['void*']],
        SDL_GL_BindTexture: ['int', ['void*', 'float*', 'float*']],
        SDL_GL_UnbindTexture: ['int', ['void*']],
    });

    /* SDL_clipboard.h */

    Object.assign(functionTemplates, {
        SDL_SetClipboardText: [ 'int', [ 'char*'] ],
        SDL_GetClipboardText: [ 'char*', [ ] ],
        SDL_HasClipboardText: [ 'int', [ ] ],
    });

    /* SDL_gesture.h */

    Object.assign(functionTemplates, {
        SDL_RecordGesture: [ 'char*', [ 'int64' ] ],
        SDL_SaveAllDollarTemplates: [ 'char*', [ SDL_RWopsPtr ] ],
        SDL_SaveDollarTemplate: [ 'char*', [ 'int64', SDL_RWopsPtr ] ],
        SDL_LoadDollarTemplates: [ 'char*', [ 'int64', SDL_RWopsPtr ] ],
    });

    /* SDL_touch.h */

    const SDL_FingerPtr = ref.refType(ns.SDL_Finger);

    Object.assign(functionTemplates, {
        SDL_GetNumTouchDevices: [ 'int', [ ] ],
        SDL_GetTouchDevice: [ 'int64', [ 'int' ] ],
        SDL_GetNumTouchFingers: [ 'int', [ 'int64' ] ],
        SDL_LoadDollarTemplates: [ SDL_FingerPtr, [ 'int64', 'int' ] ],
    });

    /* SDL_hint.h */

    Object.assign(functionTemplates, {
        SDL_SetHintWithPriority: [ 'int', [ 'char*', 'char*', 'int' ] ],
        SDL_SetHint: [ 'int', [ 'char*', 'char*' ] ],
        SDL_GetHint: [ 'char*', [ 'char*' ] ],
        SDL_AddHintCallback: [ 'void', [ 'char*', ns.SDL_HintCallback, 'void*' ] ],
        SDL_DelHintCallback: [ 'void', [ 'char*', ns.SDL_HintCallback, 'void*' ] ],
        SDL_ClearHints: [ 'void', [ ] ],
    });

    /* SDL_timer.h */

    Object.assign(functionTemplates, {
        SDL_GetTicks: [ 'uint32', [ ] ],
        SDL_GetPerformanceCounter: [ 'uint64', [ ] ],
        SDL_GetPerformanceFrequency: [ 'uint64', [ ] ],
        SDL_Delay: [ 'void', [ 'uint32', 'void*' ] ],
        SDL_AddTimer: [ 'int', [ 'uint32', ns.SDL_TimerCallback, 'void*' ] ],
        SDL_RemoveTimer: [ 'int', [ 'int' ] ],
    });

    /* SDL_keyboard.h */

    Object.assign(functionTemplates, {
        SDL_GetKeyboardFocus: [ 'void*', [ ] ],
        SDL_GetKeyboardState: [ 'uint8*', [ 'int*' ] ],
        SDL_GetModState: [ 'int', [ ] ],
        SDL_SetModState: [ 'void', [ 'int' ] ],
        SDL_GetKeyFromScancode: [ 'int', [ 'int' ] ],
        SDL_GetScancodeFromKey: [ 'int', [ 'int' ] ],
        SDL_GetScancodeName: [ 'char*', [ 'int' ] ],
        SDL_GetScancodeFromName: [ 'int', [ 'char*' ] ],
        SDL_GetKeyName: [ 'char*', [ 'int' ] ],
        SDL_GetKeyFromName: [ 'int', [ 'char*' ] ],
        SDL_StartTextInput: [ 'void', [ ] ],
        SDL_IsTextInputActive: [ 'int', [ ] ],
        SDL_StopTextInput: [ 'void', [ ] ],
        SDL_SetTextInputRect: [ 'void', [ SDL_RectPtr ] ],
        SDL_HasScreenKeyboardSupport: [ 'int', [ ] ],
        SDL_IsScreenKeyboardShown: [ 'int', [ 'void*' ] ],
    });

    ns.SDL_TICKS_PASSED = (a, b) => ((b) - (a)) <= 0;

    /* SDL_quit.h */

    ns.SDL_QuitRequested = () => {
        ns.SDL_PumpEvents();
        return ns.SDL_PeepEvents(null, 0, ns.SDL_eventaction.SDL_PEEKEVENT, ns.SDL_EventType.SDL_QUIT, ns.SDL_EventType.SDL_QUIT) > 0;
    };

    /* SDL_audio.h */

    const SDL_AudioSpecPtr = ref.refType(ns.SDL_AudioSpec);
    const SDL_AudioCVTPtr = ref.refType(ns.SDL_AudioCVT);

    Object.assign(functionTemplates, {
        SDL_GetNumAudioDrivers: [ 'int', [  ] ],
        SDL_GetAudioDriver: [ 'char*', [ 'int' ] ],
        SDL_AudioInit: [ 'int', [ 'char*' ] ],
        SDL_AudioQuit: [ 'void', [  ] ],
        SDL_GetCurrentAudioDriver: [ 'char*', [  ] ],
        SDL_GetNumAudioDevices: [ 'int', [ 'int' ] ],
        SDL_GetAudioDeviceName: [ 'char*', [ 'int', 'int' ] ],
        SDL_OpenAudioDevice: [ 'uint32', [ 'char*', 'int', SDL_AudioSpecPtr, SDL_AudioSpecPtr, 'int' ] ],
        SDL_GetAudioStatus: [ 'int', [  ] ],
        SDL_GetAudioDeviceStatus: [ 'int', [ 'uint32' ] ],
        SDL_PauseAudio: [ 'void', [ 'int' ] ],
        SDL_PauseAudioDevice: [ 'void', [ 'uint32', 'int' ] ],
        SDL_FreeWAV: [ 'void', [ 'uint8*' ] ],
        SDL_BuildAudioCVT: [ 'int', [ SDL_AudioCVTPtr, 'uint16', 'uint8', 'int', 'uint16', 'uint8', 'int' ] ],
        SDL_ConvertAudio: [ 'int', [ SDL_AudioCVTPtr ] ],
        SDL_MixAudio: [ 'void', [ 'uint8*', 'uint8*', 'uint32', 'int' ] ],
        SDL_MixAudioFormat: [ 'void', [ 'uint8*', 'uint8*', 'uint16', 'uint32', 'int' ] ],
        SDL_QueueAudio: [ 'int', [ 'uint32', 'char*', 'uint32' ] ],
        SDL_GetQueuedAudioSize: [ 'uint32', [ 'uint32' ] ],
        SDL_ClearQueuedAudio: [ 'void', [ 'uint32' ] ],
        SDL_LockAudio: [ 'void', [  ] ],
        SDL_LockAudioDevice: [ 'void', [ 'uint32' ] ],
        SDL_UnlockAudio: [ 'void', [  ] ],
        SDL_UnlockAudioDevice: [ 'void', [ 'uint32' ] ],
        SDL_CloseAudio: [ 'void', [  ] ],
        SDL_CloseAudioDevice: [ 'void', [ 'uint32' ] ],
        SDL_OpenAudio: [ 'int', [ SDL_AudioSpecPtr, SDL_AudioSpecPtr ] ],
        SDL_LoadWAV_RW: [ SDL_AudioSpecPtr, [ SDL_RWopsPtr, 'int', SDL_AudioSpecPtr, 'uint8**', 'uint32*' ] ],
    });
    
    ns.SDL_LoadWAV = (file, spec, audio_buf, audio_len) => {
        return ns.SDL_LoadWAV_RW(ns.SDL_RWFromFile(file, readPermission),1, spec, audio_buf, audio_len);
    };
    
    /* SDL_shape.h */

    Object.assign(functionTemplates, {
        SDL_CreateShapedWindow: [ 'void*', [ 'char*', 'uint32', 'uint32', 'uint32', 'uint32', 'uint32' ] ],
        SDL_IsShapedWindow: [ 'int', [ 'void*' ] ],
        SDL_SetWindowShape: [ 'int', [ 'void*', SDL_SurfacePtr, 'int*' ] ],
        SDL_GetShapedWindowMode: [ 'int', [ 'void*', 'int*' ] ],
    });
    
    ns.SDL_SHAPEMODEALPHA = mode => (mode === ns.SDL_WindowShapeMode.ShapeModeDefault
        || mode === ns.SDL_WindowShapeMode.ShapeModeBinarizeAlpha
        || mode === ns.SDL_WindowShapeMode.ShapeModeReverseBinarizeAlpha);

    return Object.assign(ns, nativeCallLib.ffi.Library(path, functionFilter(functionTemplates)));
};
