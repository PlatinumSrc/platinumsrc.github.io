---
section: File Format Documentation
title: PTF
description: Textures
next: ptm
---

# Table of contents

- [Format](#format)
    - [Header](#header)
        - [Header info byte](#header-info-byte)
    - [Data](#data)
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
| `u8` | [Header info byte](#header-info-byte) | Flags and resolution

##### Header info byte

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..5 | 0 | Reserved
| 4 | -- | Has alpha
| 3..0 | -- | Resolution

---

### Data

| Type | Value | Description
| -
| `u8[]` | Compressed '[RGB pixel](#rgb-pixel) × 1...' or '[RGBA pixel](#rgba-pixel) × 1...' | Pixel data

#### RGB pixel

| Type | Description
| -
| `u8[3]` | RGB

#### RGBA pixel

| Type | Description
| -
| `u8[4]` | RGBA
