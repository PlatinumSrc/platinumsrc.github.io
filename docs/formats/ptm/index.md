---
title: PTM (Tracker music)
section: File formats
#next: 
---

## Format

- Current revision is `0`
- File extension is `.ptm`
- Data is little endian

| Type | Description
| -
| <code>"<a href="#header">Header</a>"</code> | File header
| <code>"<a href="#data">Data</a>"</code> | Music data

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', 'T', 'M'}` | Header magic
| `u8` | `0` | Revision
| `char[1...]` | `{..., 0}` | Song name
| `char[1...]` | `{..., 0}` | Author
| `char[1...]` | `{..., 0}` | Comments

---

### Data
