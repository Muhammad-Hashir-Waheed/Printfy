"""
Photoreal product renders in Blender / Cycles (background mode), driven by render.mjs --blender.

    blender -b --factory-startup -P scripts/mockups/render.py -- <jobs.json>

jobs.json: { assets, width, height, samples, timings, jobs: [{ key, glb, meta, out }] }
  glb   the product scene exported from the three.js studio (scene units: 1 = 10 cm)
  meta  camera set (hero, front, high / top-down, close-up), backdrop, key-light direction and,
        per material, its physical type (paper, cardboard, cotton, ...) and optional foil mask
  out   folder for 1.jpg … 4.jpg

Look: Poly Haven studio HDRI + soft key, PBR detail maps per material type, beveled edges,
slight paper warp, real textured surface, 70 mm lens, DOF on views 3–4, AgX, light grain.
"""
import json
import math
import os
import sys
import time

import bmesh
import bpy
import numpy as np
from mathutils import Vector

ARGS = sys.argv[sys.argv.index('--') + 1:]
CFG = json.load(open(ARGS[0], encoding='utf8'))
ASSETS = CFG['assets']
W, H = CFG.get('width', 1600), CFG.get('height', 1200)
UNIT = 0.1  # metres per three.js unit
LENS = 70.0
SENSOR = 36.0

# backdrop name → table surface (texture, tint) and the colour the camera sees past it
SURFACES = {
    'warm': ('oak', (1.0, 0.97, 0.93), (0.80, 0.74, 0.66)),
    'cool': ('plaster', (1.08, 1.08, 1.1), (0.78, 0.79, 0.81)),
    'blush': ('plaster', (1.12, 1.0, 0.98), (0.84, 0.76, 0.74)),
    'sage': ('plaster', (1.0, 1.06, 0.98), (0.76, 0.80, 0.74)),
    'dark': ('plaster', (0.3, 0.29, 0.28), (0.05, 0.05, 0.05)),
    'night': ('plaster', (0.22, 0.23, 0.27), (0.03, 0.035, 0.05)),
}


def log(*a):
    print('[render.py]', *a, flush=True)


def three_to_blender(v):
    """three.js (Y up) → Blender (Z up), in metres."""
    return Vector((v[0], -v[2], v[1])) * UNIT


def three_dir(v):
    return Vector((v[0], -v[2], v[1])).normalized()


# ───────────────────────── device + render settings ─────────────────────────

def setup_device(sc):
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for backend in ('OPTIX', 'CUDA', 'HIP', 'ONEAPI', 'METAL'):
        try:
            prefs.compute_device_type = backend
        except TypeError:
            continue
        prefs.refresh_devices()
        gpus = [d for d in prefs.devices if d.type == backend]
        if gpus:
            for d in prefs.devices:
                d.use = d.type == backend
            sc.cycles.device = 'GPU'
            return f'GPU ({backend}: {", ".join(d.name for d in gpus)})'
    prefs.compute_device_type = 'NONE'
    sc.cycles.device = 'CPU'
    return f'CPU ({os.cpu_count()} threads)'


def setup_render(sc):
    sc.render.engine = 'CYCLES'
    device = setup_device(sc)
    c = sc.cycles
    c.samples = CFG.get('samples', 256)
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.02
    c.adaptive_min_samples = 16
    c.use_denoising = True
    c.denoiser = 'OPENIMAGEDENOISE'
    c.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
    c.denoising_prefilter = 'ACCURATE'
    c.max_bounces = 8
    c.diffuse_bounces = 3
    c.glossy_bounces = 4
    c.transmission_bounces = 8
    c.transparent_max_bounces = 8
    c.caustics_reflective = False
    c.caustics_refractive = False
    c.sample_clamp_indirect = 8
    c.film_exposure = 1.0
    sc.render.use_persistent_data = True
    sc.render.resolution_x = W
    sc.render.resolution_y = H
    sc.render.resolution_percentage = 100
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '8'
    sc.view_settings.view_transform = 'AgX'
    for look in ('AgX - Medium High Contrast', 'AgX - Base Contrast', 'None'):
        try:
            sc.view_settings.look = look
            break
        except TypeError:
            continue
    return device


