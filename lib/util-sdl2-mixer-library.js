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
    const isLittleEndian = nativeCallLib.ref.endianess === 'LE';

    ns.MIX_CHANNELS = 8;
    ns.MIX_DEFAULT_FREQUENCY = 22050;
    ns.MIX_DEFAULT_FORMAT = isLittleEndian ? ns.AUDIO_S16LSB : ns.AUDIO_S16MSB;
    ns.MIX_DEFAULT_CHANNELS = 2;
    ns.MIX_MAX_VOLUME = ns.SDL_MIX_MAXVOLUME;
    ns.MIX_EFFECTSMAXSPEED = 'MIX_EFFECTSMAXSPEED';
    ns.MIX_CHANNEL_POST = -2;

    ns.MIX_InitFlags = {
        MIX_INIT_FLAC: 0x00000001,
        MIX_INIT_MOD: 0x00000002,
        MIX_INIT_MP3: 0x00000008,
        MIX_INIT_OGG: 0x00000010,
        MIX_INIT_MID: 0x00000020,
    };

    ns.Mix_Fading = {
        MIX_NO_FADING: 0,
        MIX_FADING_OUT: 1,
        MIX_FADING_IN: 2,
    };

    ns.Mix_MusicType = {
        MUS_NONE: 0,
        MUS_CMD: 1,
        MUS_WAV: 2,
        MUS_MOD: 3,
        MUS_MID: 4,
        MUS_OGG: 5,
        MUS_MP3: 6,
        MUS_MP3_MAD_UNUSED: 7,
        MUS_FLAC: 8,
        MUS_MODPLUG_UNUSED: 9,
    };

    ns.Mix_Chunk = nativeCallLib.Struct({ allocated: 'int', abuf: 'uint8*', alen: 'uint32', volume: 'uint8' });

    ns.Mix_EffectFunc_t = nativeCallLib.ffi.Function('void', [ 'int', 'void*', 'int', 'void*' ]);
    ns.Mix_EffectDone_t = nativeCallLib.ffi.Function('void', [ 'int', 'void*' ]);
    ns.Mix_HookFunc = nativeCallLib.ffi.Function('void', [ 'void*', 'uint8*', 'int' ]);
    ns.Mix_MusicFinishedFunc = nativeCallLib.ffi.Function('void', [ ]);
    ns.Mix_ChannelFinishedFunc = nativeCallLib.ffi.Function('void', [ 'int' ]);
    ns.Mix_EachSoundFontFunc = nativeCallLib.ffi.Function('int', [ 'char*', 'void*' ]);
}

