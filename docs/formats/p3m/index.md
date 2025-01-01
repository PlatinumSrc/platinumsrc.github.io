---
title: P3M
description: 3D models
next: ptf
---

# Table of contents

- [Format](#format)
    - [Header](#header)
        - [Header flags](#header-flags)
    - [Data](#data)
        - [Part](#part)
            - [Part flags](#part-flags)
            - [Vertex](#vertex)
            - [Normal](#normal)
            - [Weight group](#weight-group)
            - [Weight range](#weight-range)
        - [Material](#material)
        - [Material render mode](#material-render-mode)
        - [Texture](#texture)
            - [Texture type](#texture-type)
            - [Embedded texture](#embedded-texture)
            - [External texture](#external-texture)
        - [Bone](#bone)
        - [Animation](#animation)
            - [Animation action](#animation-action)
        - [Action](#action)
            - [Action part list mode](#action-part-list-mode)
            - [Action data](#action-data)
            - [Action interpolation mode](#action-interpolation-mode)
        - [String](#string)

---

## Format

- Current version is `0.0`
- File extension is `.p3m`
- Data is little endian

| Type | Description
| -
| [Header](#header) | File header
| [Data](#data) | Model data

---

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', '3', 'M'}` | Header magic
| `u8` | 0 | Major version
| `u8` | [Header flags](#header-flags) | Flags

##### Header flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..0 | 0 | Reserved

---

### Data

| Type | Value | Description
| -
| `u8` | -- | Part count
| `u8[0..32]` | -- | Part visibility bitmask \(Bytes ordered from least to most significant\)
| [Part](#part) × "Part count" | -- | Parts
| `u8` | -- | Material count
| [Material](#material) × "Material count" | -- | Materials
| `u8` | -- | Texture count
| [Texture](#texture) × "Texture count" | -- | Textures
| `u8` | -- | Bone count
| [Bone](#bone) × "Bone count" | -- | Bones
| `u8` | -- | Animation count
| [Animation](#animation) × "Animation count" | -- | Animations
| `u8` | -- | Action count
| [Action](#action) × "Action count" | -- | Actions
| `char[1...]` | `{..., 0}` | String table

---

### Part

| Type | Value | Description
| -
| `u8` | [Part flags](#part-flags) | Flags
| [String](#string) | -- | Part name
| `u8` | -- | Material index
| `u16` | -- | Vertex count
| [Vertex](#vertex) × "Vertex count" | -- | Vertices
| [Normal](#normal) × "Vertex count" or 0 | -- | Normals \(only present if "Has normals" flag is set\)
| `u16` | -- | Index count
| `u16` × "Index count" | -- | Indices
| `u8` | -- | Weight group count
| [Weight group](#weight-group) × "Weight group count" | -- | Weight groups

##### Part flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..1 | 0 | Reserved
| 0 | -- | Has normals

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
| [String](#string) | Bone name
| [Weight range](#weight-range) × 1... | Weight data \(terminated by a range with a "Weight count" of 0\)

#### Weight range

| Type | Description
| -
| `u16` | Vertices to skip
| `u16` | Weight count \(0 if last range\)
| `u8` × "Weight count" | Weights

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
| `u8` | -- | Extra texture count
| `u8` × "Extra texture count" | -- | Extra texture indices
| `u32` | -- | Texture advance time in microseconds
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
| [Embedded texture](#embedded-texture) or [External texture](#external-texture) | -- | Texture data

##### Texture type

| Name | Value
| -
| `P3M_TEXTYPE_EMBEDDED` | 0
| `P3M_TEXTYPE_EXTERNAL` | 1

#### Embedded texture

| Type | Value | Description
| -
| `u32` | -- | Data size
| `u8` × "Data size" | [PTF texture]({{ page.dir }}../ptf/) | Data

#### External texture

| Type | Description
| -
| [String](#string) | Resource path

---

### Bone

| Type | Description
| -
| [String](#string) | Name
| `float[3]` | Head XYZ
| `float[3]` | Tail XYZ
| `u8` | Child count

---

### Animation

| Type | Description
| -
| [String](#string) | Name
| `u8` | Action count
| [Animation action](#animation-action) × "Action count" | Action reference

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
| [String](#string) × "Part list length" | -- | Part list
| `u8` | -- | Action data list length
| [Action data](#action-data) × "Action data list length" | -- | Action data

##### Action part list mode

| Name | Value
| -
| `P3M_ACTPARTLISTMODE_DEFAULTWHITE` | 0
| `P3M_ACTPARTLISTMODE_DEFAULTBLACK` | 1
| `P3M_ACTPARTLISTMODE_WHITE` | 2
| `P3M_ACTPARTLISTMODE_BLACK` | 3

{:.note}
> **Note:**
> The modes with "DEFAULT" in the name use the part visibility mask instead of starting with all or none.

#### Action data

| Type | Value | Description
| -
| [String](#string) | -- | Bone
| `u8` | -- | Translation keyframe count
| `u8` | -- | Rotation keyframe count
| `u8` | -- | Scale keyframe count
| `u8` × "Translation keyframe count" | -- | Translation keyframe frame skips
| `u8` × "Rotation keyframe count" | -- | Rotation keyframe frame skips
| `u8` × "Scale keyframe count" | -- | Scale keyframe frame skips
| `u8` × "Translation keyframe count" | [Action interpolation mode](#action-interpolation-mode) | Translation keyframe interpolation modes
| `u8` × "Rotation keyframe count" | [Action interpolation mode](#action-interpolation-mode) | Rotation keyframe interpolation modes
| `u8` × "Scale keyframe count" | [Action interpolation mode](#action-interpolation-mode) | Scale keyframe interpolation modes
| `float[3]` × "Translation keyframe count" | -- | XYZ translation keyframes
| `float[3]` × "Rotation keyframe count" | -- | XYZ rotation keyframes
| `float[3]` × "Scale keyframe count" | -- | XYZ scale keyframes

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
