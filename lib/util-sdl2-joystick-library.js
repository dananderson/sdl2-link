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

function loadConstantsAndTypes(nativeCallLib, ns) {
    const types = nativeCallLib;

    ns.SDL_HAT_CENTERED = 0x00;
    ns.SDL_HAT_UP = 0x01;
    ns.SDL_HAT_RIGHT = 0x02;
    ns.SDL_HAT_DOWN = 0x04;
    ns.SDL_HAT_LEFT = 0x08;
    ns.SDL_HAT_RIGHTUP = (ns.SDL_HAT_RIGHT | ns.SDL_HAT_UP);
    ns.SDL_HAT_RIGHTDOWN = (ns.SDL_HAT_RIGHT | ns.SDL_HAT_DOWN);
    ns.SDL_HAT_LEFTUP = (ns.SDL_HAT_LEFT | ns.SDL_HAT_UP);
    ns.SDL_HAT_LEFTDOWN = (ns.SDL_HAT_LEFT | ns.SDL_HAT_DOWN);

    ns.SDL_JoystickPowerLevel = {
        SDL_JOYSTICK_POWER_UNKNOWN: -1,
        SDL_JOYSTICK_POWER_EMPTY: 0,
        SDL_JOYSTICK_POWER_LOW: 1,
        SDL_JOYSTICK_POWER_MEDIUM: 2,
        SDL_JOYSTICK_POWER_FULL: 3,
        SDL_JOYSTICK_POWER_WIRED: 4,
        SDL_JOYSTICK_POWER_MAX: 5
    };

    ns.SDL_JoystickGUID = types.Struct({ data: types.Array('uint8', 16)});

    ns.SDL_GameControllerBindType = {
        SDL_CONTROLLER_BINDTYPE_NONE: 0,
        SDL_CONTROLLER_BINDTYPE_BUTTON: 1,
        SDL_CONTROLLER_BINDTYPE_AXIS: 2,
        SDL_CONTROLLER_BINDTYPE_HAT: 3,
    };

    ns.SDL_GameControllerAxis = {
        SDL_CONTROLLER_AXIS_INVALID: -1,
        SDL_CONTROLLER_AXIS_LEFTX: 0,
        SDL_CONTROLLER_AXIS_LEFTY: 1,
        SDL_CONTROLLER_AXIS_RIGHTX: 2,
        SDL_CONTROLLER_AXIS_RIGHTY: 3,
        SDL_CONTROLLER_AXIS_TRIGGERLEFT: 4,
        SDL_CONTROLLER_AXIS_TRIGGERRIGHT: 5,
        SDL_CONTROLLER_AXIS_MAX: 6,
    };

    ns.SDL_GameControllerButton = {
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

    ns.SDL_GameControllerButtonBind = types.Struct({
        bindType: 'int',
        value: types.Union({
            button: 'int',
            axis: 'int',
            hat: types.Struct({
                hat: 'int',
                hat_mask: 'int'
            })
        }),
    });
}

exports.load = (path, functionFilter, nativeCallLib, ns) => {
    const functionTemplates = {};
    const ref = nativeCallLib.ref;
    const readPermission = ref.allocCString("rb");

    loadConstantsAndTypes(nativeCallLib, ns);

    /* SDL_joystick.h */

    const SDL_JoystickGUID = ns.SDL_JoystickGUID;

    Object.assign(functionTemplates, {
        SDL_NumJoysticks:               [ 'int',            [ ] ],
        SDL_JoystickNameForIndex:       [ 'char*',          [ 'int' ] ],
        SDL_JoystickOpen:               [ 'void*',          [ 'int' ] ],
        SDL_JoystickFromInstanceID:     [ 'void*',          [ 'int' ] ],
        SDL_JoystickName:               [ 'char*',          [ 'void*' ] ],
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
        SDL_JoystickGetDeviceGUID:      [ SDL_JoystickGUID, [ 'int' ] ],
        SDL_JoystickGetGUID:            [ SDL_JoystickGUID, [ 'void*' ] ],
        SDL_JoystickGetGUIDString:      [ 'void',           [ SDL_JoystickGUID, 'char*', 'int' ] ],
        SDL_JoystickGetGUIDFromString:  [ SDL_JoystickGUID, [ 'char*' ] ],
    });

    /* SDL_gamecontroller.h */

    const SDL_GameControllerButtonBind = ns.SDL_GameControllerButtonBind;
    const SDL_RWopsPtr = ref.refType(ns.SDL_RWops);

    Object.assign(functionTemplates, {
        SDL_GameControllerAddMappingsFromRW:    [ 'int',    [ SDL_RWopsPtr, 'int' ] ],
        SDL_GameControllerAddMapping:           [ 'int',    [ 'char*' ] ],
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
        SDL_GameControllerGetAxis:              [ 'int16',  [ 'void*', 'int'] ],
        SDL_GameControllerGetButtonFromString:  [ 'int',    [ 'char*' ] ],
        SDL_GameControllerGetStringForButton:   [ 'char*',  [ 'int' ] ],
        SDL_GameControllerGetButton:            [ 'uint8',  [ 'void*', 'int' ] ],
        SDL_GameControllerClose:                [ 'void',   [ 'void*'] ],
        SDL_GameControllerGetBindForAxis:       [ SDL_GameControllerButtonBind, [ 'void*', 'int' ] ],
        SDL_GameControllerGetBindForButton:     [ SDL_GameControllerButtonBind, [ 'void*', 'int' ] ],
        SDL_GameControllerMappingForGUID:       [ 'char*',  [ SDL_JoystickGUID ] ],
    });

    ns.SDL_GameControllerAddMappingsFromFile = (filename) => {
        return ns.SDL_GameControllerAddMappingsFromRW(ns.SDL_RWFromFile(filename, readPermission), 1);
    };

    return Object.assign(ns, nativeCallLib.ffi.Library(path, functionFilter(functionTemplates)));
};