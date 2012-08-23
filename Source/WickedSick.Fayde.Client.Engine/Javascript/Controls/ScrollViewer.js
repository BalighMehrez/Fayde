﻿/// <reference path="ContentControl.js"/>
/// CODE
/// <reference path="Primitives/IScrollInfo.js"/>
/// <reference path="ScrollContentPresenter.js"/>
/// <reference path="Primitives/ScrollEventArgs.js"/>
/// <reference path="Primitives/Enums.js"/>

//#region ScrollViewer
var ScrollViewer = Nullstone.Create("ScrollViewer", ContentControl);

ScrollViewer.Instance.Init = function () {
    this.Init$ContentControl();
    this.RequestBringIntoView.Subscribe(this._OnRequestBringIntoView, this);
    this.DefaultStyleKey = this.constructor;
};

//#region Dependency Properties

ScrollViewer.OnScrollBarVisibilityPropertyChanged = function (d, args) {
    if (!d)
        return;
    d._InvalidateMeasure();
    var scrollInfo = d.GetScrollInfo();
    if (scrollInfo) {
        scrollInfo.SetCanHorizontallyScroll(d.HorizontalScrollBarVisibility !== ScrollBarVisibility.Disabled);
        scrollInfo.SetCanVerticallyScroll(d.VerticalScrollBarVisibility !== ScrollBarVisibility.Disabled);
    }
    d._UpdateScrollBarVisibility();
};
ScrollViewer.HorizontalScrollBarVisibilityProperty = DependencyProperty.RegisterAttachedCore("HorizontalScrollBarVisibility", function () { return new Enum(ScrollBarVisibility); }, ScrollViewer, ScrollBarVisibility.Disabled, ScrollViewer.OnScrollBarVisibilityPropertyChanged);
ScrollViewer.VerticalScrollBarVisibilityProperty = DependencyProperty.RegisterAttachedCore("VerticalScrollBarVisibility", function () { return new Enum(ScrollBarVisibility); }, ScrollViewer, ScrollBarVisibility.Disabled, ScrollViewer.OnScrollBarVisibilityPropertyChanged);
ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty = DependencyProperty.RegisterReadOnlyCore("ComputedHorizontalScrollBarVisibility", function () { return new Enum(Visibility); }, ScrollViewer);
ScrollViewer.ComputedVerticalScrollBarVisibilityProperty = DependencyProperty.RegisterReadOnlyCore("ComputedVerticalScrollBarVisibility", function () { return new Enum(Visibility); }, ScrollViewer);
ScrollViewer.HorizontalOffsetProperty = DependencyProperty.RegisterReadOnlyCore("HorizontalOffset", function () { return Number; }, ScrollViewer);
ScrollViewer.VerticalOffsetProperty = DependencyProperty.RegisterReadOnlyCore("VerticalOffset", function () { return Number; }, ScrollViewer);
ScrollViewer.ScrollableWidthProperty = DependencyProperty.RegisterReadOnlyCore("ScrollableWidth", function () { return Number; }, ScrollViewer);
ScrollViewer.ScrollableHeightProperty = DependencyProperty.RegisterReadOnlyCore("ScrollableHeight", function () { return Number; }, ScrollViewer);
ScrollViewer.ViewportWidthProperty = DependencyProperty.RegisterReadOnlyCore("ViewportWidth", function () { return Number; }, ScrollViewer);
ScrollViewer.ViewportHeightProperty = DependencyProperty.RegisterReadOnlyCore("ViewportHeight", function () { return Number; }, ScrollViewer);
ScrollViewer.ExtentWidthProperty = DependencyProperty.RegisterReadOnlyCore("ExtentWidth", function () { return Number; }, ScrollViewer);
ScrollViewer.ExtentHeightProperty = DependencyProperty.RegisterReadOnlyCore("ExtentHeight", function () { return Number; }, ScrollViewer);

Nullstone.AutoProperties(ScrollViewer, [
    ScrollViewer.HorizontalScrollBarVisibilityProperty,
    ScrollViewer.VerticalScrollBarVisibilityProperty
]);

