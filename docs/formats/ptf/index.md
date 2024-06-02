---
title: PTF (Textures)
section: File formats
next: ptm
---

## Format

- Current revision is `0`
- File extension is `.ptf`
- Data is little endian
- LZ4 is used for compression

| Type | Description
| -
| <code>"<a href="#header">Header</a>"</code> | File header
| <code>"<a href="#data">Data</a>"</code> | Image data

---

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', 'T', 'F'}` | Header magic
| `u8` | `0` | Revision
| `u8` | [Header info byte](#header-info-byte) | Flags and resolution

##### Header info byte

| Bit | Value | Description
| -
| 1-3 | `0` | Unused
| 4 | -- | Has alpha
| 5-8 | -- | Resolution

---

### Data

| Type | Description
| -
| Compressed <code>{"<a href="#rgb-pixel">RGB pixel</a>"|"<a href="#rgba-pixel">RGBA pixel</a>"}[0...]</code> | Compressed pixels

##### RGB pixel

| Type | Description
| -
| `u8[3]` | RGB

##### RGBA pixel

| Type | Description
| -
| `u8[4]` | RGBA
