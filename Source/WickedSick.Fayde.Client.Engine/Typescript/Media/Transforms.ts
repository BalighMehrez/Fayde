/// <reference path="Transform.ts" />
/// <reference path="../Core/XamlObjectCollection.ts" />
/// CODE

module Fayde.Media {
    export class RotateTransform extends Transform {
        static AngleProperty: DependencyProperty = DependencyProperty.Register("Angle", () => Number, RotateTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static CenterXProperty: DependencyProperty = DependencyProperty.Register("CenterX", () => Number, RotateTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static CenterYProperty: DependencyProperty = DependencyProperty.Register("CenterY", () => Number, RotateTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        Angle: number;
        CenterX: number;
        CenterY: number;

        private _BuildValue(): number[] {
            var cx = this.CenterX;
            var cy = this.CenterY;
            var angleRad = Math.PI / 180 * this.Angle;
            var m = mat3.createRotate(angleRad);
            if (cx === 0 && cy === 0)
                return m;

            //move center {x,y} to {0,0}, rotate, then slide {x,y} back to {x,y}
            mat3.multiply(mat3.createTranslate(-cx, -cy), m, m); //m = m * translation
            mat3.translate(m, cx, cy);
            return m;
        }
    }
    Nullstone.RegisterType(RotateTransform, "RotateTransform");

    export class ScaleTransform extends Transform {
        static CenterXProperty: DependencyProperty = DependencyProperty.Register("CenterX", () => Number, ScaleTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static CenterYProperty: DependencyProperty = DependencyProperty.Register("CenterY", () => Number, ScaleTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static ScaleXProperty: DependencyProperty = DependencyProperty.Register("ScaleX", () => Number, ScaleTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static ScaleYProperty: DependencyProperty = DependencyProperty.Register("ScaleY", () => Number, ScaleTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        CenterX: number;
        CenterY: number;
        ScaleX: number;
        ScaleY: number;

        private _BuildValue(): number[] {
            var cx = this.CenterX;
            var cy = this.CenterY;
            var m = mat3.createScale(this.ScaleX, this.ScaleY);
            if (cx === 0 && cy === 0)
                return m;

            //move center {x,y} to {0,0}, scale, then slide {x,y} back to {x,y}
            mat3.multiply(mat3.createTranslate(-cx, -cy), m, m); //m = m * translation
            mat3.translate(m, cx, cy);
            return m;
        }
    }
    Nullstone.RegisterType(ScaleTransform, "ScaleTransform");

    export class SkewTransform extends Transform {
        static AngleXProperty: DependencyProperty = DependencyProperty.Register("AngleX", () => Number, SkewTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static AngleYProperty: DependencyProperty = DependencyProperty.Register("AngleY", () => Number, SkewTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static CenterXProperty: DependencyProperty = DependencyProperty.Register("CenterX", () => Number, SkewTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static CenterYProperty: DependencyProperty = DependencyProperty.Register("CenterY", () => Number, SkewTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        AngleX: number;
        AngleY: number;
        CenterX: number;
        CenterY: number;

        private _BuildValue(): number[] {
            var cx = this.CenterX;
            var cy = this.CenterY;
            var angleXRad = Math.PI / 180 * this.AngleX;
            var angleYRad = Math.PI / 180 * this.AngleY;
            var m = mat3.createSkew(angleXRad, angleYRad);
            if (cx === 0 && cy === 0)
                return m;

            //move center {x,y} to {0,0}, scale, then slide {x,y} back to {x,y}
            mat3.multiply(mat3.createTranslate(-cx, -cy), m, m); //m = m * translation
            mat3.translate(m, cx, cy);
            return m;
        }
    }
    Nullstone.RegisterType(SkewTransform, "SkewTransform");

    export class TranslateTransform extends Transform {
        static XProperty: DependencyProperty = DependencyProperty.Register("X", () => Number, TranslateTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        static YProperty: DependencyProperty = DependencyProperty.Register("Y", () => Number, TranslateTransform, 0, (d, args) => (<Transform>d)._InvalidateValue());
        X: number;
        Y: number;

        private _BuildValue(): number[] {
            return mat3.createTranslate(this.X, this.Y);
        }
    }
    Nullstone.RegisterType(TranslateTransform, "TranslateTransform");

    export interface ITransformChangedChildListener extends ITransformChangedListener {
        Child: Transform;
    }

    export class TransformCollection extends XamlObjectCollection {
        private _Relayer: () => void = function () { };
        private _ChildTransformListeners: ITransformChangedChildListener[] = [];

        AddingToCollection(value: Transform, error: BError): bool {
            if (!super.AddingToCollection(value, error))
                return false;
            var listener = <ITransformChangedChildListener>value.Listen(() => this._Relayer());
            listener.Child = value;
            this._ChildTransformListeners.push(listener);
            this._Relayer();
        }
        RemovedFromCollection(value: Transform, isValueSafe: bool) {
            if (!super.RemovedFromCollection(value, isValueSafe))
                return false;
            var listeners = this._ChildTransformListeners;
            var len = listeners.length;
            for (var i = 0; i < len; i++) {
                if (listeners[i].Child === value) {
                    listeners.splice(i, 1)[0].Detach();
                    break;
                }
            }
            this._Relayer();
        }

        RelayChanges(func: () => void ) {
            this._Relayer = func;
        }
    }
    Nullstone.RegisterType(TransformCollection, "TransformCollection");

    export class TransformGroup extends Transform {
        Children: TransformCollection;
        
        private _TransformListener: ITransformChangedListener;

        constructor() {
            super();
            var coll = new TransformCollection();
            coll.AttachTo(this);
            coll.RelayChanges(() => this._InvalidateValue());
            Object.defineProperty(this, "Children", {
                value: coll,
                writable: false
            });
        }

        private _BuildValue(): number[] {
            var enumerator = this.Children.GetEnumerator(true);
            var cur = mat3.identity();
            while (enumerator.MoveNext()) {
                mat3.multiply((<Transform>enumerator.Current).Value._Raw, cur, cur); //cur = cur * child
            }
            return cur;
        }
    }
    Nullstone.RegisterType(TransformGroup, "TransformGroup");
}