---
title: PTM
description: tracker music
section: File formats
next: pfa
---

# Table of contents

- [Format](#format)
    - [Header](#header)
    - [Data](#data)

---

## Format

- Current version is `0.0`
- File extension is `.ptm`
- Data is little endian

| Type | Description
| -
| <code>"<a href="#header">Header</a>"</code> | File header
| <code>"<a href="#data">Data</a>"</code> | Music data

---

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', 'T', 'M'}` | Header magic
| `u8` | `0` | Major version
| `char[1...]` | `{..., 0}` | Song name
| `char[1...]` | `{..., 0}` | Author
| `char[1...]` | `{..., 0}` | Comments

---

### Data
