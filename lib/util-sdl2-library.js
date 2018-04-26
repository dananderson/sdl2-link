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

exports.loadConstantsAndTypes = (ffi, lib) => {
    const ref = ffi.ref;
    
    lib.SDL_version = ffi.Struct({
        major: 'uint8',
        minor: 'uint8',
        patch: 'uint8',
    });

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
    
    lib.SDL_Point = ffi.Struct({ x: 'int', y: 'int' });

    const SDL_PointPtr = ref.refType(lib.SDL_Point);

    const SDL_Rect = lib.SDL_Rect = ffi.Struct({ x: 'int', y: 'int', w: 'int', h: 'int' });

    lib.SDL_RWOps = ffi.Struct({
        size: ffi.ffi.Function('int64', [ 'void*' ]),
        seek: ffi.ffi.Function('int64', [ 'void*', 'int64' ]),
        read: ffi.ffi.Function('size_t', [ 'void*', 'void*', 'size_t', 'size_t' ]),
        write: ffi.ffi.Function('size_t', [ 'void*', 'void*', 'size_t', 'size_t' ]),
        close: ffi.ffi.Function('int', [ 'void*' ]),
        type: 'uint32',
        hidden: ffi.Union({
            a: ffi.Struct({ x: 'uint8*', y: 'uint8*', z: 'uint8*' }),
            b: ffi.Struct({ x: 'void*', y: 'void*' }),
        }),
    });

    const SDL_Color = lib.SDL_Color = ffi.Struct({ r: 'uint8', g: 'uint8', b: 'uint8', a: 'uint8' });
    const SDL_ColorPtr = ref.refType(SDL_Color);

    const SDL_Palette = lib.SDL_Palette = ffi.Struct({ ncolors: 'int', colors: SDL_ColorPtr, version: 'uint32', refcount: 'int' });
    const SDL_PalettePtr = ref.refType(SDL_Palette);

    lib.SDL_PixelFormat = ffi.Struct({
        format: 'uint32',
        palette: SDL_PalettePtr,
        BitsPerPixel: 'uint8',
        BytesPerPixel: 'uint8',
        padding: ffi.Array('uint8', 56),
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
    const SDL_PixelFormatPtr = ref.refType(lib.SDL_PixelFormat);

    lib.SDL_SWSURFACE = 0;
    lib.SDL_PREALLOC = 0x00000001;
    lib.SDL_RLEACCEL = 0x00000002;
    lib.SDL_DONTFREE = 0x00000004;

    lib.SDL_Surface = ffi.Struct({
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

    const SDL_KeySym = lib.SDL_KeySym = ffi.Struct({ scancode: 'uint32', sym: 'int', mod: 'uint16', unused: 'uint32' });

    const SDL_DropEvent = lib.SDL_DropEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', file: 'char**' });
    const SDL_QuitEvent = lib.SDL_QuitEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32' });
    const SDL_CommonEvent = lib.SDL_CommonEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32' });
    const SDL_ControllerDeviceEvent = lib.SDL_ControllerDeviceEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int' });
    const SDL_JoyDeviceEvent = lib.SDL_JoyDeviceEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int' });
    const SDL_TextInputEvent = lib.SDL_TextInputEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', text: ffi.Array('uint8', 32) });
    const SDL_TextEditingEvent = lib.SDL_TextEditingEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', text: ffi.Array('uint8', 32), start: 'int', length: 'int' });
    const SDL_SysWMEvent = lib.SDL_SysWMEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', msg: 'void*' });
    const SDL_WindowEvent = lib.SDL_WindowEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', event: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', d1: 'int', d2: 'int' });
    const SDL_KeyboardEvent = lib.SDL_KeyboardEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', state: 'uint8', repeat: 'uint8', p2: 'uint8', p3: 'uint8', keysym: SDL_KeySym });
    const SDL_UserEvent = lib.SDL_UserEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', code: 'int', d1: 'void*', d2: 'void*' });
    const SDL_MouseMotionEvent = lib.SDL_MouseMotionEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', which: 'uint32', state: 'uint32', x: 'int', y: 'int', xrel: 'int', yrel: 'int' });
    const SDL_MouseButtonEvent = lib.SDL_MouseButtonEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', which: 'uint32', state: 'uint8', clicks: 'uint8', p1: 'uint8', x: 'int', y: 'int' });
    const SDL_MouseWheelEvent = lib.SDL_MouseWheelEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', windowID: 'uint32', which: 'uint32', x: 'int', y: 'int', direction: 'uint32' });
    const SDL_DollarGestureEvent = lib.SDL_DollarGestureEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', touchId: 'int64', gestureId: 'int64', numFingers: 'uint32', error: 'float', x: 'float', y: 'float' });
    const SDL_MultiGestureEvent = lib.SDL_MultiGestureEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', touchId: 'int64', dTheta: 'float', dDist: 'float', x: 'float', y: 'float', numFingers: 'uint16', padding: 'uint16' });
    const SDL_TouchFingerEvent = lib.SDL_TouchFingerEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', touchId: 'int64', fingerId: 'int64', x: 'float', y: 'float', dx: 'float', dy: 'float', pressure: 'float' });
    const SDL_AudioDeviceEvent = lib.SDL_AudioDeviceEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'uint32', iscapture: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8' });
    const SDL_ControllerButtonEvent = lib.SDL_ControllerButtonEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', button: 'uint8', state: 'uint8', p1: 'uint8', p2: 'uint8' });
    const SDL_ControllerAxisEvent = lib.SDL_ControllerAxisEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', button: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', value: 'int16', p4: 'uint16' });
    const SDL_JoyButtonEvent = lib.SDL_JoyButtonEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', button: 'uint8', state: 'uint8', p1: 'uint8', p2: 'uint8' });
    const SDL_JoyHatEvent = lib.SDL_JoyHatEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', hat: 'uint8', value: 'uint8', p1: 'uint8', p2: 'uint8' });
    const SDL_JoyBallEvent = lib.SDL_JoyBallEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', ball: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', xrel: 'int16', yrel: 'int16' });
    const SDL_JoyAxisEvent = lib.SDL_JoyAxisEvent =
        ffi.Struct({ type: 'uint32', timestamp: 'uint32', which: 'int', axis: 'uint8', p1: 'uint8', p2: 'uint8', p3: 'uint8', value: 'int16', p4: 'uint16' });

    const SDL_Event = lib.SDL_Event = ffi.Union({
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
        padding: ffi.Array('uint8', 56),
    });

    const SDL_EventPtr = ref.refType(SDL_Event);

    lib.SDL_EventFilter = ffi.ffi.Function('int', [ 'void*', SDL_EventPtr ]);

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

    lib.SDL_DisplayMode = ffi.Struct({ format: 'uint32', w: 'int', h: 'int', refresh_rate: 'int', driverdata: 'void*' });

    lib.SDL_HitTest = ffi.ffi.Function('uint32', [ 'void*', SDL_PointPtr, 'void*' ]);

    lib.SDL_BlendMode = {
        SDL_BLENDMODE_NONE: 0,
        SDL_BLENDMODE_BLEND: 1,
        SDL_BLENDMODE_ADD: 2,
        SDL_BLENDMODE_MOD: 4,
    };

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

    lib.SDL_JoystickGUID = ffi.Struct({ data: ffi.Array('uint8', 16)});

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

    lib.SDL_HapticDirection = ffi.Struct({ type: 'uint8', dir: ffi.Array('int', 3)});

    lib.SDL_HapticConstant = ffi.Struct({
        type: 'uint16',
        direction: lib.SDL_HapticDirection,
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

    lib.SDL_HapticPeriodic = ffi.Struct({
        type: 'uint16',
        direction: lib.SDL_HapticDirection,
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

    lib.SDL_HapticCondition = ffi.Struct({
        type: 'uint16',
        direction: lib.SDL_HapticDirection,
        length: 'uint32',
        delay: 'uint16',
        button: 'uint16',
        interval: 'uint16',
        right_sat: ffi.Array('uint16', 3),
        left_sat: ffi.Array('uint16', 3),
        right_coeff: ffi.Array('int16', 3),
        left_coeff: ffi.Array('int16', 3),
        deadband: ffi.Array('uint16', 3),
        center: ffi.Array('int16', 3),
    });

    lib.SDL_HapticRamp = ffi.Struct({
        type: 'uint16',
        direction: lib.SDL_HapticDirection,
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

    lib.SDL_HapticLeftRight = ffi.Struct({
        type: 'uint16',
        length: 'uint32',
        large_magnitude: 'uint16',
        small_magnitude: 'uint16',
    });

    lib.SDL_HapticCustom = ffi.Struct({
        type: 'uint16',
        direction: lib.SDL_HapticDirection,
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

    lib.SDL_HapticEffect = ffi.Union({
        type: 'uint32',
        constant: lib.SDL_HapticConstant,
        periodic: lib.SDL_HapticPeriodic,
        condition: lib.SDL_HapticCondition,
        ramp: lib.SDL_HapticRamp,
        leftright: lib.SDL_HapticLeftRight,
        custom: lib.SDL_HapticCustom,
    });

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

    lib.SDL_RendererInfo = ffi.Struct({
        name: 'char*',
        flags: 'uint32',
        num_texture_formats: 'uint32',
        texture_formats: ffi.Array('uint32', 16),
        max_texture_width: 'int',
        max_texture_height: 'int',
    });

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

    lib.SDL_GameControllerButtonBind = ffi.Struct({
        bindType: 'int',
        value: ffi.Union({
            button: 'int',
            axis: 'int',
            hat: ffi.Struct({
                hat: 'int',
                hat_mask: 'int'
            })
        }),
    });

    return lib;
};

exports.loadFunctions = (ffi, lib) => {
    const ref = ffi.ref;
    const functionTemplates = {};
    
    /* SDL.h */

    Object.assign(functionTemplates, {
        SDL_Init:          [ 'int',    [ 'uint32' ] ],
        SDL_InitSubSystem: [ 'int',    [ 'uint32' ] ],
        SDL_QuitSubSystem: [ 'void',   [ 'uint32' ] ],
        SDL_WasInit:       [ 'uint32', [ 'uint32' ] ],
        SDL_Quit:          [ 'int',    [ ] ],
    });

    /* SDL_version.h */

    const SDL_version = lib.SDL_version;
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

    /* SDL_rect.h */

    const SDL_Point = lib.SDL_Point;
    const SDL_PointPtr = ref.refType(SDL_Point);
    const SDL_Rect = lib.SDL_Rect;
    const SDL_RectPtr = ref.refType(SDL_Rect);

    /* SDL_mouse.h */

    Object.assign(functionTemplates, {
        SDL_ShowCursor: [ 'int',  [ 'int' ] ],
    });

    /* SDL_pixels.h */

    const SDL_Color = lib.SDL_Color;
    const SDL_ColorPtr = ref.refType(SDL_Color);
    const SDL_Palette = lib.SDL_Palette;
    const SDL_PalettePtr = ref.refType(SDL_Palette);
    const SDL_PixelFormat = lib.SDL_PixelFormat;
    const SDL_PixelFormatPtr = ref.refType(SDL_PixelFormat);

    Object.assign(functionTemplates, {
        SDL_GetPixelFormatName:     [ 'char**',           [ 'uint32' ] ],
        SDL_PixelFormatEnumToMasks: [ 'uint32',           [ 'uint32', 'int*', 'uint32*', 'uint32*', 'uint32*', 'uint32*' ] ],
        SDL_MasksToPixelFormatEnum: [ 'uint32',           [ 'int', 'uint32', 'uint32', 'uint32', 'uint32' ] ],
        SDL_AllocFormat:            [ SDL_PixelFormatPtr, [ 'uint32' ] ],
        SDL_FreeFormat:             [ 'void',             [ SDL_PixelFormatPtr ] ],
        SDL_AllocPalette:           [ SDL_PalettePtr,     [ 'int' ] ],
        SDL_SetPixelFormatPalette:  [ 'int',              [ SDL_PixelFormatPtr, SDL_PalettePtr ] ],
        SDL_SetPaletteColors:       [ 'int',              [ SDL_PalettePtr, SDL_ColorPtr, 'int', 'int' ] ],
        SDL_FreePalette:            [ 'void',             [ SDL_PalettePtr ] ],
        SDL_MapRGB:                 [ 'uint32',           [ SDL_PixelFormatPtr, 'uint8', 'uint8', 'uint8' ] ],
        SDL_MapRGBA:                [ 'uint32',           [ SDL_PixelFormatPtr, 'uint8', 'uint8', 'uint8', 'uint8' ] ],
        SDL_GetRGB:                 [ 'void',             [ 'uint32', SDL_PixelFormatPtr, 'uint8*', 'uint8*', 'uint8*' ] ],
        SDL_GetRGBA:                [ 'void',             [ 'uint32', SDL_PixelFormatPtr, 'uint8*', 'uint8*', 'uint8*', 'uint8*' ] ],
        SDL_CalculateGammaRamp:     [ 'void',             [ 'float', 'uint16*' ] ],
    });

    /* SDL_surface.h */

    const SDL_Surface = lib.SDL_Surface;
    const SDL_SurfacePtr = ref.refType(SDL_Surface);
    const SDL_RWOps = lib.SDL_RWOps;
    const SDL_RWOpsPtr = ref.refType(SDL_RWOps);

    Object.assign(functionTemplates, {
        SDL_CreateRGBSurface:       [ SDL_SurfacePtr,   [ 'uint32', 'int', 'int', 'int', 'uint32', 'uint32', 'uint32', 'uint32' ]],
        SDL_CreateRGBSurfaceFrom:   [ SDL_SurfacePtr,   [ 'void*', 'int', 'int', 'int', 'int', 'uint32', 'uint32', 'uint32', 'uint32' ]],
        SDL_FreeSurface:            [ 'void',           [ SDL_SurfacePtr ]],
        SDL_SetSurfacePalette:      [ 'int',            [ SDL_SurfacePtr, SDL_PalettePtr ]],
        SDL_LockSurface:            [ 'int',            [ SDL_SurfacePtr ]],
        SDL_UnlockSurface:          [ 'void',           [ SDL_SurfacePtr ]],
        SDL_LoadBMP_RW:             [ SDL_SurfacePtr,   [ SDL_RWOpsPtr, 'int' ]],
        SDL_SaveBMP_RW:             [ 'int',            [ SDL_SurfacePtr, SDL_RWOpsPtr, 'int' ]],
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
        SDL_ConvertSurface:         [ SDL_SurfacePtr,   [ SDL_SurfacePtr, SDL_PixelFormatPtr, 'uint32' ]],
        SDL_ConvertSurfaceFormat:   [ SDL_SurfacePtr,   [ SDL_SurfacePtr, 'uint32', 'uint32' ]],
        SDL_ConvertPixels:          [ 'int',            [ 'int', 'int', 'uint32', 'void*', 'int', 'uint32', 'void*', 'int' ]],
        SDL_FillRect:               [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, 'uint32' ]],
        SDL_FillRects:              [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, 'int', 'uint32' ]],
        SDL_UpperBlit:              [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_LowerBlit:              [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_SoftStretch:            [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_UpperBlitScaled:        [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
        SDL_LowerBlitScaled:        [ 'int',            [ SDL_SurfacePtr, SDL_RectPtr, SDL_SurfacePtr, SDL_RectPtr ]],
    });

    /* SDL_events.h */

    const SDL_EventPtr = ref.refType(lib.SDL_Event);
    const SDL_EventFilter = lib.SDL_EventFilter;
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

    const SDL_DisplayMode = lib.SDL_DisplayMode;
    const SDL_DisplayModePtr = ref.refType(SDL_DisplayMode);
    const SDL_HitTest = lib.SDL_HitTest;

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
        SDL_GetClosestDisplayMode:      [ SDL_DisplayModePtr,   [ 'int', SDL_DisplayModePtr, SDL_DisplayModePtr ]],
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
        SDL_GetWindowSurface:           [ SDL_SurfacePtr,       [ 'void*' ]],
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
    });

    /* SDL_joystick.h */

    const SDL_JoystickGUID = lib.SDL_JoystickGUID;

    Object.assign(functionTemplates, {
        SDL_NumJoysticks:               [ 'int',            [ ] ],
        SDL_JoystickNameForIndex:       [ 'char*',          [ 'int' ] ],
        SDL_JoystickOpen:               [ 'void*',          [ 'int' ] ],
        SDL_JoystickFromInstanceID:     [ 'void*',          [ 'int' ] ],
        SDL_JoystickName:               [ 'char*',          [ 'void*' ] ],
        SDL_JoystickGetDeviceGUID:      [ SDL_JoystickGUID, [ 'int' ] ],
        SDL_JoystickGetGUID:            [ SDL_JoystickGUID, [ 'void*' ] ],
        SDL_JoystickGetGUIDString:      [ 'void',           [ SDL_JoystickGUID, 'char*', 'int' ] ],
        SDL_JoystickGetGUIDFromString:  [ SDL_JoystickGUID, [ 'char*' ] ],
        SDL_JoystickGetAttached:        [ 'int',            [ 'void*' ] ],
        SDL_JoystickInstanceID:         [ 'int',            [ 'void*' ] ],
        SDL_JoystickNumAxes:            [ 'int',            [ 'void*' ] ],
        SDL_JoystickNumBalls:           [ 'int',            [ 'void*' ] ],
        SDL_JoystickNumHats:            [ 'int',            [ 'void*' ] ],
        SDL_JoystickNumButtons:         [ 'int',            [ 'void*' ] ],
        SDL_JoystickUpdate:             [ 'void',           [ ] ],
        SDL_JoystickEventState:         [ 'int',            [ 'int' ] ],
        SDL_JoystickGetAxis:            [ 'int16',          [ 'void*', 'int' ] ],
        SDL_JoystickGetHat:             [ 'uint8',          [ 'void*', 'int' ] ],
        SDL_JoystickGetBall:            [ 'int',            [ 'void*', 'int', 'int*', 'int*' ] ],
        SDL_JoystickGetButton:          [ 'uint8',          [ 'void*', 'int' ] ],
        SDL_JoystickClose:              [ 'void',           [ 'void*' ] ],
        SDL_JoystickCurrentPowerLevel:  [ 'int',            [ 'void*' ] ],
    });
    
    /* SDL_haptic.h */

    const SDL_HapticEffectPtr = ref.refType(lib.SDL_HapticEffect);

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

    const SDL_RendererInfoPtr = ref.refType(lib.SDL_RendererInfo);

    Object.assign(functionTemplates, {
        SDL_GetNumRenderDrivers: ['int', []],
        SDL_GetRenderDriverInfo: ['int', ['int', SDL_RendererInfoPtr]],
        SDL_CreateWindowAndRenderer: ['int', ['int', 'int', 'uint32', 'void**', 'void**']],
        SDL_CreateRenderer: ['void*', ['void*', 'int', 'uint32']],
        SDL_CreateSoftwareRenderer: ['void*', ['void*']],
        SDL_GetRenderer: ['void*', ['void*']],
        SDL_GetRendererInfo: ['int', ['void*', SDL_RendererInfoPtr]],
        SDL_GetRendererOutputSize: ['int', ['void*', 'int*', 'int*']],
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

    /* SDL_gamecontroller.h */

    const SDL_GameControllerButtonBind = lib.SDL_GameControllerButtonBind;

    Object.assign(functionTemplates, {
        SDL_GameControllerAddMappingsFromRW:    [ 'int',    [ SDL_RWOpsPtr, 'int' ] ],
        SDL_GameControllerAddMapping:           [ 'int',    [ 'char*' ] ],
        SDL_GameControllerMappingForGUID:       [ 'char*',  [ SDL_JoystickGUID ] ],
        SDL_GameControllerMapping:              [ 'char*',  [ 'void*' ] ],
        SDL_IsGameController:                   [ 'int',    [ 'int' ] ],
        SDL_GameControllerNameForIndex:         [ 'char*',  [ 'int' ] ],
        SDL_GameControllerOpen:                 [ 'void*',  [ 'int' ] ],
        SDL_GameControllerFromInstanceID:       [ 'void*',  [ 'int' ] ],
        SDL_GameControllerName:                 [ 'char*',  [ 'void*'] ],
        SDL_GameControllerGetAttached:          [ 'int',    [ 'void*'] ],
        SDL_GameControllerGetJoystick:          [ 'void*',  [ 'void*'] ],
        SDL_GameControllerEventState:           [ 'int',    [ 'int' ] ],
        SDL_GameControllerUpdate:               [ 'void',   [ ] ],
        SDL_GameControllerGetAxisFromString:    [ 'int',    [ 'char*' ] ],
        SDL_GameControllerGetStringForAxis:     [ 'char*',  [ 'int' ] ],
        SDL_GameControllerGetBindForAxis:       [ SDL_GameControllerButtonBind, [ 'void*', 'int' ] ],
        SDL_GameControllerGetAxis:              [ 'int16',  [ 'void*', 'int'] ],
        SDL_GameControllerGetButtonFromString:  [ 'int',    [ 'char*' ] ],
        SDL_GameControllerGetStringForButton:   [ 'char*',  [ 'int' ] ],
        SDL_GameControllerGetBindForButton:     [ SDL_GameControllerButtonBind, [ 'void*', 'int' ] ],
        SDL_GameControllerGetButton:            [ 'uint8',  [ 'void*', 'int' ] ],
        SDL_GameControllerClose:                [ 'void',   [ 'void*'] ],
    });

    let libFile;

    if (process.platform === 'win32') {
        libFile = `SDL2.dll`;
    } else if (process.platform === 'darwin') {
        libFile = `libSDL2.dylib`;
    } else {
        libFile = `libSDL2.so`;
    }
    
    return Object.assign(lib, ffi.ffi.Library(libFile, functionTemplates));
};
