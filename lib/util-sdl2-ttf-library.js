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

const common = require('./util-sdl2-common');

module.exports = function(ffi, ref, complexTypes, libFile) {
    const lib = common.createLibWithCommonTypes(ffi, ref, complexTypes);
    const functionTemplates = {};

    let SDL_versionPtr = ref.refType(lib.SDL_version);
    let SDL_SurfacePtr = ref.refType(lib.SDL_Surface);
    let SDL_RWopsPtr = ref.refType(lib.SDL_RWOps);
    let SDL_Color = lib.SDL_Color;

    lib.UNICODE_BOM_NATIVE = 0xFEFF;
    lib.UNICODE_BOM_SWAPPED = 0xFFFE;
    
    lib.TTF_STYLE_NORMAL = 0x00;
    lib.TTF_STYLE_BOLD = 0x01;
    lib.TTF_STYLE_ITALIC = 0x02;
    lib.TTF_STYLE_UNDERLINE = 0x04;
    lib.TTF_STYLE_STRIKETHROUGH = 0x08;
    
    lib.TTF_HINTING_NORMAL = 0;
    lib.TTF_HINTING_LIGHT = 1;
    lib.TTF_HINTING_MONO = 2;
    lib.TTF_HINTING_NONE = 3;

    Object.assign(functionTemplates, {
        TTF_Linked_Version:                 [ SDL_versionPtr,   [] ],
        TTF_Init:                           [ 'void',           [] ],
        TTF_Quit:                           [ 'int',            [] ],
        TTF_WasInit:                        [ 'void',           [] ],
        TTF_ByteSwappedUNICODE:             [ 'void',           [ 'int' ] ],
        TTF_OpenFont:                       [ 'void*',          [ 'char*', 'int' ] ],
        TTF_OpenFontIndex:                  [ 'void*',          [ 'char*', 'int', 'long' ] ],
        TTF_OpenFontRW:                     [ 'void*',          [ SDL_RWopsPtr, 'int', 'int' ] ],
        TTF_OpenFontIndexRW:                [ 'void*',          [ SDL_RWopsPtr, 'int', 'int', 'long' ] ],
        TTF_GetFontStyle:                   [ 'int',            [ 'void*' ] ],
        TTF_SetFontStyle:                   [ 'void',           [ 'void*', 'int' ] ],
        TTF_GetFontOutline:                 [ 'int',            [ 'void*' ] ],
        TTF_SetFontOutline:                 [ 'void',           [ 'void*', 'int' ] ],
        TTF_GetFontHinting:                 [ 'int',            [ 'void*' ] ],
        TTF_SetFontHinting:                 [ 'void',           [ 'void*', 'int' ] ],
        TTF_FontHeight:                     [ 'int',            [ 'void*' ] ],
        TTF_FontAscent:                     [ 'int',            [ 'void*' ] ],
        TTF_FontDescent:                    [ 'int',            [ 'void*' ] ],
        TTF_FontLineSkip:                   [ 'int',            [ 'void*' ] ],
        TTF_GetFontKerning:                 [ 'int',            [ 'void*' ] ],
        TTF_SetFontKerning:                 [ 'void',           [ 'void*', 'int' ] ],
        TTF_FontFaces:                      [ 'long',           [ 'void*' ] ],
        TTF_FontFaceIsFixedWidth:           [ 'int',            [ 'void*' ] ],
        TTF_FontFaceFamilyName:             [ 'char*',          [ 'void*' ] ],
        TTF_FontFaceStyleName:              [ 'char*',          [ 'void*' ] ],
        TTF_GlyphIsProvided:                [ 'int',            [ 'void*', 'uint16' ] ],
        TTF_GlyphMetrics:                   [ 'int',            [ 'void*', 'uint16', 'int*', 'int*', 'int*', 'int*', 'int*' ] ],
        TTF_SizeText:                       [ 'int',            [ 'void*', 'char*', 'int*', 'int*' ] ],
        TTF_SizeUTF8:                       [ 'int',            [ 'void*', 'char*', 'int*', 'int*' ] ],
        TTF_SizeUNICODE:                    [ 'int',            [ 'void*', 'uint16*', 'int*', 'int*' ] ],
        TTF_RenderText_Solid:               [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color ] ],
        TTF_RenderUTF8_Solid:               [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color ] ],
        TTF_RenderUNICODE_Solid:            [ SDL_SurfacePtr,   [ 'void*', 'uint16*', SDL_Color ] ],
        TTF_RenderGlyph_Solid:              [ SDL_SurfacePtr,   [ 'void*', 'uint16', SDL_Color ] ],
        TTF_RenderText_Shaded:              [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color, SDL_Color ] ],
        TTF_RenderUTF8_Shaded:              [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color, SDL_Color ] ],
        TTF_RenderUNICODE_Shaded:           [ SDL_SurfacePtr,   [ 'void*', 'uint16*', SDL_Color, SDL_Color ] ],
        TTF_RenderGlyph_Shaded:             [ SDL_SurfacePtr,   [ 'void*', 'uint16', SDL_Color, SDL_Color ] ],
        TTF_RenderText_Blended:             [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color ] ],
        TTF_RenderUTF8_Blended:             [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color ] ],
        TTF_RenderUNICODE_Blended:          [ SDL_SurfacePtr,   [ 'void*', 'uint16*', SDL_Color ] ],
        TTF_RenderText_Blended_Wrapped:     [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color, 'uint32' ] ],
        TTF_RenderUTF8_Blended_Wrapped:     [ SDL_SurfacePtr,   [ 'void*', 'char*', SDL_Color, 'uint32' ] ],
        TTF_RenderUNICODE_Blended_Wrapped:  [ SDL_SurfacePtr,   [ 'void*', 'uint16*', SDL_Color, 'uint32' ] ],
        TTF_RenderGlyph_Blended:            [ SDL_SurfacePtr,   [ 'void*', 'uint16', SDL_Color ] ],
        TTF_CloseFont:                      [ 'void',           [ 'void*' ] ],
        TTF_GetFontKerningSize:             [ 'int',            [ 'void*', 'int', 'int' ] ],
        TTF_GetFontKerningSizeGlyphs:       [ 'int',            [ 'void*', 'uint16', 'uint16' ] ],
    });

    return Object.assign(lib, ffi.Library(libFile, functionTemplates));
};