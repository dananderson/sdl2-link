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

function loadConstantsAndTypes(nativeCallLib, ns) {
    ns.IMG_InitFlags = {
        IMG_INIT_JPG: 0x00000001,
        IMG_INIT_PNG: 0x00000002,
        IMG_INIT_TIF: 0x00000004,
        IMG_INIT_WEBP: 0x00000008,
    };
}

exports.load = (path, nativeCallLib, ns) => {
    const ref = nativeCallLib.ref;
    const SDL_versionPtr = ref.refType(ns.SDL_version);
    const SDL_SurfacePtr = ref.refType(ns.SDL_Surface);
    const SDL_RWopsPtr = ref.refType(ns.SDL_RWops);

    loadConstantsAndTypes(nativeCallLib, ns);

    const functionTemplates = {
        IMG_Linked_Version:         [ SDL_versionPtr, [ ] ],
        IMG_Init:                   [ 'int',          [ 'int' ] ],
        IMG_Quit:                   [ 'void',         [ ] ],
        IMG_LoadTexture:            [ 'void*',        [ 'void*', 'char*' ] ],
        IMG_LoadTexture_RW:         [ 'void*',        [ 'void*', SDL_RWopsPtr, 'int' ] ],
        IMG_LoadTextureTyped_RW:    [ 'void*',        [ 'void*', SDL_RWopsPtr, 'int', 'char*' ] ],
        IMG_isICO:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isCUR:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isBMP:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isGIF:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isJPG:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isLBM:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isPCX:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isPNG:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isPNM:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isTIF:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isXCF:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isXPM:                  [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isXV:                   [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_isWEBP:                 [ 'int',          [ SDL_RWopsPtr ] ],
        IMG_SavePNG:                [ 'int',          [ SDL_SurfacePtr, 'char*' ] ],
        IMG_SavePNG_RW:             [ 'int',          [ SDL_SurfacePtr, SDL_RWopsPtr, 'int' ] ],
        IMG_Load:                   [ SDL_SurfacePtr, [ 'char*' ] ],
        IMG_LoadTyped_RW:           [ SDL_SurfacePtr, [ SDL_RWopsPtr, 'int', 'char*' ] ],
        IMG_Load_RW:                [ SDL_SurfacePtr, [ SDL_RWopsPtr, 'int' ] ],
        IMG_LoadICO_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadCUR_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadBMP_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadGIF_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadJPG_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadLBM_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadPCX_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadPNG_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadPNM_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadTGA_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadTIF_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadXCF_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadXPM_RW:             [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadXV_RW:              [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_LoadWEBP_RW:            [ SDL_SurfacePtr, [ SDL_RWopsPtr ] ],
        IMG_ReadXPMFromArray:       [ SDL_SurfacePtr, [ 'char**' ] ],
    };

    Object.assign(ns, nativeCallLib.ffi.Library(path, functionTemplates));

    return nativeCallLib.patchFunctions(ns, functionTemplates);
};