Nullstone.AutoPropertiesReadOnly(ScrollViewer, [
    ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty,
    ScrollViewer.ComputedVerticalScrollBarVisibilityProperty,
    ScrollViewer.HorizontalOffsetProperty,
    ScrollViewer.VerticalOffsetProperty,
    ScrollViewer.ScrollableWidthProperty,
    ScrollViewer.ScrollableHeightProperty,
    ScrollViewer.ViewportWidthProperty,
    ScrollViewer.ViewportHeightProperty,
    ScrollViewer.ExtentWidthProperty,
    ScrollViewer.ExtentHeightProperty
]);

//#endregion

//#region Properties

ScrollViewer.Instance.GetScrollInfo = function () {
    ///<returns type="IScrollInfo"></returns>
    return this.$ScrollInfo;
};
ScrollViewer.Instance.SetScrollInfo = function (value) {
    ///<param name="value" type="IScrollInfo"></param>
    this.$ScrollInfo = value;
    if (value) {
        value.SetCanHorizontallyScroll(this.HorizontalScrollBarVisibility !== ScrollBarVisibility.Disabled);
        value.SetCanVerticallyScroll(this.VerticalScrollBarVisibility !== ScrollBarVisibility.Disabled);
    }
};

//#endregion

//#region Line

ScrollViewer.Instance.LineUp = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.SmallDecrement, 0));
};
ScrollViewer.Instance.LineDown = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.SmallIncrement, 0));
};
ScrollViewer.Instance.LineLeft = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.SmallDecrement, 0));
};
ScrollViewer.Instance.LineRight = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.SmallIncrement, 0));
};

//#endregion

//#region Page

ScrollViewer.Instance.PageHome = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.First, 0));
};
ScrollViewer.Instance.PageEnd = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.Last, 0));
};

ScrollViewer.Instance.PageUp = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.LargeDecrement, 0));
};
ScrollViewer.Instance.PageDown = function () {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.LargeIncrement, 0));
};
ScrollViewer.Instance.PageLeft = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.LargeDecrement, 0));
};
ScrollViewer.Instance.PageRight = function () {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.LargeIncrement, 0));
};

//#endregion

//#region Scroll

