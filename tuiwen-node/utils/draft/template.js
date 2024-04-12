const { v4: uuidv4 } = require('uuid');

const template_tracks = () => {
  return JSON.parse(JSON.stringify({
    attribute: 0,
    flag: 0,
    id: uuidv4().toUpperCase(),
    segments: [],
    type: ""
  }))
}
const template_materials = () => {
  return JSON.parse(JSON.stringify({
    create_time: Math.floor(new Date().getTime() / 1000),
    duration: 5000000,
    extra_info: "",
    file_Path: "",
    width: 800,
    height: 450,
    id: uuidv4().toUpperCase(),
    import_time: Math.floor(new Date().getTime() / 1000),
    import_time_ms: new Date().getTime() * 1000,
    item_source: 1,
    md5: "",
    metetype: "",
    roughcut_time_range: {
      duration: 0,
      start: -1
    },
    sub_time_range: {
      duration: 0,
      start: -1
    },
    type: 0,
  }))
}
const template_audios = () => {
  return JSON.parse(JSON.stringify({
    "app_id": 0,
    "category_id": "",
    "category_name": "local",
    "check_flag": 1,
    "duration": 3000000,
    "effect_id": "",
    "formula_id": "",
    "id": uuidv4().toUpperCase(),
    "intensifies_path": "",
    "local_material_id": "d53d0281-04d0-4af3-a165-f5e0025ba2a2",//meta_info 的ID
    "music_id": uuidv4().toUpperCase(),
    "name": "",//音频文件名
    "path": "",//绝对路径
    "request_id": "",
    "resource_id": "",
    "source_platform": 0,
    "team_id": "",
    "text_id": "",
    "tone_category_id": "",
    "tone_category_name": "",
    "tone_effect_id": "",
    "tone_effect_name": "",
    "tone_speaker": "",
    "tone_type": "",
    "type": "extract_music",
    "video_id": "",
    "wave_points": []
  }))
}
const template_beats = () => {
  return JSON.parse(JSON.stringify({
    "ai_beats": {
      "beats_path": "",
      "beats_url": "",
      "melody_path": "",
      "melody_percents": [0.0],
      "melody_url": "",
    },
    "enable_ai_beats": false,
    "gear": 404,
    "id": uuidv4().toUpperCase(),
    "mode": 404,
    "type": "beats",
    "user_beats": [],
    "user_delete_ai_beats": null
  }))
}
const template_canvases = () => {
  return JSON.parse(JSON.stringify({
    "album_image": "",
    "blur": 0.0,
    "color": "",
    "id": uuidv4().toUpperCase(), // 替换为您的唯一 ID
    "image": "",
    "image_id": "",
    "image_name": "",
    "source_platform": 0,
    "team_id": "",
    "type": "canvas_color"
  }))
}
const template_sound_channel_mappings = () => {
  return JSON.parse(JSON.stringify({
    "audio_channel_mapping": 0,
    "id": uuidv4().toUpperCase(), // 替换为您的唯一 ID
    "is_config_open": false,
    "type": "none"
  }))
}
const template_speeds = () => {
  return JSON.parse(JSON.stringify({
    "curve_speed": null,
    "id": uuidv4().toUpperCase(), // 替换为您的唯一 ID
    "mode": 0,
    "speed": 1.0,
    "type": "speed"
  }))
}
const template_videos = () => {
  return JSON.parse(JSON.stringify({
    "audio_fade": null,
    "cartoon_path": "",
    "category_id": "",
    "category_name": "local",
    "check_flag": 63487,
    "crop": {
      "lower_left_x": 0.0,
      "lower_left_y": 1.0,
      "lower_right_x": 1.0,
      "lower_right_y": 1.0,
      "upper_left_x": 0.0,
      "upper_left_y": 0.0,
      "upper_right_x": 1.0,
      "upper_right_y": 0.0
    },
    "crop_ratio": "free",
    "crop_scale": 1.0,
    "duration": 10800000000,//时长
    "extra_type_option": 0,
    "formula_id": "",
    "freeze": null,
    "gameplay": null,
    "has_audio": true,
    "height": 450,
    "id": uuidv4().toUpperCase(), // 替换为您的唯一 ID
    "intensifies_audio_path": "",
    "intensifies_path": "",
    "is_unified_beauty_mode": false,
    "local_id": "",
    "local_material_id": "",
    "material_id": "",
    "material_name": "",
    "material_url": "",
    "matting": {
      "flag": 0,
      "has_use_quick_brush": false,
      "has_use_quick_eraser": false,
      "interactiveTime": [],
      "path": "",
      "strokes": []
    },
    "media_path": "",
    "object_locked": null,
    "path": "",
    "picture_from": "none",
    "picture_set_category_id": "",
    "picture_set_category_name": "",
    "request_id": "",
    "reverse_intensifies_path": "",
    "reverse_path": "",
    "source_platform": 0,
    "stable": null,
    "team_id": "",
    "type": "photo",
    "video_algorithm": {
      "algorithms": [],
      "deflicker": null,
      "motion_blur_config": null,
      "noise_reduction": null,
      "path": "",
      "time_range": null
    },
    "width": 800
  }))
}
const template_segments = () => {
  return JSON.parse(JSON.stringify({
    "cartoon": false,
    "clip": {
      "alpha": 1.0,
      "flip": { "horizontal": false, "vertical": false },
      "rotation": 0.0,
      "scale": { "x": 1.0, "y": 1.0 },  // 缩放
      "transform": { "x": 0.0, "y": 0.0 }
    },
    "common_keyframes": [],
    "enable_adjust": true,
    "enable_color_curves": true,
    "enable_color_wheels": true,
    "enable_lut": true,
    "enable_smart_color_adjust": false,
    "extra_material_refs": [],
    "group_id": "",
    "hdr_settings": { "intensity": 1.0, "mode": 1, "nits": 1000 },
    "id": uuidv4().toUpperCase(), // 替换为您的唯一 ID
    "intensifies_audio": false,
    "is_placeholder": false,
    "is_tone_modify": false,
    "keyframe_refs": [],
    "last_nonzero_volume": 1.0,
    "material_id": "",
    "render_index": 0,
    "reverse": false,
    "source_timerange": { "duration": 3766667, "start": 0 },
    "speed": 1.0,
    "target_timerange": { "duration": 3766667, "start": 7466666 },
    "template_id": "",
    "template_scene": "default",
    "track_attribute": 0,
    "track_render_index": 0,
    "uniform_scale": null,
    "visible": true,
    "volume": 1.0
  }))
}

module.exports = {
  template_tracks,
  template_materials,
  template_audios,
  template_beats,
  template_canvases,
  template_sound_channel_mappings,
  template_speeds,
  template_videos,
  template_segments
}