# 微信朋友圈草稿箱 | WeChat Moments Draft Box

**网站 Website:** https://xzhongmm.github.io/WeChat-Draft-Box/

[English Description](#en)

## 介绍

一个用于管理多个微信朋友圈草稿的全栈网页应用。

微信朋友圈通常只能保存一个草稿，当需要提前准备多个朋友圈内容时，管理起来较为不便。本项目参考微信朋友圈的编辑体验，提供一个独立的多草稿管理工具，让用户可以创建、编辑、保存和删除多条朋友圈草稿。

支持 **中文** 与 **英文** 双语言切换，并支持最多 9 张图片的上传与拖拽排序。

### 当前版本

网站目前已部署到 GitHub Pages，后端 API 部署在 Render。

> 注意：目前为个人项目与作品集项目。后端使用 SQLite 和服务器本地文件存储，因此不保证用户数据在服务器重新部署或重启后永久保存。

## 功能特色

- 📝 创建并管理多个朋友圈草稿
- 🖼️ 每条草稿最多添加 9 张图片
- 🔀 拖拽调整图片顺序
- 🔍 点击图片进入全屏浏览
- 🗑️ 删除图片前确认提示
- 💾 保存草稿修改
- ↩️ 取消本次编辑或彻底删除草稿
- 🌐 支持中英文界面切换
- 📱 响应式设计，适配电脑与手机浏览器
- 💾 使用后端 API 保存草稿数据
- 🗄️ 使用 SQLite 持久化存储草稿信息
- 📤 使用服务器端文件存储保存上传的图片

## 技术栈

### 前端
- React
- TypeScript
- Vite
- CSS

### 后端
- Node.js
- Express
- REST API
- SQLite
- Multer

### 部署
- GitHub Pages — Frontend
- Render — Backend API

## 架构

React + TypeScript 
    │ 
    │ HTTP requests 
    ▼ 
Express REST API 
    │ 
    ├── SQLite 
    │       └── Draft metadata 
    │ 
    └── Multer 
            └── Uploaded images

前端负责用户界面、编辑状态和用户交互；Express 后端通过 REST API 处理草稿的创建、读取、更新和删除，并使用 SQLite 保存草稿数据。

图片通过 Multer 上传至后端服务器，数据库中保存对应的图片路径。

## 项目背景

微信朋友圈目前只能保存一条草稿，当需要提前准备多个朋友圈内容时，管理多个帖子并不方便。

因此，本项目参考微信朋友圈的编辑体验，设计了一个支持多草稿管理的独立工具，让用户可以提前准备、修改和整理多个朋友圈帖子。


<a id="en"></a>

## About

WeChat Moments Draft Box is a full-stack web application for creating and managing multiple WeChat Moments post drafts.

Unlike WeChat's built-in draft system, which currently supports saving only one draft at a time, this project allows users to create, edit, save, revisit, and manage multiple drafts while maintaining a familiar Moments-style editing experience.

The interface supports both **English** and **Chinese** and is designed for desktop and mobile browsers.

## Features
- 📝 Create and manage multiple drafts
- 🖼️ Upload up to 9 images per draft
- 🔀 Drag-and-drop image reordering
- 🔍 Full-screen image viewer
- 🗑️ Confirmation before deleting images
- 💾 Save and update drafts
- ↩️ Cancel edits or permanently delete drafts
- 🌐 English & Chinese language support
- 📱 Responsive desktop and mobile interface

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express
- REST API
- SQLite
- Multer

## Architecture
React + TypeScript
       │
       │ HTTP requests
       ▼
Express REST API
       │
       ├── SQLite
       │     └── Draft metadata
       │
       └── Multer
             └── Uploaded images

The React frontend handles the user interface, editing state, and user interactions. The Express backend exposes REST API endpoints for creating, retrieving, updating, and deleting drafts, while SQLite provides persistent storage for draft metadata.

Images are uploaded to the backend using Multer, with their server-side file paths stored as part of the draft data.

## Motivation

WeChat currently only allows users to save one Moments draft at a time, making it inconvenient to prepare multiple posts in advance.

This project recreates the familiar Moments editing experience while providing a more flexible multi-draft workflow for organizing and revisiting posts.