exports.load = (path, functionFilter, nativeCallLib, ns) => {

    loadConstantsAndTypes(nativeCallLib, ns);

    const ref = nativeCallLib.ref;
    const SDL_versionPtr = ref.refType(ns.SDL_version);
    const SDL_RWopsPtr = ref.refType(ns.SDL_RWops);
    const Mix_ChunkPtr = ref.refType(ns.Mix_Chunk);
    const readPermission = ref.allocCString("rb");

    const functionTemplates = {
        Mix_Init: [ 'int', ['int'] ],
        Mix_Quit: [ 'void', [ ] ],
        Mix_OpenAudio: [ 'int', [ 'int', 'uint16', 'int', 'int' ] ],
        Mix_OpenAudioDevice: [ 'int', [ 'int', 'uint16', 'int', 'int', 'char*', 'int' ] ],
        Mix_AllocateChannels: [ 'int', [ 'int' ] ],
        Mix_QuerySpec: [ 'int', [ 'int*', 'uint16*', 'int*' ] ],
        Mix_LoadWAV_RW: [ 'void*', [ SDL_RWopsPtr, 'int' ] ],
        Mix_LoadMUS: [ 'void*', [ 'char*' ] ],
        Mix_LoadMUS_RW: [ 'void*', [ SDL_RWopsPtr, 'int' ] ],
        Mix_LoadMUSType_RW: [ 'void*', [ SDL_RWopsPtr, 'int', 'int' ] ],
        Mix_FreeChunk: [ 'void', [ Mix_ChunkPtr ] ],
        Mix_FreeMusic: [ 'void', [ 'void*' ] ],
        Mix_GetNumChunkDecoders: [ 'int', [ ] ],
        Mix_GetChunkDecoder: [ 'char*', [ 'int' ] ],
        Mix_HasChunkDecoder: [ 'int', [ 'char*' ] ],
        Mix_GetNumMusicDecoders: [ 'int', [ ] ],
        Mix_GetMusicDecoder: [ 'char*', [ 'int' ] ],
        Mix_GetMusicType: [ 'int', [ 'void*' ] ],
        Mix_GetMusicHookData: [ 'void*', [ ] ],
        Mix_RegisterEffect: [ 'int', [ 'int', ns.Mix_EffectFunc_t, ns.Mix_EffectDone_t, 'void*' ] ],
        Mix_UnregisterEffect: [ 'int', [ 'int', ns.Mix_EffectFunc_t ] ],
        Mix_UnregisterAllEffects: [ 'int', [ 'int' ] ],
        Mix_SetPanning: [ 'int', [ 'int', 'uint8', 'uint8' ] ],
        Mix_SetPosition: [ 'int', [ 'int', 'int16', 'uint8' ] ],
        Mix_SetDistance: [ 'int', [ 'int', 'uint8' ] ],
        Mix_SetReverseStereo: [ 'int', [ 'int', 'int' ] ],
        Mix_ReserveChannels: [ 'int', [ 'int' ] ],
        Mix_GroupChannel: [ 'int', [ 'int', 'int' ] ],
        Mix_GroupChannels: [ 'int', [ 'int', 'int', 'int' ] ],
        Mix_GroupAvailable: [ 'int', [ 'int' ] ],
        Mix_GroupCount: [ 'int', [ 'int' ] ],
        Mix_GroupOldest: [ 'int', [ 'int' ] ],
        Mix_GroupNewer: [ 'int', [ 'int' ] ],
        Mix_PlayChannelTimed: [ 'int', [ 'int', Mix_ChunkPtr, 'int', 'int' ] ],
        Mix_PlayMusic: [ 'int', [ 'void*', 'int' ] ],
        Mix_FadeInMusic: [ 'int', [ 'void*', 'int', 'int' ] ],
        Mix_FadeInMusicPos: [ 'int', [ 'void*', 'int', 'int', 'double' ] ],
        Mix_FadeInChannelTimed: [ 'int', [ 'int', Mix_ChunkPtr, 'int', 'int', 'int' ] ],
        Mix_Volume: [ 'int', [ 'int', 'int' ] ],
        Mix_VolumeChunk: [ 'int', [ Mix_ChunkPtr, 'int' ] ],
        Mix_VolumeMusic: [ 'int', [ 'int' ] ],
        Mix_HaltChannel: [ 'int', [ 'int' ] ],
        Mix_HaltGroup: [ 'int', [ 'int' ] ],
        Mix_HaltMusic: [ 'int', [ ] ],
        Mix_ExpireChannel: [ 'int', [ 'int', 'int' ] ],
        Mix_FadeOutChannel: [ 'int', [ 'int', 'int' ] ],
        Mix_FadeOutGroup: [ 'int', [ 'int', 'int' ] ],
        Mix_FadeOutMusic: [ 'int', [ 'int' ] ],
        Mix_FadingMusic: [ 'int', [ ] ],
        Mix_FadingChannel: [ 'int', [ 'int' ] ],
        Mix_Pause: [ 'void', [ 'int' ] ],
        Mix_Resume: [ 'void', [ 'int' ] ],
        Mix_Paused: [ 'int', [ 'int' ] ],
        Mix_PauseMusic: [ 'void', [ ] ],
        Mix_ResumeMusic: [ 'void', [ ] ],
        Mix_RewindMusic: [ 'void', [ ] ],
        Mix_PausedMusic: [ 'int', [ ] ],
        Mix_SetMusicPosition: [ 'int', [ 'double' ] ],
        Mix_Playing: [ 'int', [ 'int' ] ],
        Mix_PlayingMusic: [ 'int', [ ] ],
        Mix_SetMusicCMD: [ 'int', [ 'char*' ] ],
        Mix_SetSynchroValue: [ 'int', [ 'int' ] ],
        Mix_GetSynchroValue: [ 'int', [ ] ],
        Mix_SetSoundFonts: [ 'int', [ 'char*' ] ],
        Mix_GetSoundFonts: [ 'char*', [ ] ],
        Mix_CloseAudio: [ 'void', [ ] ],
        Mix_SetPostMix: [ 'void', [ ns.Mix_HookFunc, 'void*' ] ],
        Mix_HookMusic: [ 'void', [ ns.Mix_HookFunc, 'void*' ] ],
        Mix_HookMusicFinished: [ 'void', [ ns.Mix_MusicFinishedFunc ] ],
        Mix_ChannelFinished: [ 'void', [ ns.Mix_ChannelFinishedFunc ] ],
        Mix_EachSoundFont: [ 'int', [ ns.Mix_EachSoundFontFunc, 'void*' ] ],
        Mix_Linked_Version: [ SDL_versionPtr, [] ],
        Mix_QuickLoad_WAV: [ Mix_ChunkPtr, [ 'uint8*' ] ],
        Mix_QuickLoad_RAW: [ Mix_ChunkPtr, [ 'uint8*', 'uint32' ] ],
        Mix_GetChunk: [ Mix_ChunkPtr, [ 'int' ] ],
    };

    // #defines
    ns.Mix_LoadWAV = (file) => ns.Mix_LoadWAV_RW(ns.SDL_RWFromFile(file, readPermission), 1);
    ns.Mix_PlayChannel = (channel,chunk,loops) => ns.Mix_PlayChannelTimed(channel, chunk, loops, -1);
    ns.Mix_FadeInChannel = (channel,chunk,loops,ms) => ns.Mix_FadeInChannelTimed(channel, chunk, loops, ms, -1);

    return Object.assign(ns, nativeCallLib.ffi.Library(path, functionFilter(functionTemplates)));
};