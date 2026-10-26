---
title: Pixel Perfect Text in Unity
date: 2025-02-14
summary: In this article we will take a look at the solution of the pixel perfect font problem in Unity as I implemented it for my currently developed game SODHARA.
tags: [code, game dev, tutorial]
---

In this article we will take a look at the solution of the pixel perfect font problem in Unity as I implemented it for my currently developed game [SODHARA](https://nikolapacekvetnic.rs/?page_id=1799). Unity, given that it is a modern tool geared towards high res output, is not particularly friendly to the retro-inspired style of the yesteryear – the script presented in this article is one of the ways in which this hurdle can be overcome.

## 1 Overview

In [SODHARA](https://sodhara.com/) I use `TextMeshPro` text components for everything text related. I use pixel perfect bitmap fonts in which all the glyphs’ sizes should be integer values, and the resolution is low enough so that each “pixel” (or, rather, a constituent square) of each glyph should correspond to a single pixel on screen.

The truth is however that these fonts are not perfect, and the problem is mostly with padding. This means that for the left (or right) aligned text the first glyph will probably be set properly but then the next one will note be an integer value pixels away, which will accumulate after a while and present rather unpleasant artifacts. Much bigger problem lies in centered text, since usually not even the first glyph is properly set in such a case.

This can be somewhat circumvented by carefully placing the text objects on screen so that, even though their position lies between pixels, the text itself is rendered properly. This only works if the resolution of the game is 1:1, i.e. if one pixel of the graphics corresponds to one pixel on screen. However, this approach yields diminishing results as one introduces features such as localization, template strings, and any process which tampers with the strings in runtime, thus making it impossible to place the objects properly in advance.

To get my point across, please consider images 1-4, whereas the odd ones are taken from the editor and the even ones are in-game screenshots.

![](screenshot01a_subpixels.png)

_Image 1. Centered text (font [Uni 05\_x by Craig Kroeger](https://www.dafont.com/uni-05-x.font)) in Editor._

![](screenshot02a_subpixels.png "Image 2. Centered text (font Uni 05_x) in game.")

![](screenshot01b_subpixels.png)

_Image 3. Centered text (font [5MikroPix by Winter Design Studios)](https://www.dafont.com/5mikropix.font) in Editor._

![](screenshot02b_subpixels.png)

_Image 4. Centered text (font [5MikroPix)](https://www.dafont.com/5mikropix.font) in game._

Whenever a glyph pixel founds itself in a sub-pixel position it will be “rounded” to the closest integer value, which, in case of being around the center of the pixel, means it will appear in two places at once, yielding “chunky” and irregular glyphs (both in case of letters and spaces) all over the text. What’s worse, in case of dynamic text, the glyphs will change width and shape based on their (changing) position, which I find truly horrendous.

The solutions I found online usually boil down to either moving the entire text object to such a sub-pixel position that will “trick” the rounding process and make the text snap into place, or using custom scripts that snap the text to grid. As I stated previously, the first solution is problematic when one has to deal with varying text, i.e. when localization is involved, and it is near impossible to achieve with centered text. The second solution seemed more plausible, but none of the users that mentioned it shared the scripts they use. Thus, I decided to write my own.

## 2 Pixel Perfect Text Enforcer

Retro-styled games usually use a small number fonts – [SODHARA](https://sodhara.com/) in particular uses three, so the first step was to describe all the fonts used in order to have relevant info on each of them in one place. The class I used is shown in listing 1.

```csharp
public class CharSpacingInfo
{
    public bool IsFontMonospaced => _fixedCharWidth > 0;
    public int SuggestedWidthFor(float width) =>
        IsFontMonospaced ? _fixedCharWidth : (int)(width / _pixelSize);

    public int _pixelSize;
    public int _fontSize;
    public int _fixedCharWidth;
    public int _interCharSpaceWidth;
    public int _whitespaceWidth;

    public CharSpacingInfo(
        int pixelSize, int fontSize, int fixedCharWidth,
        int interCharSpaceWidth, int whitespaceWidth)
    {
        _pixelSize = pixelSize;
        _fontSize = fontSize;
        _fixedCharWidth = fixedCharWidth;
        _interCharSpaceWidth = interCharSpaceWidth;
        _whitespaceWidth = whitespaceWidth;
    }
}
```

Listing 1. The `CharSpacingInfo` class keeps tracks of the various font measurements.

The fields of the `CharSpacingInfo` class represent the following font qualities:

- `pixelSize`: size of the “font pixel”, or the “constituent square” as I dubbed it previously,
- `fontSize`: size of the font as set in the `TextMeshPro` script within the inspector,
- `fixedCharWidth`: width of the glyphs in monospaced fonts (set to `-1` in case the font is not monospaced),
- `interCharSpaceWidth`: width of the space between individual glyphs, and finally
- `whitespaceWidth`: width of the whitespace, or spacebar character.

The data given for each of the three fonts are used to force the glyphs to snap to pixel grid by means of wrapping the chars and spaces with `<mspace={size}px>...</mspace>` tags, and also followed up by `<space={size}px>` tag when a non-whitespace character is followed by another non-whitespace char. The `size` are taken from the `CharSpacingInfo` instances, namely the `_fixedCharWidth` and  `_interCharSpaceWidth` fields.

The actual wrapping is done by the methods shown in listing 2.

```csharp
    public static string CharWithTags(char c, int size) =>
        $"<mspace={size}px>{c}</mspace>";

    public static string WrapStringInTags
        (TMP_FontAsset fontAsset, string text)
    {
        if (string.IsNullOrEmpty(text))
            return text;

        var wrappedText = "";

        for (var i = 0; i < text.Length; i++)
            wrappedText += WrapCharInTags(
                fontAsset,
                text[i],
                i < text.Length - 1 ? text[i + 1] : null);

        return wrappedText;
    }

    private static string WrapCharInTags
        (TMP_FontAsset fontAsset, char curr, char? next)
    {
        var result = CharWithTags(
            curr,
            GetCharPixelWidth(
                fontAsset,
                CHAR_SPACING_INFO[fontAsset.name],
                curr));

        if (curr != ' ' && next.HasValue && next.Value != ' ')
            result +=
                $"<space={CHAR_SPACING_INFO[fontAsset.name]._interCharSpaceWidth}px>";

        return result;
    }

    private static int GetCharPixelWidth
        (TMP_FontAsset fontAsset, CharSpacingInfo spacingInfo, char curr)
    {
        if (curr == ' ')
            return spacingInfo._whitespaceWidth;

        if (fontAsset.characterLookupTable.TryGetValue
            (curr, out TMP_Character tmpCharacter))
            return spacingInfo.SuggestedWidthFor
                (tmpCharacter.glyph.metrics.width);

        Debug.LogWarning($"Glyph for character '{curr}' not found in the font asset. Using 0 width.");
        return 0;
    }
```

Listing 2. The `WrapStringInTags` and `WrapCharInTags` methods of the `PixelPerfectTextEnforcerStatic` class.

The `WrapStringInTags` method handles the string processing obviously. Each character (alongside the following one) is fed into the `WrapCharInTags` method which then wraps the input character into the required `mspace` tags and adds the `space` tag if necessary. Since the character glyphs themselves are pixel perfect, in this way we are only forcing the proper spacing between the characters and the proper whitespace character width as well.

There is however another case one should account for, and that is the situation in which the string of pixel perfect text is supposed to be centered, but is of odd length in pixels – such a string can never snap perfectly to the pixel grid since all of its pixels will smack in the middle of the grid fields the entire time. For that purpose the methods shown in listing 3 are employed to adjust the `TextMeshPro` object position in such a way that pixel perfect text is assured even in such a case.

```csharp
    private static int GetStringPixelWidth
        (TMP_FontAsset fontAsset, string text)
    {
        var totalPixelLength = 0;

        for (int i = 0; i < text.Length; i++)
        {
            totalPixelLength += GetCharPixelWidth(
                fontAsset,
                CHAR_SPACING_INFO[fontAsset.name],
                text[i]);

            totalPixelLength +=
                i < text.Length - 1 && text[i] != ' ' && text[i + 1] != ' ' ?
                    CHAR_SPACING_INFO[fontAsset.name]._interCharSpaceWidth :
                    0;
        }

        if (fontAsset.name == "HalfEighties") // special adjustment for the "HalfEighties" font.
            totalPixelLength += 1;

        return totalPixelLength;
    }

    public static float GetPosXAdjustment
        (TMP_Text tmpText, string currText)
    {
        if (tmpText.horizontalAlignment != HorizontalAlignmentOptions.Center)
            throw new System.ArgumentException
                ("Adjusting horizontal position for non-centered text is pointless. Aborting...");

        var lengthInPixels = GetStringPixelWidth(tmpText.font, currText);
        var pos = tmpText.GetComponent<RectTransform>().anchoredPosition;

        var isTextPosXInt = pos.x % 1 == 0;

        var shouldNudge = isTextPosXInt && lengthInPixels % 2 != 0; // text has not yet been nudged but it should be
        var shouldRevert = !isTextPosXInt && lengthInPixels % 2 == 0; // text has been nudged but should now be pulled back

        return shouldNudge ? -.5f : (shouldRevert ? +.5f : 0f);
    }
```

Listing 3. The `GetStringPixelWidth` and `GetPosXAdjustment` methods of the `PixelPerfectTextEnforcerStatic` class.

The result is responsive pixel perfect text that is suitable for all alignment settings, and for both static and dynamic text alike. How it looks like in the end can be viewed in image 5.

![](screenshot03_snaptopixels.gif)

Image 5. Pixel perfect text enforcer.

There is a short interval which the text needs to snap into place. This float value is exposed by the script and can be adjusted in the inspector. One more important thing to note is that the `TextMeshPro` object’s `RectTransform` component has to be set to integer coordinates for the `PixelPerfectTextEnforcer` script to work properly.

The entire script may be viewed on [GitHub](https://gist.github.com/NikolaVetnic/9f81ed90c8d50711249bf05a59429e51) and freely used. It is tested and works well with all kinds of text – static, dynamic, localized or not.

## 3 Conclusion

Nasty artifacts can really spoil the illusion of playing a game released a few decades ago, which breaks the immersion and ruins the style which the developer worked so hard to achieve. This simple script handles the `TextMeshPro` font problems neatly and effectively, and lets developers concentrate on things more important then nudging the text objects by sub-pixel values around.
