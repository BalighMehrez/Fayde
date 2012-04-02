﻿/// <reference path="TextBoxUndoAction.js"/>
/// CODE

//#region _TextBoxUndoActionReplace
var _TextBoxUndoActionReplace = Nullstone.Create("_TextBoxUndoActionReplace", _TextBoxUndoAction, 6);

_TextBoxUndoActionReplace.Instance.Init = function (selectionAnchor, selectionCursor, buffer, start, length, inserted) {
    this._SelectionAnchor = selectionAnchor;
    this._SelectionCursor = selectionCursor;
    this._Start = start;
    this._Length = length;
    this._Deleted = buffer._Text.substr(start, length);
    this._Inserted = inserted;
};

Nullstone.FinishCreate(_TextBoxUndoActionReplace);
//#endregion