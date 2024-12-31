---
title: PMF
description: Compiled maps
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
| [Header](#header) | File header
| [Data](#data) | Map data

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
| `char[1..16]` × 0..32 | `{..., 0}` | Gamemode names

---

### Data

| Type | Value | Description
| -
| `u32` | -- | String table size
| `char` × "String table size" | -- | String table
| `u32` | -- | Embedded resource archive size
| `u8` × "Embedded resource archive size" | [PFA archive]({{ page.dir }}../pfa/) | Embedded resources
| `u16` | -- | Extension count
| `u32` × "Extension count" | -- | Extension sizes
| [Extension](#extension) × "Extension count" | -- | Extensions
| `u8` | -- | Level count
| `u32` × "Level count" | -- | Level data sizes
| [Level data](#level-data) × "Level count" | -- | Levels
| `u32` | -- | Global entity count
| [Entity]({{ page.dir }}entities/#entity) × "Global entity count" | -- | Global entities

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
| `u8` × "Size of uncompressed common data" | [Common level data](#common-level-data) | Common data
| `u8` × "Size of uncompressed client-side data" | [Client-side level data](#client-side-level-data) | Client-side data
| `u8` × "Size of uncompressed server-side data" | [Server-side level data](#server-side-level-data) | Server-side data
| `u32` | [Level sector count](#level-sector-count) | Sector count
| [Sector index](#sector-index) | -- | Center sector
| [Level sector sizes](#level-sector-sizes) × 1... | -- | Sector data sizes (ordered by `[Y][X][Z]`)
| [Level sector data](#level-sector-data) × 1... | -- | Sector data (ordered by `[Y][X][Z]`)

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
| `u8[]` | Compressed [Common sector data](#common-sector-data) | Common sector data
| `u8[]` | Compressed [Client-side sector data](#client-side-sector-data) | Common sector data
| `u8[]` | Compressed [Server-side sector data](#server-side-sector-data) | Common sector data

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
| `char` × "String table size" | String table
| `u16` | Material count
| [Material](#material) × "Material count" | Materials
| `u16` | Physics material count
| [Physics material](#physics-material) × "Physics material count" | Physics materials
| [Sound environment](#sound-environment) | Default sound environment
| [Weather environment](#weather-environment) | Default weather environment
| [Gravity environment](#gravity-environment) | Default gravity environment

### Client-side level data

| Type | Description
| -
| `u32` | String table size
| `char` × "String table size" | String table
| [Client-side material](#client-side-material) × "Material count" in [Common level data](#common-level-data) | Client-side materials

### Server-side level data

| Type | Description
| -
| `u32` | String table size
| `char` × "String table size" | String table
| `u32` | Level-wide entity count
| [Entity]({{ page.dir }}entities/#entity) × "Level-wide entity count" | Level-wide entities

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

### Common sector data

| Type | Value | Description
| -
| 

### Client-side sector data

| Type | Value | Description
| -
| 

### Server-side sector data

| Type | Value | Description
| -
| 

---

### Region

| Type | Value | Description
| -
| 

---

### Material

| Type | Value | Description
| -
| 

##### Material flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

##### Material render mode

| Name | Value
| -
| `ENTMAT_RENDMODE_NORMAL` | 0
| `ENTMAT_RENDMODE_ADD` | 1


### Client-side material

| Type | Value | Description
| -
| 

##### Client-side material wave info

| Type | Description
| -
| 

---

### Physics material

| Type | Value | Description
| -
| 

##### Physics material flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

---

### Lightmap

| Type | Value | Description
| -
| 

---

### Vertex

| Type | Description
| -
| 

---

### Dynamic light

| Type | Value | Description
| -
| 

##### Dynamic light flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

### Client-side dynamic light

| Type | Description
| -
| 

##### Client-side dynamic light lightmap layer

| Type | Description
| -
| 

---

### Fast light

| Type | Value | Description
| -
| 

##### Fast light flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

### Client-side fast light

| Type | Value | Description
| -
| 

##### Client-side fast light vertex range

| Type | Description
| -
| 

---

### Cube

| Type | Value | Description
| -
| 

##### Cube flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

### Client-side cube

| Type | Value | Description
| -
| 

### Server-side cube

| Type | Value | Description
| -
| 

---

### Parent cube data

| Type | Value | Description
| -
| 

##### Parent cube flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

---

### Geometry cube data

| Type | Value | Description
| -
| 

### Extended geometry cube data

| Type | Value | Description
| -
| 

### Client-side geometry cube data

| Type | Value | Description
| -
| 

##### Client-side geometry cube face bits

| Bits \(LSB to MSB\) | Value | Description
| -
| 

### Client-side extended geometry cube data

| Type | Value | Description
| -
| 

---

### Solid cube data

| Type | Value | Description
| -
| 

### Client-side solid cube data

| Type | Value | Description
| -
| 

---

### Dynamic cube data

| Type | Value | Description
| -
| 

##### Dynamic cube point flags

| Bits \(LSB to MSB\) | Value | Description
| -
| 

### Client-side dynamic cube data

| Type | Value | Description
| -
| 

---

### Cube chunk data

| Type | Description
| -
| 

##### Cube chunk data visibility data

| Type | Description
| -
| 

---

### Cube lighting data

| Type | Value | Description
| -
| 

##### Cube lighting data lights

| Type | Value | Description
| -
| 

---

### Cube pathfinding data

| Type | Description
| -
| 

##### Cube pathfinding data attribute

| Type | Description
| -
| 

---

### String

| Type | Description
| -
| `u32` | Offset in respective string table
