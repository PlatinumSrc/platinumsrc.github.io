---
title: PMF
description: compiled maps
section: File formats
#next: 
---

# Table of contents

- [Format](#format)
    - [Header](#header)
    - [Data](#data)
        - [Level data](#level-data)
            - [Level flags](#level-flags)
            - [Level sector count](#level-sector-count)
            - [Level sector sizes](#level-sector-sizes)
            - [Level sector data](#level-sector-data)
        - [Sector index](#sector-index)
            - [Sector index bits](#sector-index-bits)
        - [Common level data](#common-level-data)
        - [Client-side level data](#client-side-level-data)
        - [Server-side level data](#server-side-level-data)
        - [Sound environment](#sound-environment)
        - [Weather environment](#weather-environment)
        - [Gravity environment](#gravity-environment)
        - [String](#string)

---

## Format

- Current version is `0.0`
- File extension is `.pmf`
- Data is little endian
- LZ4F is used for compression

| Type | Description
| -
| <code>"<a href="#header">Header</a>"</code> | File header
| <code>"<a href="#data">Data</a>"</code> | Model data

---

### Header

| Type | Value | Description
| -
| `char[3]` | `{'P', 'M', 'F'}` | Header magic
| `u8` | `0` | Major version
| `u64` | -- | Creation time as a UTC Unix timestamp
| `char[1...]` | `{..., 0}` | Name
| `char[1...]` | `{..., 0}` | Description
| `char[1...]` | `{..., 0}` | Authors
| `char[1...]` | `{..., 0}` | Compiler info
| `u8` | `0..32` | Gamemode count
| `char[1..16] × 0..32` | `{..., 0}` | Gamemode names

---

### Data

| Type | Value | Description
| -
| `u32` | -- | String table size
| `char[]` | -- | String table
| `u32` | -- | Size of embedded resource archive
| `u8[]` | [PFA archive]({{ page.dir }}../pfa/) | Embedded resources
| `u16` | -- | Extension count
| `u32[]` | -- | Extension sizes
| <code>"<a href="#extension">Extension</a>"...</code> | -- | Extensions
| `u8` | -- | Level count
| `u32[]` | -- | Level data sizes
| <code>"<a href="#level-data">Level data</a>"...</code> | -- | Levels
| `u32` | -- | Global entity count
| <code>"<a href="{{ page.dir }}entities/#entity">Entity</a>"...</code> | -- | Global entities

---

### Level data

| Type | Value | Description
| -
| `u8` | [Level flags](#level-flags) | Flags
| `u32` | -- | Size of compressed common data
| `u32` | -- | Size of compressed client-side data
| `u32` | -- | Size of compressed server-side data
| `u32` | -- | Size of uncompressed common data
| `u32` | -- | Size of uncompressed client-side data
| `u32` | -- | Size of uncompressed server-side data
| `u8[]` | Compressed <code>"<a href="#common-level-data">Common level data</a>"</code> | Common data
| `u8[]` | Compressed <code>"<a href="#client-side-level-data">Client-side level data</a>"</code> | Client-side data
| `u8[]` | Compressed <code>"<a href="#server-side-level-data">Server-side level data</a>"</code> | Server-side data
| `u32` | [Level sector count](#level-sector-count) | Sector count
| <code>"<a href="#sector-index">Sector index</a>"</code> | -- | Center sector
| <code>"<a href="#level-sector-sizes">Level sector sizes</a>"...</code> | -- | Sector data sizes (ordered by `[Y][X][Z]`)
| <code>"<a href="#level-sector-data">Level sector data</a>"...</code> | -- | Sector data (ordered by `[Y][X][Z]`)

##### Level flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 1 | -- | Keep players' in-sector offset
| 2 | -- | Keep players' sector offset
| 3 | -- | Keep players' velocity
| 4-8 | `0` | Reserved

##### Level sector count

| Bits \(LSB to MSB\) | Description
| -
| 1-12 | Sector Z count minus 1
| 13-24 | Sector X count minus 1
| 25-32 | Sector Y count minus 1

##### Level sector sizes

| Type | Description
| -
| `u32` | Size of compressed sector data
| `u32` | Size of compressed client-side sector data
| `u32` | Size of compressed server-side sector data
| `u32` | Size of uncompressed sector data
| `u32` | Size of uncompressed client-side sector data
| `u32` | Size of uncompressed server-side sector data

##### Level sector data

| Type | Value | Description
| -
| `u8[]` | Compressed <code>"<a href="#sector">Sector</a>"</code> | Sector data
| `u8[]` | Compressed <code>"<a href="#client-side-sector">Client-side sector</a>"</code> | Client-side sector data
| `u8[]` | Compressed <code>"<a href="#server-side-sector">Server-side sector</a>"</code> | Server-side sector data

---

### Sector index

| Type | Value | Description
| -
| `u32` | [Sector index bits](#sector-index-bits) | Sector index

##### Sector index bits

| Bits \(LSB to MSB\) | Description
| -
| 1-12 | Z
| 13-24 | X
| 25-32 | Y

---

### Common level data

| Type | Description
| -
| `u32` | String table size
| `char[]` | String table
| `u16` | Material count
| <code>"<a href="#material">Material</a>"...</code> | Materials
| `u16` | Physics material count
| <code>"<a href="#physics-material">Physics material</a>"...</code> | Physics materials
| <code>"<a href="#sound-environment">Sound environment</a>"</code> | Default sound environment
| <code>"<a href="#weather-environment">Weather environment</a>"</code> | Default weather environment
| <code>"<a href="#gravity-environment">Gravity environment</a>"</code> | Default gravity environment

### Client-side level data

| Type | Description
| -
| `u32` | String table size
| `char[]` | String table
| <code>"<a href="#client-side-material">Client-side material</a>"...</code> | Client-side materials

### Server-side level data

| Type | Description
| -
| `u32` | String table size
| `char[]` | String table
| `u32` | Level-wide entity count
| <code>"<a href="{{ page.dir }}entities/#entity">Entity</a>"...</code> | Level-wide entities

---

### Sound environment

| Type | Description
| -
| `float` | Low pass filter amount
| `float` | High pass filter amount
| `float` | Reverb delay
| `float` | Reverb feedback
| `float` | Reverb mix
| `float` | Reverb low pass filter amount
| `float` | Reverb high pass filter ammount

### Weather environment

| Type | Description
| -
| `float[3]` | XYZ direction and velocity
| `u32` | Direction random seed
| `float[3]` | XYZ direction randomness
| `float` | Direction noise speed
| `u32` | Velocity random seed
| `float[3]` | XYZ velocity randomness
| `float` | Velocity noise speed

### Gravity environment

| Type | Description
| -
| `float[3]` | XYZ gravity
| `float` | Drag

---

### Sector

| Type | Value | Description
| -

### Client-side sector

| Type | Value | Description
| -

### Server-side sector

| Type | Value | Description
| -

---

### Region

| Type | Value | Description
| -

---

### Material

| Type | Value | Description
| -

### Client-side material

| Type | Value | Description
| -

---

### Physics material

| Type | Value | Description
| -

---

### Lightmap

| Type | Value | Description
| -

---

### Vertex

| Type | Description
| -

---

### Dynamic light

| Type | Value | Description
| -

### Client-side dynamic light

| Type | Value | Description
| -

---

### Fast light

| Type | Value | Description
| -

### Client-side fast light

| Type | Value | Description
| -

---

### Cube

| Type | Value | Description
| -

### Client-side cube

| Type | Value | Description
| -

### Server-side cube

| Type | Value | Description
| -

---

### Parent cube data

| Type | Value | Description
| -

---

### Geometry cube data

| Type | Value | Description
| -

### Extended geometry cube data

| Type | Value | Description
| -

### Client-side geometry cube data

| Type | Value | Description
| -

### Client-side extended geometry cube data

| Type | Value | Description
| -

---

### Solid cube data

| Type | Value | Description
| -

### Client-side solid cube data

| Type | Value | Description
| -

---

### Dynamic cube data

| Type | Value | Description
| -


### Client-side dynamic cube data

| Type | Value | Description
| -

---

### Cube chunk data

| Type | Value | Description
| -

---

### Cube lighting data

| Type | Value | Description
| -

---

### Cube pathfinding data

| Type | Value | Description
| -

---

### String

| Type | Description
| -
| `u32` | Offset in respective string table
