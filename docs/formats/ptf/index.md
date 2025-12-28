---
section: File Format Documentation
title: PTF
description: Textures
next: ptm
---

# Table of contents

- [Format](#format)
    - [Header](#header)
        - [Info](#info)
        - [Flags](#flags)
        - [Pixel format](#pixel-format)
        - [Resolution](#resolution)
    - [Data](#data)
        - [I pixel](#i-pixel)
        - [IA pixel](#ia-pixel)
        - [RGB pixel](#rgb-pixel)
        - [RGBA pixel](#rgba-pixel)

---

## Format

- Current version is `0.0`
- File extension is `.ptf`
- Data is little endian
- LZ4F is used for compression

| Type | Description
| -
| [Header](#header) | File header
| [Data](#data) | Image data

---

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', 'T', 'F'}` | Header magic
| `u8` | 0 | Major version
| `u8` | [Info](#info) | Info
| `u8` | [Resolution](#resolution) | Resolution

##### Info

| Bits \(LSB to MSB\) | Value | Description
| -
| 0..1 | [Pixel format](#pixel-format) | Pixel data format
| 2..3 | 0 | Reserved
| 4..7 | [Flags](#flags) | Flags

##### Flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 0..3 | 0 | Reserved

##### Pixel format

| Name | Value
| -
| `PTF_FRMT_I` | 0
| `PTF_FRMT_IA` | 1
| `PTF_FRMT_RGB` | 2
| `PTF_FRMT_RGBA` | 3

##### Resolution

| Bits \(LSB to MSB\) | Description
| -
| 0..3 | Width (2^n)
| 4..7 | Height (2^n)

---

### Data

| Type | Value | Description
| -
| `u8[]` | Compressed '[I pixel](#i-pixel) × 1...', '[IA pixel](#ia-pixel) × 1...', '[RGB pixel](#rgb-pixel) × 1...', or '[RGBA pixel](#rgba-pixel) × 1...' | Pixel data

#### I pixel

| Type | Description
| -
| `u8` | Intensity


#### IA pixel

| Type | Description
| -
| `u8[2]` | Intensity and alpha


#### RGB pixel

| Type | Description
| -
| `u8[3]` | Red, green, and blue

#### RGBA pixel

| Type | Description
| -
| `u8[4]` | Red, green, blue, and alpha
