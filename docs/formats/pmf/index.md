---
section: File Format Documentation
title: PMF
description: Compiled maps
next: pmp
---

# Table of contents

- [Format](#format)
    - [Header](#header)
    - [Data](#data)
        - [Level data](#level-data)
            - [Level flags](#level-flags)
            - [Level chunk count](#level-chunk-count)
            - [Level chunk sizes](#level-chunk-sizes)
            - [Level chunk data](#level-chunk-data)
        - [Chunk index](#chunk-index)
            - [Chunk index bits](#chunk-index-bits)
        - [Common level data](#common-level-data)
        - [Client level data](#client-level-data)
        - [Server level data](#server-level-data)
        - [Sound environment](#sound-environment)
        - [Weather environment](#weather-environment)
        - [Sky environment](#sky-environment)
            - [Sky environment flags](#sky-environment-flags)
        - [Gravity environment](#gravity-environment)
        - [Common chunk data](#common-chunk-data)
        - [Client chunk data](#client-chunk-data)
        - [Server chunk data](#server-chunk-data)
        - [Region](#region)
        - [Environment region](#environment-region)
        - [Material](#material)
            - [Material flags](#material-flags)
            - [Material render mode](#material-render-mode)
        - [Client-side material](#client-side-material)
            - [Client-side material wave info](#client-side-material-wave-info)
        - [Physics material](#physics-material)
            - [Physics material flags](#physics-material-flags)
        - [Sound material](#sound-material)
        - [Lightmap](#lightmap)
        - [Vertex](#vertex)
        - [Dynamic light](#dynamic-light)
            - [Dynamic light flags](#dynamic-light-flags)
        - [Client-side dynamic light](#client-side-dynamic-light)
            - [Client-side dynamic light lightmap layer](#client-side-dynamic-light-lightmap-layer)
        - [Fast light](#fast-light)
            - [Fast light flags](#fast-light-flags)
        - [Client-side fast light](#client-side-fast-light)
            - [Client-side fast light vertex range](#client-side-fast-light-vertex-range)
        - [Cube](#cube)
            - [Cube flags and type](#cube-flags-and-type)
            - [Cube type](#cube-type)
        - [Client-side cube](#client-side-cube)
        - [Server-side cube](#server-side-cube)
        - [Parent cube data](#parent-cube-data)
            - [Parent cube flags](#parent-cube-flags)
        - [Geometry cube data](#geometry-cube-data)
        - [Client-side geometry cube data](#client-side-geometry-cube-data)
            - [Client-side geometry cube face bits](#client-side-geometry-cube-face-bits)
        - [Extended geometry cube data](#extended-geometry-cube-data)
            - [Extended geometry cube point bits](#extended-geometry-cube-point-bits)
        - [Client-side extended geometry cube data](#client-side-extended-geometry-cube-data)
        - [Cube visibility data](#cube-visibility-data)
            - [Cube visibility data chunk](#cube-visibility-data-chunk)
        - [Cube lighting data](#cube-lighting-data)
            - [Cube lighting data light reference](#cube-lighting-data-light-reference)
        - [Cube pathfinding data](#cube-pathfinding-data)
            - [Cube pathfinding data attribute](#cube-pathfinding-data-attribute)
        - [String](#string)
- [Entities]({{ page.dir }}entities/)
- [Extensions]({{ page.dir }}extensions/)

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
| `u8` | 0 | Major version
| `u64` | -- | Creation time as a UTC Unix timestamp
| `char[1...]` | `{..., 0}` | Name
| `char[1...]` | `{..., 0}` | Description
| `char[1...]` | `{..., 0}` | Authors
| `char[1...]` | `{..., 0}` | Compiler info
| `u8` | 0..32 | Gamemode count
| `char[1..16]` × "Gamemode count" | `{..., 0}` | Gamemode names

---

### Data

| Type | Value | Description
| -
| `u32` | -- | String table size
| `char` × "String table size" | -- | String table
| `u32` | -- | Embedded resource archive size
| `u8` × "Embedded resource archive size" | [PAF archive]({{ page.dir }}../paf/) | Embedded resources
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
| `u32` | -- | Size of compressed client data
| `u32` | -- | Size of compressed server data
| `u32` | -- | Size of decompressed common data
| `u32` | -- | Size of decompressed client data
| `u32` | -- | Size of decompressed server data
| `u8` × "Size of decompressed common data" | [Common level data](#common-level-data) | Common data
| `u8` × "Size of decompressed client data" | [Client level data](#client-level-data) | Client data
| `u8` × "Size of decompressed server data" | [Server level data](#server-level-data) | Server data
| `u8` | -- | Chunk size \(2<sup>n</sup>\)
| `u32` | [Level chunk count](#level-chunk-count) | Chunk count
| [Chunk index](#chunk-index) | -- | Center chunk
| [Level chunk sizes](#level-chunk-sizes) × 1... | -- | Chunk data sizes \(ordered by `[Y][X][Z]`\)
| [Level chunk data](#level-chunk-data) × 1... | -- | Chunk data \(ordered by `[Y][X][Z]`\)

##### Level flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..3 | 0 | Reserved
| 2 | -- | Keep players' velocity
| 1 | -- | Keep players' chunk offset
| 0 | -- | Keep players' in-chunk offset

##### Level chunk count

| Bits \(MSB to LSB\) | Description
| -
| 31..24 | Chunk Y count minus 1
| 23..12 | Chunk X count minus 1
| 11..0 | Chunk Z count minus 1

##### Level chunk sizes

| Type | Description
| -
| `u32` | Size of compressed common chunk data
| `u32` | Size of compressed client chunk data
| `u32` | Size of compressed server chunk data
| `u32` | Size of decompressed common chunk data
| `u32` | Size of decompressed client chunk data
| `u32` | Size of decompressed server chunk data

##### Level chunk data

| Type | Value | Description
| -
| `u8` × "Size of compressed common chunk data" in respective [Level chunk sizes](#level-chunk-sizes) | Compressed [Common chunk data](#common-chunk-data) | Common chunk data
| `u8` × "Size of compressed client chunk data" in respective [Level chunk sizes](#level-chunk-sizes) | Compressed [Client chunk data](#client-chunk-data) | Client chunk data
| `u8` × "Size of compressed server chunk data" in respective [Level chunk sizes](#level-chunk-sizes) | Compressed [Server chunk data](#server-chunk-data) | Server chunk data

---

### Chunk index

| Type | Value | Description
| -
| `u32` | [Chunk index bits](#chunk-index-bits) | Chunk index

##### Chunk index bits

| Bits \(MSB to LSB\) | Description
| -
| 31..24 | Y
| 23..12 | X
| 11..0 | Z

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
| `u16` | Sound material count
| [Sound material](#sound-material) × "Physics sound count" | Sound materials
| [String](#string) | Air physics material
| `u8` | Weather environment count
| [Weather environment](#weather-environment) × "Weather environment count" | Weather environments
| `u8` | Gravity environment count
| [Gravity environment](#gravity-environment) × "Gravity environment count" | Gravity environments
| [String](#string) | Default weather environment
| [String](#string) | Default gravity environment

### Client level data

| Type | Description
| -
| `u32` | String table size
| `char` × "String table size" | String table
| `u8` | Sound environment count
| [Sound environment](#sound-environment) × "Sound environment count" | Sound environments
| `u8` | Sky environment count
| [Sky environment](#sky-environment) × "Sky environment count" | Sky environments
| [String](#string) | Default sound environment
| [String](#string) | Default sky environment
| [Client-side material](#client-side-material) × "Material count" in [Common level data](#common-level-data) | Client-side materials

### Server level data

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
| [String](#string) | Name
| `float` | Low pass filter amount
| `float` | High pass filter amount
| `float` | Reverb delay
| `float` | Reverb feedback
| `float` | Reverb mix
| `float` | Reverb low pass filter amount
| `float` | Reverb high pass filter amount

### Weather environment

| Type | Description
| -
| [String](#string) | Name
| `float[3]` | XYZ wind direction and velocity
| `u32` | Wind direction random seed
| `float[3]` | XYZ wind direction randomness
| `float` | Wind direction noise speed
| `u32` | Wind velocity random seed
| `float` | Wind velocity randomness
| `float` | Wind velocity noise speed

### Sky environment

| Type | Value | Description
| -
| [String](#string) | Name
| `u8` | [Sky environment flags](#sky-environment-flags) | Flags
| [String](#string) | -- | +X skybox material
| [String](#string) | -- | +Y skybox material
| [String](#string) | -- | +Z skybox material
| [String](#string) | -- | -X skybox material
| [String](#string) | -- | -Y skybox material
| [String](#string) | -- | -Z skybox material
| [String](#string) | -- | Top cloud layer material
| [String](#string) | -- | Bottom cloud layer material
| [Chunk index](#chunk-index) | -- | 3D skybox chunk

##### Sky environment flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..1 | 0 | Reserved
| 0 | -- | 3D skybox

### Gravity environment

| Type | Description
| -
| [String](#string) | Name
| `float[3]` | XYZ gravity

---

### Common chunk data

| Type | Value | Description
| -
| `u32` | -- | String table size
| `char` × "String table size" | -- | String table
| `u8` | -- | Used material count
| [String](#string) × "Used material count" | -- | Used material names
| `u8` | -- | Used physics material count
| [String](#string) × "Used physics material count" | -- | Used physics material names
| `u8` | -- | Used sound material count
| [String](#string) × "Used sound material count" | -- | Used sound material names
| `u8` | -- | Weather environment region count
| [Environment region](#environment-region) × "Weather environment region count" | -- | Weather environment regions
| `u8` | -- | Gravity environment region count
| [Environment region](#environment-region) × "Gravity environment region count" | -- | Gravity environment regions
| `u8` | -- | Dynamic light count
| [Dynamic light](#dynamic-light) × "Dynamic light count" | -- | Dynamic lights
| `u8` | -- | Fast light count
| [Fast light](#fast-light) × "Fast light count" | -- | Fast lights
| `u32` | 1... | Cube count
| [Cube](#cube) × "Cube count" | -- | Cubes

### Client chunk data

| Type | Description
| -
| `u8` | Sound environment region count
| [Environment region](#environment-region) × "Sound environment region count" | Sound environment regions
| `u8` | Sky environment region count
| [Environment region](#environment-region) × "Sky environment region count" | Sky environment regions
| `u8` | Lightmap count
| [Lightmap](#lightmap) × "Lightmap count" | Lightmaps
| `u32` | Vertex count
| [Vertex](#vertex) × "Vertex count" | Vertex data
| [Client-side dynamic light](#client-side-dynamic-light) × "Dynamic light count" in respective [Common chunk data](#common-chunk-data) | Client-side dynamic light data
| [Client-side fast light](#client-side-fast-light) × "Fast light count" in respective [Common chunk data](#common-chunk-data) | Client-side fast light data
| [Client-side cube](#client-side-cube) × "Cube count" in respective [Common chunk data](#common-chunk-data) | Client-side cube data

### Server chunk data

| Type | Description
| -
| `u32` | String table size
| `char` × "String table size" | String table
| `u8` | Load region count
| [Region](#region) × "Region count" | Load region data
| [Server-side cube](#server-side-cube) × "Cube count" in respective [Common chunk data](#common-chunk-data) | Server-side cube data
| `u32` | Chunk entity count
| [Entity]({{ page.dir }}entities/#entity) × "Chunk entity count" | Chunk entities

---

### Region

| Type | Description
| -
| `float[3]` | \(+X, +Y, +Z\) corner
| `float[3]` | \(-X, -Y, -Z\) corner
| `u32` | Other active chunk count
| [Chunk index](#chunk-index) × "Other active chunk count" | Chunk indices

---

### Environment region

| Type | Description
| -
| `float[3]` | \(+X, +Y, +Z\) corner
| `float[3]` | \(-X, +Y, +Z\) corner
| `float[3]` | \(+X, +Y, -Z\) corner
| `float[3]` | \(-X, +Y, -Z\) corner
| `float[3]` | \(+X, -Y, +Z\) corner
| `float[3]` | \(-X, -Y, +Z\) corner
| `float[3]` | \(+X, -Y, -Z\) corner
| `float[3]` | \(-X, -Y, -Z\) corner
| [String](#string) | Environment name

---

### Material

| Type | Value | Description
| -
| [String](#string) | -- | Name
| [String](#string) | -- | User-defined type
| `u8` | [Material flags](#material-flags) | Flags
| `u8` | [Material render mode](#material-render-mode) | Render mode

##### Material flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..2 | 0 | Reserved
| 1 | -- | Is liquid
| 0 | -- | Is transparent

##### Material render mode

| Name | Value
| -
| `ENTMAT_RENDMODE_NORMAL` | 0
| `ENTMAT_RENDMODE_ADD` | 1

### Client-side material

| Type | Description
| -
| [String](#string) | Texture \(untextured if empty\)
| `u8` | Extra texture count
| [String](#string) × "Extra texture count" | Extra textures
| `u32` | Texture advance time in microseconds
| `float[2]` | Texture UV scroll
| `u8[3]` | RGB color
| `u8` | Alpha \(ignored unless 'Is transparent' flag is set\)
| `u8[3]` | RGB emission
| `u8` | Shading
| `u8` | Shine
| [String](#string) | Matcap texture
| [Client-side material wave info](#client-side-material-wave-info) | Wave info \(ignored unless 'Is liquid' flag is set\)

##### Client-side material wave info

| Type | Description
| -
| `float[3]` | XYZ velocity
| `float` | Wind influence
| `float` | Offset
| `float` | Scale

---

### Physics material

| Type | Value | Description
| -
| [String](#string) | -- | Name
| `u8` | [Physics material flags](#physics-material-flags) | Flags
| `float` | -- | Friction \(if 'not solid' flag is not set\) or max speed \(if 'not solid' flag is set\)
| `float` | -- | Traction \(ignored if 'not solid' flag is set\)
| `float` | -- | Bounce \(ignored if 'not solid' flag is set\)
| `float` | -- | Minimum speed to cause damage
| `float` | -- | Base damage
| `float` | -- | Extra damage per meter per second

##### Physics material flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..1 | 0 | Reserved
| 0 | -- | Not solid

---

### Sound material

| Type | Description
| -
| `float` | Volume dampening
| `float` | Frequency dampening

---

### Lightmap

| Type | Description
| -
| u8 | Size \(2<sup>n</sup>\)
| `u8[3]` × 2<sup>"Size"</sup> | RGB luxels

---

### Vertex

| Type | Description
| -
| `float[3]` | XYZ
| `float[2]` | Texture UV
| `float[2]` | Lightmap UV

---

### Dynamic light

| Type | Value | Description
| -
| `u8` | [Dynamic light flags](#dynamic-light-flags) | Flags
| `u32` | -- | Global ID

##### Dynamic light flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..2 | 0 | Reserved
| 1 | -- | Preserve
| 0 | -- | Enable

### Client-side dynamic light

| Type | Description
| -
| `u8[3]` | RGB color
| `u8` | Affected lightmap count
| [Client-side dynamic light lightmap layer](#client-side-dynamic-light-lightmap-layer) × "Affected lightmap count" | Lightmap layers

##### Client-side dynamic light lightmap layer

| Type | Description
| -
| `u8` | Target lightmap
| `u8[3]` × 2<sup>"Size" in respective [Lightmap](#lightmap)</sup> | RGB luxels

---

### Fast light

| Type | Value | Description
| -
| `u8` | [Fast light flags](#fast-light-flags) | Flags
| `u8` | -- | Initial intensity
| `u32` | -- | Global ID

##### Fast light flags

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..2 | 0 | Reserved
| 1 | -- | Preserve
| 0 | -- | Enable

### Client-side fast light

| Type | Description
| -
| `u8[3]` | RGB color
| `u32` | Range count
| [Client-side fast light vertex range](#client-side-fast-light-vertex-range) × "Range count" | Ranges

##### Client-side fast light vertex range

| Type | Description
| -
| `u32` | Vertices to skip
| `u32` | Multiplier count
| `u8` × "Multiplier count" | Multipliers

---

### Cube

| Type | Value | Description
| -
| u8 | [Cube flags and type](#cube-flags-and-type) | Flags and type
| [Cube visibility data](#cube-chunk-data) × 0..1 | -- | Visibility data \(only present if 'has visibility data' flag is set\)
| '[Parent cube data](#parent-cube-data), [Geometry cube data](#geometry-cube-data), or [Extended geometry cube data](#extended-geometry-cube-data)' × 0..1 | -- | Cube data \(dependent on cube type, not present if type is `PMF_CUBE_EMPTY`\)

##### Cube flags and type

| Bits \(MSB to LSB\) | Value | Description
| -
| 7 | -- | Draw backfaces
| 6 | -- | Has pathfinding data
| 5 | -- | Has lighting data
| 4 | -- | Has visibility data
| 3..0 | [Cube type](#cube-type) | Type

##### Cube type

| Name | Value
| -
| `PMF_CUBE_EMPTY` | 0
| `PMF_CUBE_PARENT` | 1
| `PMF_CUBE_GEOMETRY` | 2
| `PMF_CUBE_EXTGEOMETRY` | 3

### Client-side cube

| Type | Description
| -
| [Cube lighting data](#cube-lighting-data) × 0..1 | Lighting data \(only present if 'has lighting data' flag is set\)
| '[Client-side geometry cube data](#client-side-geometry-cube-data) or [Client-side extended geometry cube data](#client-side-extended-geometry-cube-data)' × 0..1 | Client-side Cube data \(dependent on cube type, only present if type is `PMF_CUBE_GEOMETRY` or `PMF_CUBE_EXTGEOMETRY`\)

### Server-side cube

| Type | Description
| -
| [Cube pathfinding data](#cube-pathfinding-data) × 0..1 | Pathfinding data \(only present if 'has pathfinding data' flag is set\)

---

### Parent cube data

| Type | Value | Description
| -
| `u8` | [Parent cube flags](#parent-cube-flags) | Flags
| `u32` × 0..1 | -- | (+X, +Y, +Z) child index (only present if 'has (+X, +Y, +Z) child' flag is set)
| `u32` × 0..1 | -- | (-X, +Y, +Z) child index (only present if 'has (-X, +Y, +Z) child' flag is set)
| `u32` × 0..1 | -- | (+X, +Y, -Z) child index (only present if 'has (+X, +Y, -Z) child' flag is set)
| `u32` × 0..1 | -- | (-X, +Y, -Z) child index (only present if 'has (-X, +Y, -Z) child' flag is set)
| `u32` × 0..1 | -- | (+X, -Y, +Z) child index (only present if 'has (+X, -Y, +Z) child' flag is set)
| `u32` × 0..1 | -- | (-X, -Y, +Z) child index (only present if 'has (-X, -Y, +Z) child' flag is set)
| `u32` × 0..1 | -- | (+X, -Y, -Z) child index (only present if 'has (+X, -Y, -Z) child' flag is set)
| `u32` × 0..1 | -- | (-X, -Y, -Z) child index (only present if 'has (-X, -Y, -Z) child' flag is set)

##### Parent cube flags

| Bits \(MSB to LSB\) | Description
| -
| 7 | Has (-X, -Y, -Z) child
| 6 | Has (+X, -Y, -Z) child
| 5 | Has (-X, -Y, +Z) child
| 4 | Has (+X, -Y, +Z) child
| 3 | Has (-X, +Y, -Z) child
| 2 | Has (+X, +Y, -Z) child
| 1 | Has (-X, +Y, +Z) child
| 0 | Has (+X, +Y, +Z) child

---

### Geometry cube data

| Type | Description
| -
| `u8` | Material
| `u8` | Physics material
| `u8` | Sound material

### Client-side geometry cube data

| Type | Value | Description
| -
| `u8` | -- | Lightmap
| `u32` | -- | Index of first quad's first vertex
| `u8` | [Client-side geometry cube face bits](#client-side-geometry-cube-face-bits) | 'Has face' bits

##### Client-side geometry cube face bits

| Bits \(MSB to LSB\) | Value | Description
| -
| 7..6 | 0 | Reserved
| 5 | -- | -Z has face
| 4 | -- | -Y has face
| 3 | -- | -X has face
| 2 | -- | +Z has face
| 1 | -- | +Y has face
| 0 | -- | +X has face

---

### Extended geometry cube data

| Type | Value | Description
| -
| `u8` | -- | +X material
| `u8` | -- | +Y material
| `u8` | -- | +Z material
| `u8` | -- | -X material
| `u8` | -- | -Y material
| `u8` | -- | -Z material
| `u8` | -- | +X physics material
| `u8` | -- | +Y physics material
| `u8` | -- | +Z physics material
| `u8` | -- | -X physics material
| `u8` | -- | -Y physics material
| `u8` | -- | -Z physics material
| `u8` | -- | Sound material
| `u8` | [Extended geometry cube point bits](#extended-geometry-cube-point-bits) | 'Point moved' bits
| `float[3]` × 0..1 | -- | (+X, +Y, +Z) XYZ (only present if '(+X, +Y, +Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (-X, +Y, +Z) XYZ (only present if '(-X, +Y, +Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (+X, +Y, -Z) XYZ (only present if '(+X, +Y, -Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (-X, +Y, -Z) XYZ (only present if '(-X, +Y, -Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (+X, -Y, +Z) XYZ (only present if '(+X, -Y, +Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (-X, -Y, +Z) XYZ (only present if '(-X, -Y, +Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (+X, -Y, -Z) XYZ (only present if '(+X, -Y, -Z) point moved' flag is set)
| `float[3]` × 0..1 | -- | (-X, -Y, -Z) XYZ (only present if '(-X, -Y, -Z) point moved' flag is set)

##### Extended geometry cube point bits

| Bits \(MSB to LSB\) | Description
| -
| 7 | (-X, -Y, -Z) point moved
| 6 | (+X, -Y, -Z) point moved
| 5 | (-X, -Y, +Z) point moved
| 4 | (+X, -Y, +Z) point moved
| 3 | (-X, +Y, -Z) point moved
| 2 | (+X, +Y, -Z) point moved
| 1 | (-X, +Y, +Z) point moved
| 0 | (+X, +Y, +Z) point moved

### Client-side extended geometry cube data

| Type | Description
| -
| `u32` | Index of first triangle's first vertex
| `u8` | +X lightmap
| `u8` | +Y lightmap
| `u8` | +Z lightmap
| `u8` | -X lightmap
| `u8` | -Y lightmap
| `u8` | -Z lightmap
| `u8` | +X triangle count
| `u8` | +Y triangle count
| `u8` | +Z triangle count
| `u8` | -X triangle count
| `u8` | -Y triangle count
| `u8` | -Z triangle count

---

### Cube visibility data

| Type | Description
| -
| `u32` | Other visible cube count
| `u32` × "Other visible cube count" | Visible cube indices
| `u32` | Other visible chunk count
| [Cube visibility data chunk](#cube-visibility-data-chunk) × "Other visible chunk count" | Cube visibility data chunk

##### Cube visibility data chunk

| Type | Description
| -
| [Chunk index](#chunk-index) | Chunk index
| `u32` | Visible cube count (0 means all)
| `u32` × "Visible cube count" | Cube indices

---

### Cube lighting data

| Type | Description
| -
| `u8[3]` | Base light RGB color
| `u8` | Dynamic light count
| [Cube lighting data light reference](#cube-lighting-data-light-reference) × "Dynamic light count" | Dynamic light references
| `u8` | Fast light count
| [Cube lighting data light reference](#cube-lighting-data-light-reference) × "Fast light count" | Fast light references

##### Cube lighting data light reference

| Type | Description
| -
| `u8` | Index
| `u8` | Amount

---

### Cube pathfinding data

| Type | Description
| -
| `u8` | Attribute count
| [Cube pathfinding data attribute](#cube-pathfinding-data-attribute) × "Attribute count" | Attributes

##### Cube pathfinding data attribute

| Type | Description
| -
| [String](#string) | Name
| `float[3]` | XYZ direction to face

---

### String

| Type | Description
| -
| `u32` | Offset in respective string table
