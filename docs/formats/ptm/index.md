---
section: File Format Documentation
title: PTM
description: Tracker music
#next: 
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
| [Header](#header) | File header
| [Data](#data) | Music data

---

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', 'T', 'M'}` | Header magic
| `u8` | 0 | Major version
| `char[1...]` | `{..., 0}` | Song name
| `char[1...]` | `{..., 0}` | Author
| `char[1...]` | `{..., 0}` | Comments

---

### Data