ScrollViewer.Instance._ScrollInDirection = function (key) {
    //TODO: FlowDirection
    //var flowDirection = this.FlowDirection === FlowDirection.RightToLeft;
    switch (key) {
        case Key.PageUp:
            this.PageUp();
            break;
        case Key.PageDown:
            this.PageDown();
            break;
        case Key.End:
            this.PageEnd();
            break;
        case Key.Home:
            this.PageHome();
            break;
        case Key.Left:
            this.LineLeft();
            break;
        case Key.Up:
            this.LineUp();
            break;
        case Key.Right:
            this.LineRight();
            break;
        case Key.Down:
            this.LineDown();
            break;            
    }
};
ScrollViewer.Instance.ScrollToHorizontalOffset = function (offset) {
    this._HandleHorizontalScroll(new ScrollEventArgs(ScrollEventType.ThumbPosition, offset));
};
ScrollViewer.Instance.ScrollToVerticalOffset = function (offset) {
    this._HandleVerticalScroll(new ScrollEventArgs(ScrollEventType.ThumbPosition, offset));
};
ScrollViewer.Instance._HandleScroll = function (orientation, e) {
    /// <param name="e" type="ScrollEventArgs"></param>
    if (orientation !== Orientation.Horizontal)
        this._HandleVerticalScroll(e);
    else
        this._HandleHorizontalScroll(e);
};
ScrollViewer.Instance._HandleHorizontalScroll = function (e) {
    /// <param name="e" type="ScrollEventArgs"></param>
    var scrollInfo = this.GetScrollInfo();
    if (!scrollInfo)
        return;
    var offset = scrollInfo.GetHorizontalOffset();
    var newValue = offset;
    switch (e.ScrollEventType) {
        case ScrollEventType.SmallDecrement:
            scrollInfo.LineLeft();
            break;
        case ScrollEventType.SmallIncrement:
            scrollInfo.LineRight();
            break;
        case ScrollEventType.LargeDecrement:
            scrollInfo.PageLeft();
            break;
        case ScrollEventType.LargeIncrement:
            scrollInfo.PageRight();
            break;
        case ScrollEventType.ThumbPosition:
        case ScrollEventType.ThumbTrack:
            newValue = e.Value;
            break;
        case ScrollEventType.First:
            newValue = -1.79769313486232E+308;
            break;
        case ScrollEventType.Last:
            newValue = 1.79769313486232E+308;
            break;
    }
    newValue = Math.max(newValue, 0);
    newValue = Math.min(this.ScrollableWidth, newValue);
    if (!DoubleUtil.AreClose(offset, newValue))
        scrollInfo.ChangeHorizontalOffset(newValue);
};
ScrollViewer.Instance._HandleVerticalScroll = function (e) {
    /// <param name="e" type="ScrollEventArgs"></param>
    var scrollInfo = this.GetScrollInfo();
    if (!scrollInfo)
        return;
    var offset = scrollInfo.GetVerticalOffset();
    var newValue = offset;
    switch (e.ScrollEventType) {
        case ScrollEventType.SmallDecrement:
            scrollInfo.LineUp();
            break;
        case ScrollEventType.SmallIncrement:
            scrollInfo.LineDown();
            break;
        case ScrollEventType.LargeDecrement:
            scrollInfo.PageUp();
            break;
        case ScrollEventType.LargeIncrement:
            scrollInfo.PageDown();
            break;
        case ScrollEventType.ThumbPosition:
        case ScrollEventType.ThumbTrack:
            newValue = e.Value;
            break;
        case ScrollEventType.First:
            newValue = -1.79769313486232E+308;
            break;
        case ScrollEventType.Last:
            newValue = 1.79769313486232E+308;
            break;
    }
    newValue = Math.max(newValue, 0);
    newValue = Math.min(this.ScrollableHeight, newValue);
    if (!DoubleUtil.AreClose(offset, newValue))
        scrollInfo.ChangeVerticalOffset(newValue);
};

//#endregion

//#region Mouse

ScrollViewer.Instance.OnMouseLeftButtonDown = function (sender, args) {
    if (!args.Handled && this.Focus())
        args.Handled = true;
    this.OnMouseLeftButtonDown$ContentControl(sender, args);
};
ScrollViewer.Instance.OnMouseWheel = function (sender, args) {
    this.OnMouseWheel$ContentControl(sender, args);
    if (args.Handled)
        return;
    var scrollInfo = this.GetScrollInfo();
    if (!scrollInfo)
        return;
    if ((args.Delta > 0 && scrollInfo.GetVerticalOffset() !== 0) || (args.Delta < 0 && scrollInfo.GetVerticalOffset() < this.ScrollableHeight)) {
        if (args.Delta >= 0)
            scrollInfo.MouseWheelUp();
        else
            scrollInfo.MouseWheelDown();
        args.Handled = true;
    }
};

//#endregion

//#region Keyboard

ScrollViewer.Instance.OnKeyDown = function (sender, args) {
    this.OnKeyDown$ContentControl(sender, args);
    this._HandleKeyDown(args);
};
ScrollViewer.Instance._HandleKeyDown = function (args) {
    if (args.Handled)
        return;
    if (!this.$TemplatedParentHandlesScrolling)
        return;

    var orientation = Orientation.Vertical;
    var scrollEventType = ScrollEventType.ThumbTrack;
    //TODO: FlowDirection
    //var flowDirection = base.FlowDirection === FlowDirection.RightToLeft;
    switch (args.KeyCode) {
        case Keys.PageUp:
            scrollEventType = ScrollEventType.LargeDecrement;
            break;
        case Keys.PageDown:
            scrollEventType = ScrollEventType.LargeIncrement;
            break;
        case Keys.End:
            if (!args.Modifiers.Ctrl)
                orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.Last;
            break;
        case Keys.Home:
            if (!args.Modifiers.Ctrl)
                orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.First;
            break;
        case Keys.Left:
            orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.SmallDecrement;
        case Keys.Up:
            scrollEventType = ScrollEventType.SmallDecrement;
            break;
        case Keys.Right:
            orientation = Orientation.Horizontal;
            scrollEventType = ScrollEventType.SmallIncrement;
        case Keys.Down:
            scrollEventType = ScrollEventType.SmallIncrement;
            break;
    }
    if (scrollEventType !== ScrollEventType.ThumbTrack) {
        this._HandleScroll(orientation, new ScrollEventArgs(scrollEventType, 0));
        args.Handled = true;
    }
};

