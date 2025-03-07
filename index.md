---
title: Home
---

{%- include globals.liquid -%}

# Welcome

- Try the [online demo](/online-demo)! \(JavaScript, WASM, and WebGL2 are required\)
- Check out the [documentation](/docs)
- Take a look at the [engine](https://github.com/{{ org }}/{{ repo }}) and [website](https://github.com/{{ org }}/{{ site.domain }}) code repositories
- Indoctrinate yourself with some [propaganda](/propaganda)

{:.indent}
PlatinumSrc is a work-in-progress open source 3D game engine inspired by games and engines like Quake and GoldSrc.
The goal is to make a high-level but relatively versatile authentic retro game engine that supports a large number of platforms \(especially retro platforms\) while also being mostly uniform in API and behavior to aid in cross-platform development.
Games do not use native code and instead use PBASIC, the engine's scripting language.
This makes it easy for the engine to provide a mostly uniform environment to execute game logic.

{:.indent}
Additionally, all the files required by the game can be put into a single directory inside the `games/` directory of the PlatinumSrc instance.
The engine uses a resource manager that performs the jobs of VFS path resolution \(even going as far as to check filename case on case-insensitive platforms\), resource loading, refcounting, and garbage collection.
Mods are supported in the form of VFS overlays that can override resources.
Games can access resources in their own game folder, in other game folders, in the engine's resource folder, or in mods directly.
