/// <reference path="Brush.ts" />
/// CODE
/// <reference path="../Primitives/Color.ts" />

module Fayde.Media {
    export class SolidColorBrush extends Brush {
        static ColorProperty: DependencyProperty = DependencyProperty.Register("Color", () => Color, SolidColorBrush, undefined, (d, args) => (<Brush>d).InvalidateBrush());
        Color: Color;

        constructor() {
            super();
            if (arguments.length === 1 && arguments[0] instanceof Color)
                this.Color = arguments[0];
        }

        static FromColor(color: Color): SolidColorBrush {
            var scb = new SolidColorBrush();
            scb.Color = color;
            return scb;
        }

        private CreateBrush(ctx: CanvasRenderingContext2D, bounds: rect): any {
            var color = this.Color;
            if (!color)
                return "#000000";
            return color.toString();
        }
    }
    Nullstone.RegisterType(SolidColorBrush, "SolidColorBrush");
}