//#endregion

ScrollViewer.Instance.OnApplyTemplate = function () {
    this.OnApplyTemplate$ContentControl();
    this.$ElementScrollContentPresenter = Nullstone.As(this.GetTemplateChild("ScrollContentPresenter"), ScrollContentPresenter);
    this.$ElementHorizontalScrollBar = Nullstone.As(this.GetTemplateChild("HorizontalScrollBar"), ScrollBar);
    if (this.$ElementHorizontalScrollBar) {
        this.$ElementHorizontalScrollBar.Scroll.Subscribe(function (sender, e) { this._HandleScroll(Orientation.Horizontal, e); }, this);
    }
    this.$ElementVerticalScrollBar = Nullstone.As(this.GetTemplateChild("VerticalScrollBar"), ScrollBar);
    if (this.$ElementVerticalScrollBar) {
        this.$ElementVerticalScrollBar.Scroll.Subscribe(function (sender, e) { this._HandleScroll(Orientation.Vertical, e); }, this);
    }
    this._UpdateScrollBarVisibility();
};

ScrollViewer.Instance.MakeVisible = function (uie, targetRect) {
    /// <param name="uie" type="UIElement"></param>
    /// <param name="targetRect" type="Rect"></param>
    var escp = this.$ElementScrollContentPresenter;
    if (uie && escp && (Nullstone.RefEquals(escp, uie) || escp.IsAncestorOf(uie)) && this.IsAncestorOf(escp) && this._IsAttached) {
        if (targetRect.IsEmpty()) {
            targetRect = new Rect(0, 0, uie._RenderSize.Width, uie._RenderSize.Height);
        }
        var rect2 = escp.MakeVisible(uie, targetRect);
        if (!rect2.IsEmpty()) {
            var p = escp.TransformToVisual(this).Transform(new Point(rect2.X, rect2.Y));
            rect2.X = p.X;
            rect2.Y = p.Y;
        }
        this.BringIntoView(rect2);
    }
};

//#region Update/Invalidation

