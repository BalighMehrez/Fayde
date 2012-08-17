﻿using WickedSick.Server.XamlParser.Elements.Types;

namespace WickedSick.Server.XamlParser.Elements.Controls
{
    public class TextBox : Control
    {
        public static readonly PropertyDescription TextProperty = PropertyDescription.Register("Text", typeof(string), typeof(TextBox), true);
        public static readonly PropertyDescription TextWrappingProperty = PropertyDescription.Register("TextWrapping", typeof(TextWrapping), typeof(TextBox));
    }
}