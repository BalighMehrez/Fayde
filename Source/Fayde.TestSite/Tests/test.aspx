﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="test.aspx.cs" Inherits="Fayde.TestSite.Tests.test" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script src="/Fayde/Fayde.js"></script>
    <style>
        *
        {
            margin: 0;
            padding: 0;
        }
        html, body
        {
            width: 100%;
            height: 100%;
        }
        canvas
        {
            display: block;
        }
    </style>
</head>
<body faydeapp='<%= Request.QueryString["page"] %>'>
</body>
</html>