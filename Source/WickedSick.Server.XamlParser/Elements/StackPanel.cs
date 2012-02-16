﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Serialization;
using WickedSick.Server.XamlParser.TypeConverters;

namespace WickedSick.Server.XamlParser.Elements
{
    [Element]
    public class StackPanel: Panel
    {
        [Property]
        [OrientationConverter]
        public Orientation Orientation { get; set; }
    }
}