ScrollViewer.Instance._InvalidateScrollInfo = function () {
    var scrollInfo = this.GetScrollInfo();
    if (scrollInfo) {
        this.$SetValueInternal(ScrollViewer.ExtentWidthProperty, scrollInfo.GetExtentWidth());
        this.$SetValueInternal(ScrollViewer.ExtentHeightProperty, scrollInfo.GetExtentHeight());
        this.$SetValueInternal(ScrollViewer.ViewportWidthProperty, scrollInfo.GetViewportWidth());
        this.$SetValueInternal(ScrollViewer.ViewportHeightProperty, scrollInfo.GetViewportHeight());
        this._UpdateScrollBar(Orientation.Horizontal, scrollInfo.GetHorizontalOffset());
        this._UpdateScrollBar(Orientation.Vertical, scrollInfo.GetVerticalOffset());
        this._UpdateScrollBarVisibility();
    }
    this._RaiseViewportChanged(this.ViewportWidth, this.ViewportHeight);

    var w = Math.max(0, this.ExtentWidth - this.ViewportWidth);
    if (w !== this.ScrollableWidth) {
        this.$SetValueInternal(ScrollViewer.ScrollableWidthProperty, w);
        this._InvalidateMeasure();
    }

    var h = Math.max(0, this.ExtentHeight - this.ViewportHeight);
    if (h !== this.ScrollableHeight) {
        this.$SetValueInternal(ScrollViewer.ScrollableHeightProperty, h);
        this._InvalidateMeasure();
    }
};
ScrollViewer.Instance._UpdateScrollBarVisibility = function () {
    var scrollInfo = this.GetScrollInfo();

    var horizontalVisibility = Visibility.Visible;
    var hsbv = this.HorizontalScrollBarVisibility;
    switch (hsbv) {
        case ScrollBarVisibility.Visible:
            break;
        case ScrollBarVisibility.Disabled:
        case ScrollBarVisibility.Hidden:
            horizontalVisibility = Visibility.Collapsed;
            break;
        case ScrollBarVisibility.Auto:
        default:
            horizontalVisibility = (!scrollInfo || scrollInfo.GetExtentWidth() <= scrollInfo.GetViewportWidth()) ? Visibility.Collapsed : Visibility.Visible;
            break;
    }

    if (horizontalVisibility !== this.ComputedHorizontalScrollBarVisibility) {
        this.$SetValueInternal(ScrollViewer.ComputedHorizontalScrollBarVisibilityProperty, horizontalVisibility);
        this._RaiseVisibilityChanged(horizontalVisibility, Orientation.Horizontal);
        this._InvalidateMeasure();
    }

    var verticalVisibility = Visibility.Visible;
    var vsbv = this.VerticalScrollBarVisibility;
    switch (vsbv) {
        case ScrollBarVisibility.Visible:
            break;
        case ScrollBarVisibility.Disabled:
        case ScrollBarVisibility.Hidden:
            verticalVisibility = Visibility.Collapsed;
            break;
        case ScrollBarVisibility.Auto:
        default:
            verticalVisibility = (!scrollInfo || scrollInfo.GetExtentHeight() <= scrollInfo.GetViewportHeight()) ? Visibility.Collapsed : Visibility.Visible;
            break;
    }

    if (verticalVisibility !== this.ComputedVerticalScrollBarVisibility) {
        this.$SetValueInternal(ScrollViewer.ComputedVerticalScrollBarVisibilityProperty, verticalVisibility);
        this._RaiseVisibilityChanged(verticalVisibility, Orientation.Vertical);
        this._InvalidateMeasure();
    }
};
ScrollViewer.Instance._UpdateScrollBar = function (orientation, value) {
    try {
        var scrollInfo = this.GetScrollInfo();
        if (orientation === Orientation.Horizontal) {
            this.$SetValueInternal(ScrollViewer.HorizontalOffsetProperty, value);
            this._RaiseOffsetChanged(scrollInfo.GetHorizontalOffset(), Orientation.Horizontal);
            if (this.$ElementHorizontalScrollBar) {
                this.$ElementHorizontalScrollBar.Value = value;
            }
        } else {
            this.$SetValueInternal(ScrollViewer.VerticalOffsetProperty, value);
            this._RaiseOffsetChanged(scrollInfo.GetVerticalOffset(), Orientation.Vertical);
            if (this.$ElementVerticalScrollBar) {
                this.$ElementVerticalScrollBar.Value = value;
            }
        }
    } finally {
    }
};

//#endregion

//#region UIAutomation

ScrollViewer.Instance._RaiseOffsetChanged = function (offset, orientation) {
};
ScrollViewer.Instance._RaiseVisibilityChanged = function (visibility, orientation) {
};
ScrollViewer.Instance._RaiseViewportChanged = function (viewportWidth, viewportHeight) {
};

//#endregion

ScrollViewer.Instance._OnRequestBringIntoView = function (sender, args) {
    /// <param name="args" type="RequestBringIntoViewEventArgs"></param>
    var sv = Nullstone.As(sender, ScrollViewer);
    var targetObj = args.TargetObject;
    if (targetObj && sv && !Nullstone.RefEquals(sv, targetObj) && sv.IsAncestorOf(targetObj)) {
        sv.MakeVisible(targetObj, args.TargetRect);
        args.Handled = true;
    }
};

Nullstone.FinishCreate(ScrollViewer);
//#endregion