# ───────────────────────── node helpers ─────────────────────────

def node(nt, kind, **inputs):
    n = nt.nodes.new(kind)
    for k, v in inputs.items():
        if k in n.inputs:
            n.inputs[k].default_value = v
        else:
            setattr(n, k, v)
    return n


def link(nt, a, b):
    nt.links.new(a, b)


def image(nt, path, colorspace='sRGB', vector=None, box=True):
    n = nt.nodes.new('ShaderNodeTexImage')
    n.image = bpy.data.images.load(path, check_existing=True)
    n.image.colorspace_settings.name = colorspace
    if box:
        n.projection = 'BOX'
        n.projection_blend = 0.3
    if vector is not None:
        link(nt, vector, n.inputs['Vector'])
    return n


def detail_vector(nt, tile_units):
    """Object-space coordinates scaled so one texture tile spans `tile_units` scene units."""
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = node(nt, 'ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (1 / tile_units,) * 3
    link(nt, tc.outputs['Object'], mp.inputs['Vector'])
    return mp.outputs['Vector']


def material_set(name):
    d = os.path.join(ASSETS, name)
    return {m: os.path.join(d, f'{m}.jpg') for m in ('color', 'rough', 'normal')}


def find_upstream(sock, kind):
    """First node of `kind` feeding `sock` (walks back through the importer's mix / factor nodes)."""
    seen = set()
    stack = [l.from_node for l in sock.links]
    while stack:
        n = stack.pop()
        if n in seen:
            continue
        seen.add(n)
        if n.type == kind:
            return n
        for i in n.inputs:
            stack.extend(l.from_node for l in i.links)
    return None


# ───────────────────────── materials ─────────────────────────

PAPERLIKE = {'paper', 'matte', 'softtouch', 'cardboard', 'wood', 'generic'}


def build_material(mat, info):
    kind = info.get('kind', 'generic')
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = next((n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    out = next((n for n in nt.nodes if n.type == 'OUTPUT_MATERIAL'), None)
    if not bsdf or not out:
        return
    base_in = bsdf.inputs['Base Color']
    art = base_in.links[0].from_socket if base_in.links else None
    art_value = tuple(base_in.default_value)
    art_img = find_upstream(base_in, 'TEX_IMAGE')
    rough0 = bsdf.inputs['Roughness'].default_value if not bsdf.inputs['Roughness'].links else 0.8

    def art_socket():
        nonlocal art
        if art is None:
            rgb = node(nt, 'ShaderNodeRGB')
            rgb.outputs[0].default_value = art_value
            art = rgb.outputs[0]
        return art

    def textured(texset, tile, tone, rough_range, normal_strength):
        """artwork × material detail; detail roughness + normal under the print."""
        vec = detail_vector(nt, tile)
        col = image(nt, texset['color'], 'sRGB', vec)
        bw = node(nt, 'ShaderNodeRGBToBW')
        link(nt, col.outputs['Color'], bw.inputs['Color'])
        rng = node(nt, 'ShaderNodeMapRange', **{'From Min': tone[0], 'From Max': tone[1], 'To Min': tone[2], 'To Max': tone[3]})
        link(nt, bw.outputs['Val'], rng.inputs['Value'])
        mul = node(nt, 'ShaderNodeMixRGB', blend_type='MULTIPLY')
        mul.inputs['Fac'].default_value = 1.0
        link(nt, art_socket(), mul.inputs['Color1'])
        link(nt, rng.outputs['Result'], mul.inputs['Color2'])
        link(nt, mul.outputs['Color'], base_in)
        rough = image(nt, texset['rough'], 'Non-Color', vec)
        rr = node(nt, 'ShaderNodeMapRange', **{'From Min': 0.0, 'From Max': 1.0, 'To Min': rough_range[0], 'To Max': rough_range[1]})
        link(nt, rough.outputs['Color'], rr.inputs['Value'])
        link(nt, rr.outputs['Result'], bsdf.inputs['Roughness'])
        nrm = image(nt, texset['normal'], 'Non-Color', vec)
        nm = node(nt, 'ShaderNodeNormalMap', Strength=normal_strength)
        link(nt, nrm.outputs['Color'], nm.inputs['Color'])
        return nm.outputs['Normal']

    for n in [n for n in nt.nodes if n.type == 'SEPARATE_COLOR']:  # importer's metal/rough split
        nt.nodes.remove(n)
    bsdf.inputs['Metallic'].default_value = 0.0

    normal = None
    if kind in ('paper', 'matte', 'softtouch', 'generic'):
        coated = rough0 < 0.5
        r = (max(0.05, rough0 - 0.06), rough0 + 0.04) if coated else (0.72, 0.9)
        if kind == 'softtouch':
            r = (0.62, 0.78)
        normal = textured(material_set('paper'), 3.0, (0.6, 1.0, 0.9, 1.02), r, 0.18 if coated or kind != 'paper' else 0.35)
    elif kind == 'cardboard':
        normal = textured(material_set('cardboard'), 4.0, (0.25, 0.75, 0.86, 1.06), (0.8, 0.95), 0.5)
    elif kind == 'cotton':
        normal = textured(material_set('cotton'), 0.7, (0.3, 0.8, 0.86, 1.04), (0.88, 1.0), 0.8)
        bsdf.inputs['Sheen Weight'].default_value = 0.35
        bsdf.inputs['Sheen Roughness'].default_value = 0.6
        bsdf.inputs['Specular IOR Level'].default_value = 0.25
        # soft wrinkles over the knit
        tc = nt.nodes.new('ShaderNodeTexCoord')
        noise = node(nt, 'ShaderNodeTexNoise', Scale=0.32, Detail=2.0, Roughness=0.45, Distortion=0.3)
        link(nt, tc.outputs['Object'], noise.inputs['Vector'])
        bump = node(nt, 'ShaderNodeBump', Strength=0.22, Distance=0.05)
        link(nt, noise.outputs['Fac'], bump.inputs['Height'])
        link(nt, normal, bump.inputs['Normal'])
        normal = bump.outputs['Normal']
    elif kind == 'wood':
        normal = textured(material_set('oak'), 6.0, (0.2, 0.8, 0.9, 1.05), (0.55, 0.7), 0.4)
    elif kind in ('gloss', 'ceramic'):
        bsdf.inputs['Roughness'].default_value = 0.08
        bsdf.inputs['Coat Weight'].default_value = 0.4
        bsdf.inputs['Coat Roughness'].default_value = 0.05
    elif kind in ('metal', 'foil'):
        bsdf.inputs['Metallic'].default_value = 1.0
        bsdf.inputs['Roughness'].default_value = 0.2 if kind == 'foil' else max(0.18, rough0)
    elif kind in ('glass', 'frosted'):
        bsdf.inputs['Transmission Weight'].default_value = 1.0
        bsdf.inputs['Roughness'].default_value = 0.03 if kind == 'glass' else 0.35
        bsdf.inputs['IOR'].default_value = 1.49
    if normal is not None:
        link(nt, normal, bsdf.inputs['Normal'])

    # hot-foil stamp: metallic, low-roughness, slightly debossed into the stock
    if info.get('foilMask') and art_img is not None:
        uv = art_img.inputs['Vector'].links[0].from_socket if art_img.inputs['Vector'].links else node(nt, 'ShaderNodeUVMap').outputs['UV']
        mask = image(nt, info['foilMask'], 'Non-Color', uv, box=False)
        mask.interpolation = 'Cubic'
        deboss = node(nt, 'ShaderNodeBump', Strength=0.3, Distance=0.001, invert=True)
        link(nt, mask.outputs['Color'], deboss.inputs['Height'])
        if normal is not None:
            link(nt, normal, deboss.inputs['Normal'])
        link(nt, deboss.outputs['Normal'], bsdf.inputs['Normal'])
        foil = node(nt, 'ShaderNodeBsdfPrincipled', Metallic=1.0)
        tint = node(nt, 'ShaderNodeHueSaturation', Value=1.45, Saturation=1.0)
        link(nt, art_socket(), tint.inputs['Color'])
        link(nt, tint.outputs['Color'], foil.inputs['Base Color'])
        grain = node(nt, 'ShaderNodeTexNoise', Scale=900.0, Detail=2.0)
        link(nt, uv, grain.inputs['Vector'])
        fr = node(nt, 'ShaderNodeMapRange', **{'To Min': 0.2, 'To Max': 0.3})
        link(nt, grain.outputs['Fac'], fr.inputs['Value'])
        link(nt, fr.outputs['Result'], foil.inputs['Roughness'])
        micro = node(nt, 'ShaderNodeBump', Strength=0.08, Distance=0.001)
        link(nt, grain.outputs['Fac'], micro.inputs['Height'])
        link(nt, deboss.outputs['Normal'], micro.inputs['Normal'])
        link(nt, micro.outputs['Normal'], foil.inputs['Normal'])
        sharp = node(nt, 'ShaderNodeMapRange', **{'From Min': 0.35, 'From Max': 0.65})
        link(nt, mask.outputs['Color'], sharp.inputs['Value'])
        mix = node(nt, 'ShaderNodeMixShader')
        link(nt, sharp.outputs['Result'], mix.inputs[0])
        link(nt, bsdf.outputs['BSDF'], mix.inputs[1])
        link(nt, foil.outputs['BSDF'], mix.inputs[2])
        link(nt, mix.outputs['Shader'], out.inputs['Surface'])


# ───────────────────────── geometry ─────────────────────────

_warp_tex = None


def prep_object(obj, kinds, done_meshes):
    me = obj.data
    if me.name not in done_meshes:
        done_meshes.add(me.name)
        bm = bmesh.new()
        bm.from_mesh(me)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
        bm.to_mesh(me)
        bm.free()
        with bpy.context.temp_override(object=obj, active_object=obj, selected_objects=[obj], selected_editable_objects=[obj]):
            if me.has_custom_normals:
                bpy.ops.mesh.customdata_custom_splitnormals_clear()
        me.shade_smooth()
        me.set_sharp_from_angle(angle=math.radians(35))
    co = np.empty(len(me.vertices) * 3, np.float32)
    me.vertices.foreach_get('co', co)
    co = co.reshape(-1, 3)
    if not len(co):
        return
    ext = co.max(0) - co.min(0)
    thin = float(ext.min())
    # rounded edges on everything (≈0.2–0.5 mm, never more than a fifth of the thinnest side)
    bev = obj.modifiers.new('bevel', 'BEVEL')
    bev.width = min(0.005, max(0.0004, thin * 0.2))
    bev.segments = 3
    bev.limit_method = 'ANGLE'
    bev.angle_limit = math.radians(35)
    bev.use_clamp_overlap = True
    # thin stock warps a little: card, paper, sheets
    if thin < 0.03 and ext.max() > 0.2 and kinds & {'paper', 'matte', 'cardboard', 'softtouch'}:
        global _warp_tex
        if _warp_tex is None:
            _warp_tex = bpy.data.textures.new('warp', 'CLOUDS')
            _warp_tex.noise_scale = 0.08
            _warp_tex.noise_depth = 1
        sub = obj.modifiers.new('dense', 'SUBSURF')
        sub.subdivision_type = 'SIMPLE'
        sub.levels = sub.render_levels = 4
        disp = obj.modifiers.new('warp', 'DISPLACE')
        disp.texture = _warp_tex
        disp.texture_coords = 'GLOBAL'
        disp.direction = 'Z'
        disp.mid_level = 0.5
        disp.strength = 0.008 * max(1.0, float(ext.max()))


# ───────────────────────── scene ─────────────────────────

def build_world(sc, bg):
    world = bpy.data.worlds.new('studio')
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    out = node(nt, 'ShaderNodeOutputWorld')
    env = nt.nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(os.path.join(ASSETS, 'hdri', 'studio_small_09.hdr'), check_existing=True)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = node(nt, 'ShaderNodeMapping')
    mp.inputs['Rotation'].default_value = (0, 0, math.radians(110))
    link(nt, tc.outputs['Generated'], mp.inputs['Vector'])
    link(nt, mp.outputs['Vector'], env.inputs['Vector'])
    dark = bg in ('dark', 'night')
    light_bg = node(nt, 'ShaderNodeBackground', Strength=0.35 if dark else 0.9)
    link(nt, env.outputs['Color'], light_bg.inputs['Color'])
    seen = node(nt, 'ShaderNodeBackground', Strength=1.0)
    seen.inputs['Color'].default_value = (*SURFACES.get(bg, SURFACES['warm'])[2], 1)
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    link(nt, lp.outputs['Is Camera Ray'], mix.inputs[0])
    link(nt, light_bg.outputs['Background'], mix.inputs[1])
    link(nt, seen.outputs['Background'], mix.inputs[2])
    link(nt, mix.outputs['Shader'], out.inputs['Surface'])


def build_surface(centre, bg, radius_m):
    tex, tint, _ = SURFACES.get(bg, SURFACES['warm'])
    size = 30.0
    bpy.ops.mesh.primitive_plane_add(size=size, location=(centre.x, centre.y, -0.00005))
    plane = bpy.context.active_object
    plane.name = 'surface'
    mat = bpy.data.materials.new('surface')
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = node(nt, 'ShaderNodeMapping')
    tile = (1.2 if tex == 'oak' else 1.6) * min(1.0, max(0.35, radius_m * 4))  # metres per tile — finer under small products
    mp.inputs['Scale'].default_value = (size / tile,) * 3
    link(nt, tc.outputs['UV'], mp.inputs['Vector'])
    s = material_set(tex)
    col = image(nt, s['color'], 'sRGB', mp.outputs['Vector'], box=False)
    tint_n = node(nt, 'ShaderNodeMixRGB', blend_type='MULTIPLY')
    tint_n.inputs['Fac'].default_value = 1.0
    tint_n.inputs['Color2'].default_value = (*tint, 1)
    link(nt, col.outputs['Color'], tint_n.inputs['Color1'])
    link(nt, tint_n.outputs['Color'], bsdf.inputs['Base Color'])
    rough = image(nt, s['rough'], 'Non-Color', mp.outputs['Vector'], box=False)
    link(nt, rough.outputs['Color'], bsdf.inputs['Roughness'])
    nrm = image(nt, s['normal'], 'Non-Color', mp.outputs['Vector'], box=False)
    nm = node(nt, 'ShaderNodeNormalMap', Strength=0.45)
    link(nt, nrm.outputs['Color'], nm.inputs['Color'])
    link(nt, nm.outputs['Normal'], bsdf.inputs['Normal'])
    plane.data.materials.append(mat)


def add_key_light(centre, radius_m, light_dir, dark):
    d = three_dir(light_dir)
    dist = max(0.7, radius_m * 7)
    data = bpy.data.lights.new('key', 'AREA')
    data.shape = 'DISK'
    data.size = dist * 0.7
    data.energy = (6 if dark else 16) * dist * dist
    data.color = (1.0, 0.97, 0.93)
    key = bpy.data.objects.new('key', data)
    bpy.context.scene.collection.objects.link(key)
    key.location = centre + d * dist
    key.rotation_euler = (centre - key.location).to_track_quat('-Z', 'Y').to_euler()


def add_camera(sc, view, radius_units, index):
    cam_data = bpy.data.cameras.new(f'cam{index}')
    cam_data.lens = LENS
    cam_data.sensor_width = SENSOR
    cam_data.sensor_fit = 'HORIZONTAL'
    cam_data.clip_start = 0.005
    cam_data.clip_end = 200
    vfov = 2 * math.atan(math.tan(math.atan(SENSOR / 2 / LENS)) * H / W)
    dist = radius_units * UNIT * view['pad'] / math.sin(vfov / 2)
    target = three_to_blender(view['target'])
    pos = target + three_dir(view['dir']) * dist
    pos.z = max(pos.z, 0.005)
    cam = bpy.data.objects.new(f'cam{index}', cam_data)
    sc.collection.objects.link(cam)
    cam.location = pos
    cam.rotation_euler = (target - pos).to_track_quat('-Z', 'Y').to_euler()
    if index >= 2:  # views 3–4: shallow depth of field on the product
        cam_data.dof.use_dof = True
        cam_data.dof.focus_distance = (target - pos).length
        cam_data.dof.aperture_fstop = 5.6 if index == 2 else 3.2
        cam_data.dof.aperture_blades = 7
    return cam


def finish(png, jpg, seed):
    """light film grain, then JPEG"""
    img = bpy.data.images.load(png)
    px = np.empty(W * H * 4, np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(H, W, 4)
    g = np.random.default_rng(seed).normal(0, 1, (H, W)).astype(np.float32)
    g = (g + np.roll(g, 1, 0) + np.roll(g, 1, 1)) / 1.73  # slightly soft grain
    lum = px[..., :3].mean(-1)
    amp = 0.009 * (0.4 + 2.4 * lum * (1 - lum))  # strongest in the mid-tones
    px[..., :3] = np.clip(px[..., :3] + (g * amp)[..., None], 0, 1)
    img.pixels.foreach_set(px.ravel())
    img.file_format = 'JPEG'
    try:
        img.save(filepath=jpg, quality=90)
    except TypeError:
        img.filepath_raw = jpg
        bpy.context.scene.render.image_settings.quality = 90
        img.save()
    bpy.data.images.remove(img)


def render_job(job):
    meta = json.load(open(job['meta'], encoding='utf8'))
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    global _warp_tex
    _warp_tex = None
    sc = bpy.context.scene
    device = setup_render(sc)

    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=job['glb'])
    imported = [o for o in bpy.data.objects if o not in before]
    rig = bpy.data.objects.new('product', None)
    sc.collection.objects.link(rig)
    rig.scale = (UNIT,) * 3
    for o in imported:
        if o.parent is None:
            o.parent = rig

    for mat in bpy.data.materials:
        info = meta['materials'].get(mat.name)
        if info:
            build_material(mat, info)
    done = set()
    for o in imported:
        if o.type == 'MESH':
            kinds = {meta['materials'].get(m.name, {}).get('kind', 'generic') for m in o.data.materials if m}
            prep_object(o, kinds, done)

    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in imported if o.type == 'MESH' for c in o.bound_box]
    lo = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    centre = (lo + hi) / 2
    bg = meta.get('bg', 'warm')
    build_world(sc, bg)
    build_surface(centre, bg, meta['radius'] * UNIT)
    add_key_light(centre, meta['radius'] * UNIT, meta.get('light', [-0.55, 1, 0.75]), bg in ('dark', 'night'))
    sc.view_settings.exposure = math.log2(meta.get('exposure', 1) or 1)
    setup_s = time.time() - t0

    os.makedirs(job['out'], exist_ok=True)
    timings = []
    for i, view in enumerate(meta['views']):
        sc.camera = add_camera(sc, view, meta['radius'], i)
        png = os.path.join(job['out'], f'_{i + 1}.png')
        sc.render.filepath = png
        t = time.time()
        bpy.ops.render.render(write_still=True)
        secs = time.time() - t
        finish(png, os.path.join(job['out'], f'{i + 1}.jpg'), seed=hash((job['key'], i)) & 0xFFFF)
        os.remove(png)
        timings.append(round(secs, 1))
        log(f'{job["key"]}  view {i + 1}/{len(meta["views"])}  {secs:.1f}s')
    log(f'{job["key"]}  done — setup {setup_s:.1f}s, views {timings}, total {time.time() - t0:.1f}s on {device}')
    return {'key': job['key'], 'device': device, 'setup_s': round(setup_s, 1), 'views_s': timings, 'total_s': round(time.time() - t0, 1), 'width': W, 'height': H}


results = []
for job in CFG['jobs']:
    results.append(render_job(job))
    json.dump(results, open(CFG['timings'], 'w'), indent=1)
log('all done')
