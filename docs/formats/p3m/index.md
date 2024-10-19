---
title: P3M
description: 3D models
section: File formats
next: ptf
---

## Format

- Current version is `0.0`
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
| `char[3]` | `{'P', '3', 'M'}` | Header magic
| `u8` | `0` | Major version
| `u8` | [Header flags](#header-flags) | Flags

##### Header flags

| Bit \(LSB first\) | Value | Description
| -
| 1-8 | `0` | Reserved

---

### Data

| Type | Value | Description
| -
| `u8` | -- | Part count
| `u8[0..32]` | -- | Part visibility bitmask \(LSB first\)
| <code>"<a href="#part">Part</a>"[0...]</code> | -- | Parts
| `u8` | -- | Material count
| <code>"<a href="#material">Material</a>"[0...]</code> | -- | Materials
| `u8` | -- | Texture count
| <code>"<a href="#texture">Texture</a>"[0...]</code> | -- | Textures
| `u8` | -- | Bone count
| <code>"<a href="#bone">Bone</a>"[0...]</code> | -- | Bones
| `u8` | -- | Animation count
| <code>"<a href="#animation">Animation</a>"[0...]</code> | -- | Animations
| `u8` | -- | Action count
| <code>"<a href="#action">Action</a>"[0...]</code> | -- | Actions
| `char[1...]` | `{..., 0}` | String table

---

### Part

| Type | Value | Description
| -
| `u8` | [Part flags](#part-flags) | Flags
| <code>"<a href="#string">String</a>"</code> | -- | Part name
| `u8` | -- | Material index
| `u16` | -- | Vertex count
| <code>"<a href="#vertex">Vertex</a>"[0...]</code> | -- | Vertices
| <code>"<a href="#normal">Normal</a>"[0...]</code> | -- | Normals \(only present if "Has normals" flag is set\)
| `u16` | -- | Index count
| `u16[0...]` | -- | Indices
| `u8` | -- | Weight group count
| <code>"<a href="#weight-group">Weight group</a>"[0...]</code> | -- | Weight groups

##### Part flags

| Bit \(LSB first\) | Value | Description
| -
| 1 | -- | Has normals
| 2-8 | `0` | Reserved

#### Vertex

| Type | Description
| -
| `float[3]` | XYZ
| `float[2]` | UV

#### Normal

| Type | Description
| -
| `float[3]` | XYZ

#### Weight group

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Bone name
| <code>"<a href="#weight-range">Weight range</a>"</code> | Weight data

#### Weight range

| Type | Description
| -
| `u16` | Vertices to skip
| `u16` | Weight count \(0 if last range\)
| `u8[0...]` | Weights

{:.note}
> **Note:**
> Weights in Blender are stored as floats from 0.0 to 1.0.
> The P3M exporter multiplies each weight by 256 and rounds it.
> Weights with a value of 0 are omitted and the remaining non-zero weights are decremented by 1.
> To read in weights, add 1, then divide by 256.0.

---

### Material

| Type | Value | Description
| -
| `u8` | [Material render mode](#material-render-mode) | Render mode
| `u8` | -- | Texture index \(255 for none\)
| `u8[4]` | -- | RGBA color
| `u8[3]` | -- | RGB emission
| `u8` | -- | Shading

{:.note}
> **Note:**
> The 'shading' value determines how directional light is.
> The lower the value, the more light is evenly distributed.

##### Material render mode

| Name | Value
| -
| `P3M_MATRENDMODE_NORMAL` | 0
| `P3M_MATRENDMODE_ADD` | 1

---

### Texture

| Type | Value | Description
| -
| `u8` | [Texture type](#texture-type) | Texture type
| <code>{"<a href="#embedded-texture">Embedded texture</a>"|"<a href="#external-texture">External texture</a>"}[0...]</code> | -- | Texture data

##### Texture type

| Name | Value
| -
| `P3M_TEXTYPE_EMBEDDED` | 0
| `P3M_TEXTYPE_EXTERNAL` | 1

#### Embedded texture

| Type | Value | Description
| -
| `u32` | -- | Data size
| `u8[...]` | [PTF texture]({{ page.dir }}../ptf/) | Data

#### External texture

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Resource path

---

### Bone

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Name
| `float[3]` | Head XYZ
| `float[3]` | Tail XYZ
| `u8` | Child count

---

### Animation

| Type | Description
| -
| <code>"<a href="#string">String</a>"</code> | Name
| `u8` | Action count
| <code>"<a href="#animation-action">Animation action</a>"</code> | Action reference

#### Animation action

| Type | Description
| -
| `u8` | Action index
| `float` | Speed multiplier
| `u16` | Start frame
| `u16` | End frame

---

### Action

| Type | Value | Description
| -
| `u32` | -- | Microseconds per frame
| `u8` | [Action part list mode](#action-part-list-mode) | Part list mode
| `u8` | -- | Part list length
| <code>"<a href="#string">String</a>"[0...]</code> | -- | Part list
| `u8` | -- | Action data list length
| <code>"<a href="#action-data">Action data</a>"[0...]</code> | -- | Action data

##### Action part list mode

| Name | Value
| -
| `P3M_ACTPARTVIS_DEFAULTWHITE` | 0
| `P3M_ACTPARTVIS_DEFAULTBLACK` | 1
| `P3M_ACTPARTVIS_WHITE` | 2
| `P3M_ACTPARTVIS_BLACK` | 3

{:.note}
> **Note:**
> The modes with "DEFAULT" in the name use the part visibility mask instead of starting with all or none.

#### Action data

| Type | Value | Description
| -
| <code>"<a href="#string">String</a>"</code> | -- | Bone
| `u8` | -- | Translation keyframe count
| `u8` | -- | Rotation keyframe count
| `u8` | -- | Scale keyframe count
| `u8[0...]` | -- | Translation keyframe frame skips
| `u8[0...]` | -- | Rotation keyframe frame skips
| `u8[0...]` | -- | Scale keyframe frame skips
| `u8[0...]` | [Action interpolation mode](#action-interpolation-mode) | Translation keyframe interpolation modes
| `u8[0...]` | [Action interpolation mode](#action-interpolation-mode) | Rotation keyframe interpolation modes
| `u8[0...]` | [Action interpolation mode](#action-interpolation-mode) | Scale keyframe interpolation modes
| `float[0...][3]` | -- | Translation keyframes
| `float[0...][3]` | -- | Rotation keyframes
| `float[0...][3]` | -- | Scale keyframes

{:.note}
> **Note:**
> In Blender, a keyframe's interpolation type is used to transition from that keyframe to the next.
> In P3M, a keyframe's interpolation mode is used to transition from the previous keyframe to that keyframe.
> The P3M exporter will start with the interpolation mode from the last keyframe before the start of the action.
> If there are no keyframes before the start of the action, the exporter will start with 'LINEAR'.

##### Action interpolation mode

| Name | Value
| -
| `P3M_ACTINTERP_NONE` | 0
| `P3M_ACTINTERP_LINEAR` | 1

---

### String

| Type | Description
| -
| `u16` | Offset in string table
