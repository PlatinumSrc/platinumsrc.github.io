---
title: P3M
description: 3D models
section: File formats
next: ptf
---

## Format

- Current version is `1.1`
- File extension is `.p3m`
- Data is little endian

| Type | Description
| -
| <code>"<a href="#header">Header</a>"</code> | File header
| <code>"<a href="#data">Data</a>"</code> | Model data

---

### Header

| Type | Value | Description
| -
| `char[4]` | `{'P', '3', 'M', 0}` | Header magic
| `u8` | `1` | Major version
| `u8` | `1` | Minor version
| `u8` | [Header flags](#header-flags) | Flags

##### Header flags

| Bit | Value | Description
| -
| 1-7 | `0` | Unused
| 8 | `1` | Has [animation data](#animation-data)

---

### Data

| Type | Value | Description
| -
| `u16` | -- | Vertex count
| <code>"<a href="#vertex">Vertex</a>"[0...]</code> | -- | Vertices
| `u8` | -- | Index group count
| <code>"<a href="#index-group">Index group</a>"[0...]</code> | -- | Index groups
| <code>"<a href="#animation-data">Animation data</a>"[0..1]</code> | -- | (Optional) animation data
| `char[1...]` | `{..., 0}` | String table

---

### Vertex

| Type | Description
| -
| `float[3]` | XYZ
| `float[2]` | UV

---

### Index group


| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Texture path
| `u16` | Index count
| `u16[0...]` | Indices

---

### String

| Type | Description
| -
| `u16` | Offset in string table

---

### Animation data

| Type | Description
| -
| `u8` | Bone count
| <code>"<a href="#bone">Bone</a>"[0...]</code> | Bones
| `u8` | Action count
| <code>"<a href="#action">Action</a>"[0...]</code> | Actions
| `u8` | Animation count
| <code>"<a href="#animation">Animation</a>"[0...]</code> | Animations

---

### Bone

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Name
| `float[3]` | Head XYZ
| `float[3]` | Tail XYZ
| `u16` | Vertex count
| <code>"<a href="#bone-vertex">Bone vertex</a>"[0...]</code> | Vertex references
| `u8` | Child count

##### Bone vertex

| Type | Description
| -
| `u16` | Index
| `u16` | Weight

---

### Action

| Type | Description
| -
| `u16` | Max frame
| `u8` | Number of affected bones
| <code>"<a href="#action-bone-data">Action bone data</a>"[0...]</code> | Per-bone action data

##### Action bone data

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Bone
| <code>"<a href="#action-data">Action data</a>"</code> | Action data

---

### Action data

| Type | Value | Description
| -
| `u8` | -- | Translation count
| `u16[0...]` | -- | Frame
| `u8[0...]` | [Animation interp enum](#animation-interp-enum) | Interpolation type
| `float[0...][3]` | -- | Translations
| `u8` | -- | Rotation count
| `u16[0...]` | -- | Frame
| `u8[0...]` | [Animation interp enum](#animation-interp-enum) | Interpolation type
| `float[0...][3]` | -- | Rotations
| `u8` | -- | Scale count
| `u16[0...]` | -- | Frame
| `u8[0...]` | [Animation interp enum](#animation-interp-enum) | Interpolation type
| `float[0...][3]` | -- | Scales

##### Animation interp enum

| Name | Value
| -
| `P3M_ACTINTERP_NONE` | 0
| `P3M_ACTINTERP_LINEAR` | 1

---

### Animation

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Name
| `u32` | Microseconds per frame
| `u8` | Action count
| <code>"<a href="#animation-action">Animation action</a>"</code> | Action reference

##### Animation action

| Type | Description
| -
| `u8` | Action index
| `float` | Speed multiplier
| `u16` | Start frame
| `u16` | End frame
