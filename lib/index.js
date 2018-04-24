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


function extendType(ref, type) {
    type.toBuffer = jsObject => ref.alloc(type, jsObject);

    return type;
}

module.exports = function(params) {
    console.assert(params.ffi, "ffi interface must be provided.");
    console.assert(params.ref, "ref interface must be provided.");

    if (!params.lib) {
        params.lib = 'SDL2';
    }

    console.assert(params.lib === 'SDL2', `Unsupported library name: '${params.lib}'. Available libraries: 'SDL2'`);

    let ref = params.ref;
    let ffi = params.ffi;
    let t = ref.types;
    let voidptr = ref.refType(t.void);
    let voidptrptr = ref.refType(voidptr);
    let charptr = ref.refType(ref.types.char);
    let charptrptr = ref.refType(charptr);
    let uint8ptr = ref.refType(t.uint8);
    let uint16ptr = ref.refType(t.uint16);
    let uint32ptr = ref.refType(t.uint32);
    let int32ptr = ref.refType(t.int32);
    let floatptr = ref.refType(t.float);
    let UnionType = require('ref-union-di')(ref);
    let Union = definition => extendType(ref, UnionType(definition));
    let StructType = require('ref-struct-di')(ref);
    let Struct = definition => extendType(ref, StructType(definition));
    let ArrayType = require('ref-array-di')(ref);
    let lib = {};
    let functionTemplates = {};
    
    /* SDL.h */
    
    lib.SDL_INIT_TIMER = 0x00000001;
    lib.SDL_INIT_AUDIO = 0x00000010;
    lib.SDL_INIT_VIDEO = 0x00000020;
    lib.SDL_INIT_JOYSTICK = 0x00000200;
    lib.SDL_INIT_HAPTIC = 0x00001000;
    lib.SDL_INIT_GAMECONTROLLER = 0x00002000;
    lib.SDL_INIT_EVENTS = 0x00004000;
    lib.SDL_INIT_NOPARACHUTE = 0x00100000;
    lib.SDL_INIT_EVERYTHING = (lib.SDL_INIT_TIMER | lib.SDL_INIT_AUDIO | lib.SDL_INIT_VIDEO |
        lib.SDL_INIT_EVENTS | lib.SDL_INIT_JOYSTICK | lib.SDL_INIT_HAPTIC | lib.SDL_INIT_GAMECONTROLLER);

    lib.SDL_FALSE = 0;
    lib.SDL_TRUE = 1;

    Object.assign(functionTemplates, {
        SDL_Init:          [ t.int32,  [ t.uint32 ] ],
        SDL_InitSubSystem: [ t.int32,  [ t.uint32 ] ],
        SDL_QuitSubSystem: [ t.void,   [ t.uint32 ] ],
        SDL_WasInit:       [ t.uint32, [ t.uint32 ] ],
        SDL_Quit:          [ t.int32,  [ ] ],
    });

    /* SDL_rect.h */

    let SDL_Point = lib.SDL_Point = Struct({ x: t.int32, y: t.int32 });
    let SDL_PointPtr = ref.refType(SDL_Point);

    let SDL_Rect = lib.SDL_Rect = Struct({ x: t.int32, y: t.int32, w: t.int32, h: t.int32 });
    let SDL_RectPtr = ref.refType(SDL_Rect);

    /* SDL_mouse.h */

    Object.assign(functionTemplates, {
        SDL_ShowCursor: [ t.int32,  [ t.int32 ] ],
    });

    /* SDL_pixels.h */

    let SDL_Color = lib.SDL_Color = Struct({ r: t.uint8, g: t.uint8, b: t.uint8, a: t.uint8 });
    let SDL_ColorPtr = ref.refType(SDL_Color);

    let SDL_Palette = lib.SDL_Palette = Struct({ ncolors: t.int32, colors: SDL_ColorPtr, version: t.uint32, refcount: t.int32 });
    let SDL_PalettePtr = ref.refType(SDL_Palette);

    let SDL_PixelFormat = lib.SDL_PixelFormat = Struct({
        format: t.uint32,
        palette: SDL_PalettePtr,
        BitsPerPixel: t.uint8,
        BytesPerPixel: t.uint8,
        padding: ArrayType(t.uint8, 56),
        Rmask: t.uint32,
        Gmask: t.uint32,
        Bmask: t.uint32,
        Amask: t.uint32,
        Rloss: t.uint8,
        Gloss: t.uint8,
        Bloss: t.uint8,
        Aloss: t.uint8,
        Rshift: t.uint8,
        Gshift: t.uint8,
        Bshift: t.uint8,
        Ashift: t.uint8,
        refcount: t.int32,
        next: voidptr
    });
    let SDL_PixelFormatPtr = ref.refType(SDL_PixelFormat);

    Object.assign(functionTemplates, {
        SDL_GetPixelFormatName:     [ charptrptr,         [ t.uint32 ] ],
        SDL_PixelFormatEnumToMasks: [ t.uint32,           [ t.uint32, int32ptr, uint32ptr, uint32ptr, uint32ptr, uint32ptr ] ],
        SDL_MasksToPixelFormatEnum: [ t.uint32,           [ t.int32, t.uint32, t.uint32, t.uint32, t.uint32 ] ],
        SDL_AllocFormat:            [ SDL_PixelFormatPtr, [ t.uint32 ] ],
        SDL_FreeFormat:             [ t.void,             [ SDL_PixelFormatPtr ] ],
        SDL_AllocPalette:           [ SDL_PalettePtr,     [ t.int32 ] ],
        SDL_SetPixelFormatPalette:  [ t.int32,            [ SDL_PixelFormatPtr, SDL_PalettePtr ] ],
        SDL_SetPaletteColors:       [ t.int32,            [ SDL_PalettePtr, SDL_ColorPtr, t.int32, t.int32 ] ],
        SDL_FreePalette:            [ t.void,             [ SDL_PalettePtr ] ],
        SDL_MapRGB:                 [ t.uint32,           [ SDL_PixelFormatPtr, t.uint8, t.uint8, t.uint8 ] ],
        SDL_MapRGBA:                [ t.uint32,           [ SDL_PixelFormatPtr, t.uint8, t.uint8, t.uint8, t.uint8 ] ],
        SDL_GetRGB:                 [ t.void,             [ t.uint32, SDL_PixelFormatPtr, uint8ptr, uint8ptr, uint8ptr ] ],
        SDL_GetRGBA:                [ t.void,             [ t.uint32, SDL_PixelFormatPtr, uint8ptr, uint8ptr, uint8ptr, uint8ptr ] ],
        SDL_CalculateGammaRamp:     [ t.void,             [ t.float, uint16ptr ] ],
    });

    /* SDL_surface.h */

    lib.SDL_SWSURFACE = 0;
    lib.SDL_PREALLOC = 0x00000001;
    lib.SDL_RLEACCEL = 0x00000002;
    lib.SDL_DONTFREE = 0x00000004;

    let SDL_Surface = lib.SDL_Surface = Struct({
        flags: t.uint32,
        format: SDL_PixelFormatPtr,
        w: 'int',
        h: 'int',
        pitch: 'int',
        pixels: voidptr,
        userdata: voidptr,
        locked: 'int',
        lock_data: voidptr,
        clip_rect: SDL_Rect,
        map: 'void*',
        refcount: 'int',
    });
    let SDL_SurfacePtr = ref.refType(SDL_Surface);

    let RWOps_Hidden = Union({
        a: Struct({ x: uint8ptr, y: uint8ptr, z: uint8ptr }),
        b: Struct({ x: voidptr, y: voidptr }),
    });

    let SDL_RWOps = lib.SDL_RWOps = Struct({
        size: voidptr,
        seek: voidptr,
        read: voidptr,
        write: voidptr,
        close: voidptr,
        type: t.uint32,
        hidden: RWOps_Hidden
    });
    let SDL_RWOpsPtr = ref.refType(SDL_RWOps);

    Object.assign(functionTemplates, {
        SDL_CreateRGBSurface:       [ SDL_SurfacePtr,   [ t.uint32, t.int32, t.int32, t.int32, t.uint32, t.uint32, t.uint32, t.uint32 ]],
        SDL_CreateRGBSurfaceFrom:   [ SDL_SurfacePtr,   [ voidptr, t.int32, t.int32, t.int32, t.int32, t.uint32, t.uint32, t.uint32, t.uint32 ]],
        SDL_FreeSurface:            [ t.void,           [ SDL_SurfacePtr ]],
        SDL_SetSurfacePalette:      [ t.int32,          [ SDL_SurfacePtr, SDL_PalettePtr ]],
        SDL_LockSurface:            [ t.int32,          [ SDL_SurfacePtr ]],
        SDL_UnlockSurface:          [ t.void,           [ SDL_SurfacePtr ]],
        SDL_LoadBMP_RW:             [ SDL_SurfacePtr,   [ SDL_RWOpsPtr, t.int32 ]],
        SDL_SaveBMP_RW:             [ t.int32,          [ SDL_SurfacePtr, SDL_RWOpsPtr, t.int32 ]],
        SDL_SetSurfaceRLE:          [ t.int32,          [ SDL_SurfacePtr, t.int32 ]],
        SDL_SetColorKey:            [ t.int32,          [ SDL_SurfacePtr, t.int32, t.uint32 ]],
        SDL_GetColorKey:            [ t.int32,          [ SDL_SurfacePtr, uint32ptr ]],
        SDL_SetSurfaceColorMod:     [ t.int32,          [ SDL_SurfacePtr, t.uint8, t.uint8, t.uint8 ]],
        SDL_GetSurfaceColorMod:     [ t.int32,          [ SDL_SurfacePtr, uint8ptr, uint8ptr, uint8ptr ]],
        SDL_SetSurfaceAlphaMod:     [ t.int32,          [ SDL_SurfacePtr, t.uint8 ]],
        SDL_GetSurfaceAlphaMod:     [ t.int32,          [ SDL_SurfacePtr, uint8ptr ]],
        SDL_SetSurfaceBlendMode:    [ t.int32,          [ SDL_SurfacePtr, t.uint32 ]],
        SDL_GetSurfaceBlendMode:    [ t.int32,          [ SDL_SurfacePtr, uint32ptr ]],
        SDL_SetClipRect:            [ t.uint32,         [ SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_GetClipRect:            [ t.void,           [ SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_ConvertSurface:         [ SDL_SurfacePtr,   [ SDL_SurfacePtr, SDL_PixelFormatPtr, t.uint32 ]],
        SDL_ConvertSurfaceFormat:   [ SDL_SurfacePtr,   [ SDL_SurfacePtr, t.uint32, t.uint32 ]],
        SDL_ConvertPixels:          [ t.int32,          [ t.int32, t.int32, t.uint32, voidptr, t.int32, t.uint32, voidptr, t.int32 ]],
        SDL_FillRect:               [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, t.uint32 ]],
        SDL_FillRects:              [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, t.int32, t.uint32 ]],
        SDL_UpperBlit:              [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_LowerBlit:              [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_SoftStretch:            [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_UpperBlitScaled:        [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_LowerBlitScaled:        [ t.int32,          [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
    });

    /* SDL_events.h */

    lib.SDL_EventType = {
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

    let SDL_KeySym = lib.SDL_KeySym = Struct({ scancode: t.uint32, sym: t.int32, mod: t.uint16, unused: t.uint32 });

    let SDL_DropEvent = lib.SDL_DropEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, file: charptrptr });
    let SDL_QuitEvent = lib.SDL_QuitEvent =
        Struct({ type: t.uint32, timestamp: t.uint32 });
    let SDL_CommonEvent = lib.SDL_CommonEvent =
        Struct({ type: t.uint32, timestamp: t.uint32 });
    let SDL_ControllerDeviceEvent = lib.SDL_ControllerDeviceEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32 });
    let SDL_JoyDeviceEvent = lib.SDL_JoyDeviceEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32 });
    let SDL_TextInputEvent = lib.SDL_TextInputEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, text: ArrayType(t.uint8, 32) });
    let SDL_TextEditingEvent = lib.SDL_TextEditingEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, text: ArrayType(t.uint8, 32), start: t.int32, length: t.int32 });
    let SDL_SysWMEvent = lib.SDL_SysWMEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, msg: voidptr });
    let SDL_WindowEvent = lib.SDL_WindowEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, event: t.uint8, p1: t.uint8, p2: t.uint8, p3: t.uint8, d1: t.int32, d2: t.int32 });
    let SDL_KeyboardEvent = lib.SDL_KeyboardEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, state: t.uint8, repeat: t.uint8, p2: t.uint8, p3: t.uint8, keysym: SDL_KeySym });
    let SDL_UserEvent = lib.SDL_UserEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, code: t.int32, d1: voidptr, d2: voidptr });
    let SDL_MouseMotionEvent = lib.SDL_MouseMotionEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, which: t.uint32, state: t.uint32, x: t.int32, y: t.int32, xrel: t.int32, yrel: t.int32 });
    let SDL_MouseButtonEvent = lib.SDL_MouseButtonEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, which: t.uint32, state: t.uint8, clicks: t.uint8, p1: t.uint8, x: t.int32, y: t.int32 });
    let SDL_MouseWheelEvent = lib.SDL_MouseWheelEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, windowID: t.uint32, which: t.uint32, x: t.int32, y: t.int32, direction: t.uint32 });
    let SDL_DollarGestureEvent = lib.SDL_DollarGestureEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, touchId: t.int64, gestureId: t.int64, numFingers: t.uint32, error: t.float, x: t.float, y: t.float });
    let SDL_MultiGestureEvent = lib.SDL_MultiGestureEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, touchId: t.int64, dTheta: t.float, dDist: t.float, x: t.float, y: t.float, numFingers: t.uint16, padding: t.uint16 });
    let SDL_TouchFingerEvent = lib.SDL_TouchFingerEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, touchId: t.int64, fingerId: t.int64, x: t.float, y: t.float, dx: t.float, dy: t.float, pressure: t.float });
    let SDL_AudioDeviceEvent = lib.SDL_AudioDeviceEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.uint32, iscapture: t.uint8, p1: t.uint8, p2: t.uint8, p3: t.uint8 });
    let SDL_ControllerButtonEvent = lib.SDL_ControllerButtonEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32, button: t.uint8, state: t.uint8, p1: t.uint8, p2: t.uint8 });
    let SDL_ControllerAxisEvent = lib.SDL_ControllerAxisEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32, button: t.uint8, p1: t.uint8, p2: t.uint8, p3: t.uint8, value: t.int16, p4: t.uint16 });
    let SDL_JoyButtonEvent = lib.SDL_JoyButtonEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32, button: t.uint8, state: t.uint8, p1: t.uint8, p2: t.uint8 });
    let SDL_JoyHatEvent = lib.SDL_JoyHatEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32, hat: t.uint8, value: t.uint8, p1: t.uint8, p2: t.uint8 });
    let SDL_JoyBallEvent = lib.SDL_JoyBallEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32, ball: t.uint8, p1: t.uint8, p2: t.uint8, p3: t.uint8, xrel: t.int16, yrel: t.int16 });
    let SDL_JoyAxisEvent = lib.SDL_JoyAxisEvent =
        Struct({ type: t.uint32, timestamp: t.uint32, which: t.int32, axis: t.uint8, p1: t.uint8, p2: t.uint8, p3: t.uint8, value: t.int16, p4: t.uint16 });

    let SDL_Event = lib.SDL_Event = Union({
        type: t.uint32,
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
        padding: ArrayType(t.uint8, 56),
    });
    let SDL_EventPtr = ref.refType(SDL_Event);

    let SDL_EventFilter = lib.SDL_EventFilter = ffi.Function(t.int32, [ voidptr, SDL_EventPtr ]);
    let SDL_EventFilterPtr = ref.refType(SDL_EventFilter);

    Object.assign(functionTemplates, {
        SDL_PollEvent:          [t.int32,   [ SDL_EventPtr ]],
        SDL_PumpEvents:         [t.void,    [ ]],
        SDL_PeepEvents:         [t.int32,   [ SDL_EventPtr, t.int32, t.uint32, t.uint32, t.uint32 ]],
        SDL_HasEvent:           [t.uint32,  [ t.uint32 ]],
        SDL_HasEvents:          [t.uint32,  [ t.uint32, t.uint32 ]],
        SDL_FlushEvent:         [t.void,    [ t.uint32 ]],
        SDL_FlushEvents:        [t.void,    [ t.uint32, t.uint32 ]],
        SDL_WaitEvent:          [t.int32,   [ SDL_EventPtr ]],
        SDL_WaitEventTimeout:   [t.int32,   [ SDL_EventPtr, t.int32 ] ],
        SDL_EventState:         [t.uint8,   [ t.uint32, t.int32 ]],
        SDL_RegisterEvents:     [t.uint32,  [ t.int32 ]],
        SDL_AddEventWatch:      [t.void,    [ SDL_EventFilterPtr, voidptr ]],
        SDL_FilterEvents:       [t.void,    [ SDL_EventFilterPtr, voidptr ]],
        SDL_SetEventFilter:     [t.void,    [ SDL_EventFilterPtr, voidptr ]],
        SDL_GetEventFilter:     [t.uint32,  [ voidptr, voidptrptr ]],
        SDL_DelEventWatch:      [t.void,    [ SDL_EventFilterPtr, voidptr ]],
        SDL_PushEvent:          [t.int32,   [ SDL_EventPtr ]],
    });

    /* SDL_video.h */

    lib.SDL_WINDOWPOS_UNDEFINED = 0x1FFF0000;
    lib.SDL_WINDOWPOS_CENTERED = 0x2FFF0000;

    lib.SDL_WindowFlags = {
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

    lib.SDL_WindowEventID = {
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

    lib.SDL_GLattr = {
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

    lib.SDL_GLprofile = {
        SDL_GL_CONTEXT_PROFILE_CORE: 1,
        SDL_GL_CONTEXT_PROFILE_COMPATIBILITY: 2,
        SDL_GL_CONTEXT_PROFILE_ES: 4,
    };

    lib.SDL_GLcontextFlag = {
        SDL_GL_CONTEXT_DEBUG_FLAG: 1,
        SDL_GL_CONTEXT_FORWARD_COMPATIBLE_FLAG: 2,
        SDL_GL_CONTEXT_ROBUST_ACCESS_FLAG: 4,
        SDL_GL_CONTEXT_RESET_ISOLATION_FLAG: 8,
    };

    lib.SDL_GLcontextReleaseFlag = {
        SDL_GL_CONTEXT_RELEASE_BEHAVIOR_NONE: 0,
        SDL_GL_CONTEXT_RELEASE_BEHAVIOR_FLUSH: 1,
    };

    lib.SDL_HitTestResult = {
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

    let SDL_DisplayMode = lib.SDL_DisplayMode =
        Struct({ format: t.uint32, w: t.int32, h: t.int32, refresh_rate: t.int32, driverdata: voidptr });
    let SDL_DisplayModePtr = ref.refType(SDL_DisplayMode);

    let SDL_HitTest = lib.SDL_HitTest = ffi.Function(t.uint32, [ voidptr, SDL_PointPtr, voidptr ]);
    let SDL_HitTestPtr = ref.refType(SDL_HitTest);

    Object.assign(functionTemplates, {
        SDL_GetNumVideoDrivers:         [ t.int32 ,             [  ]],
        SDL_GetVideoDriver:             [ charptr,              [ t.int32 ]],
        SDL_VideoInit:                  [ t.int32,              [ charptr ]],
        SDL_VideoQuit:                  [ t.void,               [  ]],
        SDL_GetCurrentVideoDriver:      [ charptr,              [  ]],
        SDL_GetNumVideoDisplays:        [ t.int32,              [  ]],
        SDL_GetDisplayName:             [ charptr,              [ t.int32 ]],
        SDL_GetDisplayBounds:           [ t.int32,              [ t.int32, SDL_RectPtr ]],
        SDL_GetDisplayDPI:              [ t.int32,              [ t.int32, floatptr, floatptr, floatptr ]],
        SDL_GetNumDisplayModes:         [ t.int32,              [ t.int32 ]],
        SDL_GetDisplayMode:             [ t.int32,              [ t.int32, t.int32, SDL_DisplayModePtr ]],
        SDL_GetDesktopDisplayMode:      [ t.int32,              [ t.int32, SDL_DisplayModePtr ]],
        SDL_GetCurrentDisplayMode:      [ t.int32,              [ t.int32, SDL_DisplayModePtr ]],
        SDL_GetClosestDisplayMode:      [ SDL_DisplayModePtr,   [ t.int32, SDL_DisplayModePtr, SDL_DisplayModePtr ]],
        SDL_GetWindowDisplayIndex:      [ t.int32,              [ voidptr ]],
        SDL_SetWindowDisplayMode:       [ t.int32,              [ voidptr, SDL_DisplayModePtr ]],
        SDL_GetWindowDisplayMode:       [ t.int32,              [ voidptr, SDL_DisplayModePtr ]],
        SDL_GetWindowPixelFormat:       [ t.uint32,             [ voidptr ]],
        SDL_CreateWindow:               [ voidptr,              [ charptr, t.int32, t.int32, t.int32, t.int32, t.uint32 ]],
        SDL_CreateWindowFrom:           [ voidptr,              [ voidptr ]],
        SDL_GetWindowID:                [ t.uint32,             [ voidptr ]],
        SDL_GetWindowFromID:            [ voidptr,              [ t.uint32 ]],
        SDL_GetWindowFlags:             [ t.uint32,             [ voidptr ]],
        SDL_SetWindowTitle:             [ t.void,               [ voidptr, charptr ]],
        SDL_GetWindowTitle:             [ charptr,              [ voidptr ]],
        SDL_SetWindowIcon:              [ t.void,               [ voidptr, SDL_SurfacePtr ]],
        SDL_SetWindowData:              [ voidptr,              [ voidptr, charptr, voidptr ]],
        SDL_GetWindowData:              [ voidptr,              [ voidptr, charptr ]],
        SDL_SetWindowPosition:          [ t.void,               [ voidptr, t.int32, t.int32 ]],
        SDL_GetWindowPosition:          [ t.void,               [ voidptr, int32ptr, int32ptr ]],
        SDL_SetWindowSize:              [ t.void,               [ voidptr, t.int32, t.int32 ]],
        SDL_GetWindowSize:              [ t.void,               [ voidptr, int32ptr, int32ptr ]],
        SDL_SetWindowMinimumSize:       [ t.void,               [ voidptr, t.int32, t.int32 ]],
        SDL_GetWindowMinimumSize:       [ t.void,               [ voidptr, int32ptr, int32ptr ]],
        SDL_SetWindowMaximumSize:       [ t.void,               [ voidptr, t.int32, t.int32 ]],
        SDL_GetWindowMaximumSize:       [ t.void,               [ voidptr, int32ptr, int32ptr ]],
        SDL_SetWindowBordered:          [ t.void,               [ voidptr, t.uint32 ]],
        SDL_ShowWindow:                 [ t.void,               [ voidptr ]],
        SDL_HideWindow:                 [ t.void,               [ voidptr ]],
        SDL_RaiseWindow:                [ t.void,               [ voidptr ]],
        SDL_MaximizeWindow:             [ t.void,               [ voidptr ]],
        SDL_MinimizeWindow:             [ t.void,               [ voidptr ]],
        SDL_RestoreWindow:              [ t.void,               [ voidptr ]],
        SDL_SetWindowFullscreen:        [ t.int32,              [ voidptr, t.uint32 ]],
        SDL_GetWindowSurface:           [ SDL_SurfacePtr,       [ voidptr ]],
        SDL_UpdateWindowSurface:        [ t.int32,              [ voidptr ]],
        SDL_UpdateWindowSurfaceRects:   [ t.int32,              [ voidptr, SDL_RectPtr, t.int32 ]],
        SDL_SetWindowGrab:              [ t.void,               [ voidptr, t.uint32 ]],
        SDL_GetWindowGrab:              [ t.uint32,             [ voidptr ]],
        SDL_GetGrabbedWindow:           [ voidptr,              [  ]],
        SDL_SetWindowBrightness:        [ t.int32,              [ voidptr, t.float]],
        SDL_GetWindowBrightness:        [ t.float,              [ voidptr ]],
        SDL_SetWindowGammaRamp:         [ t.int32,              [ voidptr, uint16ptr, uint16ptr, uint16ptr ]],
        SDL_GetWindowGammaRamp:         [ t.int32,              [ voidptr, uint16ptr, uint16ptr, uint16ptr ]],
        SDL_SetWindowHitTest:           [ t.int32,              [ voidptr, SDL_HitTestPtr, voidptr ]],
        SDL_DestroyWindow:              [ t.void,               [ voidptr ]],
        SDL_IsScreenSaverEnabled:       [ t.uint32,             [  ]],
        SDL_EnableScreenSaver:          [ t.void,               [  ]],
        SDL_DisableScreenSaver:         [ t.void,               [  ]],
        SDL_GL_LoadLibrary:             [ t.int32,              [ charptr ]],
        SDL_GL_GetProcAddress:          [ voidptr,              [ charptr ]],
        SDL_GL_UnloadLibrary:           [ t.void,               [  ]],
        SDL_GL_ExtensionSupported:      [ t.uint32,             [ charptr ]],
        SDL_GL_ResetAttributes:         [ t.void,               [  ]],
        SDL_GL_SetAttribute:            [ t.int32,              [ t.uint32, t.int32 ]],
        SDL_GL_GetAttribute:            [ t.int32,              [ t.uint32, int32ptr ]],
        SDL_GL_CreateContext:           [ voidptr,              [ voidptr ]],
        SDL_GL_MakeCurrent:             [ t.int32,              [ voidptr, voidptr ]],
        SDL_GL_GetCurrentWindow:        [ voidptr,              [  ]],
        SDL_GL_GetCurrentContext:       [ voidptr,              [  ]],
        SDL_GL_GetDrawableSize:         [ t.void,               [ voidptr, int32ptr, int32ptr ]],
        SDL_GL_SetSwapInterval:         [ t.int32,              [ t.int32 ]],
        SDL_GL_GetSwapInterval:         [ t.int32,              [  ]],
        SDL_GL_SwapWindow:              [ t.void,               [ voidptr ]],
        SDL_GL_DeleteContext:           [ t.void,               [ voidptr ]],
    });

    /* SDL_blendmode.h */

    lib.SDL_BlendMode = {
        SDL_BLENDMODE_NONE: 0,
        SDL_BLENDMODE_BLEND: 1,
        SDL_BLENDMODE_ADD: 2,
        SDL_BLENDMODE_MOD: 4,
    };

    /* SDL_joystick.h */

    lib.SDL_HAT_CENTERED = 0x00;
    lib.SDL_HAT_UP = 0x01;
    lib.SDL_HAT_RIGHT = 0x02;
    lib.SDL_HAT_DOWN = 0x04;
    lib.SDL_HAT_LEFT = 0x08;
    lib.SDL_HAT_RIGHTUP = (lib.SDL_HAT_RIGHT | lib.SDL_HAT_UP);
    lib.SDL_HAT_RIGHTDOWN = (lib.SDL_HAT_RIGHT | lib.SDL_HAT_DOWN);
    lib.SDL_HAT_LEFTUP = (lib.SDL_HAT_LEFT | lib.SDL_HAT_UP);
    lib.SDL_HAT_LEFTDOWN = (lib.SDL_HAT_LEFT | lib.SDL_HAT_DOWN);
    
    lib.SDL_JoystickPowerLevel = {
        SDL_JOYSTICK_POWER_UNKNOWN: -1,
        SDL_JOYSTICK_POWER_EMPTY: 0,
        SDL_JOYSTICK_POWER_LOW: 1,
        SDL_JOYSTICK_POWER_MEDIUM: 2,
        SDL_JOYSTICK_POWER_FULL: 3,
        SDL_JOYSTICK_POWER_WIRED: 4,
        SDL_JOYSTICK_POWER_MAX: 5
    };

    let SDL_JoystickGUID = lib.SDL_JoystickGUID = Struct({ data: ArrayType(t.uint8, 16)});

    Object.assign(functionTemplates, {
        SDL_NumJoysticks:               [ t.int32,          [ ] ],
        SDL_JoystickNameForIndex:       [ charptr,          [ t.int32 ] ],
        SDL_JoystickOpen:               [ voidptr,          [ t.int32 ] ],
        SDL_JoystickFromInstanceID:     [ voidptr,          [ t.int32 ] ],
        SDL_JoystickName:               [ charptr,          [ voidptr ] ],
        SDL_JoystickGetDeviceGUID:      [ SDL_JoystickGUID, [ t.int32 ] ],
        SDL_JoystickGetGUID:            [ SDL_JoystickGUID, [ voidptr ] ],
        SDL_JoystickGetGUIDString:      [ t.void,           [ SDL_JoystickGUID, charptr, t.int32 ] ],
        SDL_JoystickGetGUIDFromString:  [ SDL_JoystickGUID, [ charptr ] ],
        SDL_JoystickGetAttached:        [ t.int32,          [ voidptr ] ],
        SDL_JoystickInstanceID:         [ t.int32,          [ voidptr ] ],
        SDL_JoystickNumAxes:            [ t.int32,          [ voidptr ] ],
        SDL_JoystickNumBalls:           [ t.int32,          [ voidptr ] ],
        SDL_JoystickNumHats:            [ t.int32,          [ voidptr ] ],
        SDL_JoystickNumButtons:         [ t.int32,          [ voidptr ] ],
        SDL_JoystickUpdate:             [ t.void,           [ ] ],
        SDL_JoystickEventState:         [ t.int32,          [ t.int32 ] ],
        SDL_JoystickGetAxis:            [ t.int16,          [ voidptr, t.int32 ] ],
        SDL_JoystickGetHat:             [ t.uint8,          [ voidptr, t.int32 ] ],
        SDL_JoystickGetBall:            [ t.int32,          [ voidptr, t.int32, int32ptr, int32ptr ] ],
        SDL_JoystickGetButton:          [ t.uint8,          [ voidptr, t.int32 ] ],
        SDL_JoystickClose:              [ t.void,           [ voidptr ] ],
        SDL_JoystickCurrentPowerLevel:  [ t.int32,          [ voidptr ] ],
    });
    
    /* SDL_haptic.h */

    lib.SDL_HAPTIC_CONSTANT     = (1<<0);
    lib.SDL_HAPTIC_SINE         = (1<<1);
    lib.SDL_HAPTIC_LEFTRIGHT    = (1<<2);
    lib.SDL_HAPTIC_TRIANGLE     = (1<<3);
    lib.SDL_HAPTIC_SAWTOOTHUP   = (1<<4);
    lib.SDL_HAPTIC_SAWTOOTHDOWN = (1<<5);
    lib.SDL_HAPTIC_RAMP         = (1<<6);
    lib.SDL_HAPTIC_SPRING       = (1<<7);
    lib.SDL_HAPTIC_DAMPER       = (1<<8);
    lib.SDL_HAPTIC_INERTIA      = (1<<9);
    lib.SDL_HAPTIC_FRICTION     = (1<<10);
    lib.SDL_HAPTIC_CUSTOM       = (1<<11);
    lib.SDL_HAPTIC_GAIN         = (1<<12);
    lib.SDL_HAPTIC_AUTOCENTER   = (1<<13);
    lib.SDL_HAPTIC_STATUS       = (1<<14);
    lib.SDL_HAPTIC_PAUSE        = (1<<15);
    lib.SDL_HAPTIC_POLAR        = 0;
    lib.SDL_HAPTIC_CARTESIAN    = 1;
    lib.SDL_HAPTIC_SPHERICAL    = 2;
    lib.SDL_HAPTIC_INFINITY     = 4294967295;

    let SDL_HapticDirection = lib.SDL_HapticDirection = Struct({ type: t.uint8, dir: ArrayType(t.int32, 3)});

    let SDL_HapticConstant = lib.SDL_HapticConstant = Struct({
        type: t.uint16,
        direction: SDL_HapticDirection,
        length: t.uint32,
        delay: t.uint16,
        button: t.uint16,
        interval: t.uint16,
        level: t.int16,
        attack_length: t.uint16,
        attack_level: t.uint16,
        fade_length: t.uint16,
        fade_level: t.uint16,
    });
    
    let SDL_HapticPeriodic = lib.SDL_HapticPeriodic = Struct({
        type: t.uint16,
        direction: SDL_HapticDirection,
        length: t.uint32,
        delay: t.uint16,
        button: t.uint16,
        interval: t.uint16,
        period: t.uint16,
        magnitude: t.int16,
        offset: t.int16,
        phase: t.uint16,
        attack_length: t.uint16,
        attack_level: t.uint16,
        fade_length: t.uint16,
        fade_level: t.uint16,
    });

    let SDL_HapticCondition = lib.SDL_HapticCondition = Struct({
        type: t.uint16,
        direction: SDL_HapticDirection,
        length: t.uint32,
        delay: t.uint16,
        button: t.uint16,
        interval: t.uint16,
        right_sat: ArrayType(t.uint16, 3),
        left_sat: ArrayType(t.uint16, 3),
        right_coeff: ArrayType(t.int16, 3),
        left_coeff: ArrayType(t.int16, 3),
        deadband: ArrayType(t.uint16, 3),
        center: ArrayType(t.int16, 3),
    });

    let SDL_HapticRamp = lib.SDL_HapticRamp = Struct({
        type: t.uint16,
        direction: SDL_HapticDirection,
        length: t.uint32,
        delay: t.uint16,
        button: t.uint16,
        interval: t.uint16,
        start: t.int16,
        end: t.int16,
        attack_length: t.uint16,
        attack_level: t.uint16,
        fade_length: t.uint16,
        fade_level: t.uint16,
    });

    let SDL_HapticLeftRight = lib.SDL_HapticLeftRight = Struct({
        type: t.uint16,
        length: t.uint32,
        large_magnitude: t.uint16,
        small_magnitude: t.uint16,
    });

    let SDL_HapticCustom = lib.SDL_HapticCustom = Struct({
        type: t.uint16,
        direction: SDL_HapticDirection,
        length: t.uint32,
        delay: t.uint16,
        button: t.uint16,
        interval: t.uint16,
        channels: t.uint8,
        period: t.uint16,
        samples: t.uint16,
        data: uint16ptr,
        attack_length: t.uint16,
        attack_level: t.uint16,
        fade_length: t.uint16,
        fade_level: t.uint16,
    });

    let SDL_HapticEffect = lib.SDL_HapticEffect = Union({
        type: t.uint32,
        constant: SDL_HapticConstant,
        periodic: SDL_HapticPeriodic,
        condition: SDL_HapticCondition,
        ramp: SDL_HapticRamp,
        leftright: SDL_HapticLeftRight,
        custom: SDL_HapticCustom,
    });
    let SDL_HapticEffectPtr = ref.refType(SDL_HapticEffect);

    Object.assign(functionTemplates, {
        SDL_NumHaptics:                 [ t.int32,  [ ] ],
        SDL_HapticName:                 [ charptr,  [ t.int32 ] ],
        SDL_HapticOpen:                 [ voidptr,  [ t.int32 ] ],
        SDL_HapticOpened:               [ t.int32,  [ t.int32 ] ],
        SDL_HapticIndex:                [ t.int32,  [ voidptr ] ],
        SDL_MouseIsHaptic:              [ t.int32,  [ ] ],
        SDL_HapticOpenFromMouse:        [ voidptr,  [ ] ],
        SDL_JoystickIsHaptic:           [ t.int32,  [ voidptr ] ],
        SDL_HapticOpenFromJoystick:     [ voidptr,  [ voidptr ] ],
        SDL_HapticClose:                [ t.void,   [ voidptr ] ],
        SDL_HapticNumEffects:           [ t.int32,  [ voidptr ] ],
        SDL_HapticNumEffectsPlaying:    [ t.int32,  [ voidptr ] ],
        SDL_HapticQuery:                [ t.uint32, [ voidptr] ],
        SDL_HapticNumAxes:              [ t.int32,  [ voidptr ] ],
        SDL_HapticEffectSupported:      [ t.int32,  [ voidptr, SDL_HapticEffectPtr ] ],
        SDL_HapticNewEffect:            [ t.int32,  [ voidptr, SDL_HapticEffectPtr ] ],
        SDL_HapticUpdateEffect:         [ t.int32,  [ voidptr, t.int32, SDL_HapticEffectPtr ] ],
        SDL_HapticRunEffect:            [ t.int32,  [ voidptr, t.int32, t.uint32 ] ],
        SDL_HapticStopEffect:           [ t.int32,  [ voidptr, t.int32 ] ],
        SDL_HapticDestroyEffect:        [ t.void,   [ voidptr, t.int32 ] ],
        SDL_HapticGetEffectStatus:      [ t.int32,  [ voidptr, t.int32 ] ],
        SDL_HapticSetGain:              [ t.int32,  [ voidptr, t.int32 ] ],
        SDL_HapticSetAutocenter:        [ t.int32,  [ voidptr, t.int32 ] ],
        SDL_HapticPause:                [ t.int32,  [ voidptr ] ],
        SDL_HapticUnpause:              [ t.int32,  [ voidptr ] ],
        SDL_HapticStopAll:              [ t.int32,  [ voidptr ] ],
        SDL_HapticRumbleSupported:      [ t.int32,  [ voidptr ] ],
        SDL_HapticRumbleInit:           [ t.int32,  [ voidptr ] ],
        SDL_HapticRumblePlay:           [ t.int32,  [ voidptr, t.float, t.uint32  ] ],
        SDL_HapticRumbleStop:           [ t.int32,  [ voidptr ] ],
    });
    
    /* SDL_render.h */

    lib.SDL_RendererFlags = {
        SDL_RENDERER_SOFTWARE: 1,
        SDL_RENDERER_ACCELERATED: 2,
        SDL_RENDERER_PRESENTVSYNC: 4,
        SDL_RENDERER_TARGETTEXTURE: 8,
    };

    lib.SDL_TextureAccess = {
        SDL_TEXTUREACCESS_STATIC: 0,
        SDL_TEXTUREACCESS_STREAMING: 1,
        SDL_TEXTUREACCESS_TARGET: 2,
    };

    lib.SDL_TextureModulate = {
        SDL_TEXTUREMODULATE_NONE: 0,
        SDL_TEXTUREMODULATE_COLOR: 1,
        SDL_TEXTUREMODULATE_ALPHA: 2,
    };

    lib.SDL_RendererFlip = {
        SDL_FLIP_NONE: 0,
        SDL_FLIP_HORIZONTAL: 1,
        SDL_FLIP_VERTICAL: 2,
    };

    let SDL_RendererInfo = lib.SDL_RendererInfo = Struct({
        name: charptr,
        flags: t.uint32,
        num_texture_formats: t.uint32,
        texture_formats: ArrayType(t.uint32, 16),
        max_texture_width: t.int32,
        max_texture_height: t.int32,
    });
    let SDL_RendererInfoPtr = ref.refType(SDL_RendererInfo);

    Object.assign(functionTemplates, {
        SDL_GetNumRenderDrivers: [t.int32, []],
        SDL_GetRenderDriverInfo: [t.int32, [t.int32, SDL_RendererInfoPtr]],
        SDL_CreateWindowAndRenderer: [t.int32, [t.int32, t.int32, t.uint32, voidptrptr, voidptrptr]],
        SDL_CreateRenderer: [voidptr, [voidptr, t.int32, t.uint32]],
        SDL_CreateSoftwareRenderer: [voidptr, [voidptr]],
        SDL_GetRenderer: [voidptr, [voidptr]],
        SDL_GetRendererInfo: [t.int32, [voidptr, SDL_RendererInfoPtr]],
        SDL_GetRendererOutputSize: [t.int32, [voidptr, int32ptr, int32ptr]],
        SDL_CreateTextureFromSurface: [voidptr, [voidptr, voidptr]],
        SDL_QueryTexture: [t.int32, [voidptr, uint32ptr, int32ptr, int32ptr, int32ptr]],
        SDL_SetTextureColorMod: [t.int32, [voidptr, t.uint8, t.uint8, t.uint8]],
        SDL_GetTextureColorMod: [t.int32, [voidptr, uint8ptr, uint8ptr, uint8ptr]],
        SDL_SetTextureAlphaMod: [t.int32, [voidptr, t.uint8]],
        SDL_GetTextureAlphaMod: [t.int32, [voidptr, uint8ptr]],
        SDL_SetTextureBlendMode: [t.int32, [voidptr, t.uint32]],
        SDL_GetTextureBlendMode: [t.int32, [voidptr, uint32ptr]],
        SDL_UpdateTexture: [t.int32, [voidptr, SDL_RectPtr, voidptr, t.int32]],
        SDL_UpdateYUVTexture: [t.int32, [voidptr, SDL_RectPtr, uint8ptr, t.int32, uint8ptr, t.int32, uint8ptr, t.int32]],
        SDL_LockTexture: [t.int32, [voidptr, SDL_RectPtr, voidptrptr, int32ptr]],
        SDL_UnlockTexture: [t.void, [voidptr]],
        SDL_RenderTargetSupported: [t.uint32, [voidptr]],
        SDL_SetRenderTarget: [t.int32, [voidptr, voidptr]],
        SDL_GetRenderTarget: [voidptr, [voidptr]],
        SDL_RenderSetLogicalSize: [t.int32, [voidptr, t.int32, t.int32]],
        SDL_RenderGetLogicalSize: [t.void, [voidptr, int32ptr, int32ptr]],
        SDL_RenderSetViewport: [t.int32, [voidptr, SDL_RectPtr]],
        SDL_RenderGetViewport: [t.void, [voidptr, SDL_RectPtr]],
        SDL_RenderSetClipRect: [t.int32, [voidptr, SDL_RectPtr]],
        SDL_RenderGetClipRect: [t.void, [voidptr, SDL_RectPtr]],
        SDL_RenderIsClipEnabled: [t.uint32, [voidptr]],
        SDL_RenderSetScale: [t.int32, [voidptr, t.float, t.float]],
        SDL_RenderGetScale: [t.void, [voidptr, floatptr, floatptr]],
        SDL_SetRenderDrawColor: [t.int32, [voidptr, t.uint8, t.uint8, t.uint8, t.uint8]],
        SDL_GetRenderDrawColor: [t.int32, [voidptr, uint8ptr, uint8ptr, uint8ptr, uint8ptr]],
        SDL_SetRenderDrawBlendMode: [t.int32, [voidptr, t.uint32]],
        SDL_GetRenderDrawBlendMode: [t.int32, [voidptr, uint32ptr]],
        SDL_RenderClear: [t.int32, [voidptr]],
        SDL_RenderDrawPoint: [t.int32, [voidptr, t.int32, t.int32]],
        SDL_RenderDrawPoints: [t.int32, [voidptr, SDL_PointPtr, t.int32]],
        SDL_RenderDrawLine: [t.int32, [voidptr, t.int32, t.int32, t.int32, t.int32]],
        SDL_RenderDrawLines: [t.int32, [voidptr, SDL_PointPtr, t.int32]],
        SDL_RenderDrawRect: [t.int32, [voidptr, SDL_RectPtr]],
        SDL_RenderDrawRects: [t.int32, [voidptr, SDL_RectPtr, t.int32]],
        SDL_RenderFillRect: [t.int32, [voidptr, SDL_RectPtr]],
        SDL_RenderFillRects: [t.int32, [voidptr, SDL_RectPtr, t.int32]],
        SDL_RenderCopy: [t.int32, [voidptr, voidptr, SDL_RectPtr, SDL_RectPtr]],
        SDL_RenderCopyEx: [t.int32, [voidptr, voidptr, SDL_RectPtr, SDL_RectPtr, t.double, SDL_PointPtr, t.uint32]],
        SDL_RenderReadPixels: [t.int32, [voidptr, SDL_RectPtr, t.uint32, voidptr, t.int32]],
        SDL_RenderPresent: [t.void, [voidptr]],
        SDL_DestroyTexture: [t.void, [voidptr]],
        SDL_DestroyRenderer: [t.void, [voidptr]],
        SDL_GL_BindTexture: [t.int32, [voidptr, floatptr, floatptr]],
        SDL_GL_UnbindTexture: [t.int32, [voidptr]],
    });

    /* SDL_gamecontroller.h */

    lib.SDL_GameControllerBindType = {
        SDL_CONTROLLER_BINDTYPE_NONE: 0,
        SDL_CONTROLLER_BINDTYPE_BUTTON: 1,
        SDL_CONTROLLER_BINDTYPE_AXIS: 2,
        SDL_CONTROLLER_BINDTYPE_HAT: 3,
    };

    lib.SDL_GameControllerAxis = {
        SDL_CONTROLLER_AXIS_INVALID: -1,
        SDL_CONTROLLER_AXIS_LEFTX: 0,
        SDL_CONTROLLER_AXIS_LEFTY: 1,
        SDL_CONTROLLER_AXIS_RIGHTX: 2,
        SDL_CONTROLLER_AXIS_RIGHTY: 3,
        SDL_CONTROLLER_AXIS_TRIGGERLEFT: 4,
        SDL_CONTROLLER_AXIS_TRIGGERRIGHT: 5,
        SDL_CONTROLLER_AXIS_MAX: 6,
    };

    lib.SDL_GameControllerButton = {
        SDL_CONTROLLER_BUTTON_INVALID: -1,
        SDL_CONTROLLER_BUTTON_A: 0,
        SDL_CONTROLLER_BUTTON_B: 1,
        SDL_CONTROLLER_BUTTON_X: 2,
        SDL_CONTROLLER_BUTTON_Y: 3,
        SDL_CONTROLLER_BUTTON_BACK: 4,
        SDL_CONTROLLER_BUTTON_GUIDE: 5,
        SDL_CONTROLLER_BUTTON_START: 6,
        SDL_CONTROLLER_BUTTON_LEFTSTICK: 7,
        SDL_CONTROLLER_BUTTON_RIGHTSTICK: 8,
        SDL_CONTROLLER_BUTTON_LEFTSHOULDER: 9,
        SDL_CONTROLLER_BUTTON_RIGHTSHOULDER: 10,
        SDL_CONTROLLER_BUTTON_DPAD_UP: 11,
        SDL_CONTROLLER_BUTTON_DPAD_DOWN: 12,
        SDL_CONTROLLER_BUTTON_DPAD_LEFT: 13,
        SDL_CONTROLLER_BUTTON_DPAD_RIGHT: 14,
        SDL_CONTROLLER_BUTTON_MAX: 15,
    };

    let SDL_GameControllerButtonBind = Struct({
        bindType: t.int32,
        value: Union({
            button: t.int32,
            axis: t.int32,
            hat: Struct({
                hat: t.int32,
                hat_mask: t.int32
            })
        }),
    });

    Object.assign(functionTemplates, {
        SDL_GameControllerAddMappingsFromRW:    [ t.int32, [  SDL_RWOpsPtr, t.int32 ] ],
        SDL_GameControllerAddMapping:           [ t.int32, [  charptr ] ],
        SDL_GameControllerMappingForGUID:       [ charptr, [ SDL_JoystickGUID ] ],
        SDL_GameControllerMapping:              [ charptr, [  voidptr ] ],
        SDL_IsGameController:                   [ t.int32, [ t.int32 ] ],
        SDL_GameControllerNameForIndex:         [ charptr, [ t.int32 ] ],
        SDL_GameControllerOpen:                 [ voidptr, [ t.int32 ] ],
        SDL_GameControllerFromInstanceID:       [ voidptr, [ t.int32 ] ],
        SDL_GameControllerName:                 [ charptr, [ voidptr] ],
        SDL_GameControllerGetAttached:          [ t.int32, [ voidptr] ],
        SDL_GameControllerGetJoystick:          [ voidptr, [ voidptr] ],
        SDL_GameControllerEventState:           [ t.int32, [ t.int32 ] ],
        SDL_GameControllerUpdate:               [ t.void,  [ ] ],
        SDL_GameControllerGetAxisFromString:    [ t.int32, [ charptr ] ],
        SDL_GameControllerGetStringForAxis:     [ charptr, [ t.int32 ] ],
        SDL_GameControllerGetBindForAxis:       [ SDL_GameControllerButtonBind, [ voidptr, t.int32 ] ],
        SDL_GameControllerGetAxis:              [ t.int16, [ voidptr, t.int32] ],
        SDL_GameControllerGetButtonFromString:  [ t.int32, [ charptr ] ],
        SDL_GameControllerGetStringForButton:   [ charptr, [ t.int32 ] ],
        SDL_GameControllerGetBindForButton:     [ SDL_GameControllerButtonBind, [ voidptr, t.int32 ] ],
        SDL_GameControllerGetButton:            [ t.uint8, [ voidptr, t.int32 ] ],
        SDL_GameControllerClose:                [ t.void,  [ voidptr] ],
    });
    
    let libFile;

    if (process.platform === 'win32') {
        libFile = `${params.lib}.dll`;
    } else if (process.platform === 'darwin') {
        libFile = `lib${params.lib}.dylib`;
    } else {
        libFile = `lib${params.lib}.so`;
    }

    let functions = ffi.Library(libFile, functionTemplates);
    
    return Object.assign(lib, functions);
};
