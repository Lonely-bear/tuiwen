//----------------------------- 依赖包 -----------------------------
const { v4: uuid } = require('uuid');
const fs = require('fs')
const path = require('path');
const { template_tracks, template_audios, template_beats, template_canvases, template_materials, template_segments, template_sound_channel_mappings, template_speeds, template_videos } = require('./draft/template.js')
const $zip = require('./zip.js')
//----------------------------- 依赖包 -----------------------------

//----------------------------- 测试数据 -----------------------------
async function genDraft(draft_data, dir, CONFIG) {
  try {

    //----------------------------- 配置项 -----------------------------
    const draft_removable_storage_device = CONFIG.draft_removable_storage_device || 'D:'
    const draft_root_path = CONFIG.draft_root_path || 'D:/JianyingPro Drafts/'
    const draft_cover = 'draft_cover.jpg'
    const draft_dir_name = dir

    //----------------------------- 配置项 -----------------------------

    //----------------------------- draft_meta_info -----------------------------
    const draft_meta_info = require('./templates/draft_meta_info.template.json')
    draft_meta_info.draft_name = draft_dir_name
    draft_meta_info.draft_removable_storage_device = draft_removable_storage_device
    draft_meta_info.draft_root_path = draft_root_path
    draft_meta_info.draft_cover = draft_cover
    draft_meta_info.draft_id = uuid()
    draft_meta_info.draft_fold_path = draft_root_path + draft_dir_name
    const destPath = path.join('./public/drafts', draft_dir_name);
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    fs.copyFileSync(draft_data[0].image, destPath + '/draft_cover.jpg')
    //----------------------------- draft_meta_info -----------------------------

    //----------------------------- draft_content -----------------------------
    const draft_content = require('./templates/draft_content.template.json')
    draft_content.id = uuid()
    const audios = []
    const beats = []
    const canvases = []
    const sound_channel_mappings = []
    const speeds = []
    const videos = []
    const tracks = []
    tracks.push(template_tracks())
    tracks.push(template_tracks())
    tracks[0].type = 'video'
    tracks[1].type = 'audio'
    draft_content.tracks = tracks
    const segments_video = []
    const segments_audio = []
    let start = 0
    draft_data.forEach((item, index) => {
      const duration = item.audio_duration
      // 图像操作
      const image_value = template_materials()
      const imagePath = path.join(__dirname, '../public/drafts/' + draft_dir_name + '/image');
      if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath);
      }
      fs.copyFileSync(item.image, imagePath + '/' + index + '.jpg')
      image_value.duration = duration
      image_value.extra_info = index + '.jpg'
      image_value.file_Path = draft_root_path + draft_dir_name + '/image/' + index + '.jpg'
      image_value.roughcut_time_range.duration = duration
      image_value.metetype = 'photo'
      // 音频操作
      const audio_value = template_materials()
      const audioPath = path.join(__dirname, '../public/drafts/' + draft_dir_name + '/audio');
      if (!fs.existsSync(audioPath)) {
        fs.mkdirSync(audioPath);
      }
      fs.copyFileSync(item.audio, audioPath + '/' + index + '.mp3')
      audio_value.duration = duration
      audio_value.extra_info = index + '.mp3'
      audio_value.file_Path = draft_root_path + draft_dir_name + '/audio/' + index + '.mp3'
      audio_value.roughcut_time_range.duration = duration
      audio_value.metetype = 'music'
      // 添加素材
      draft_meta_info.draft_materials[0].value.push(image_value)
      draft_meta_info.draft_materials[0].value.push(audio_value)

      // content
      const audios_template = template_audios()
      audios_template.local_material_id = audio_value.id
      audios_template.name = audio_value.extra_info
      audios_template.path = audio_value.file_Path
      audios.push(audios_template)
      const beats_template = template_beats()
      beats.push(beats_template)
      const canvases_template = template_canvases()
      canvases.push(canvases_template)
      sound_channel_mappings.push(template_sound_channel_mappings())
      sound_channel_mappings.push(template_sound_channel_mappings())
      speeds.push(template_speeds())
      speeds.push(template_speeds())
      const videos_template = template_videos()
      videos_template.duration = duration
      videos_template.material_name = image_value.extra_info
      videos_template.path = image_value.file_Path
      videos_template.type = 'photo'
      videos_template.width = 800
      videos_template.height = 450
      videos.push(videos_template)
      const segments_video_template = template_segments()
      const segments_audio_template = template_segments()
      segments_video_template.extra_material_refs = [
        speeds[index].id,
        canvases_template.id,
        sound_channel_mappings[index].id,
      ]
      segments_video_template.material_id = videos_template.id
      segments_video_template.source_timerange.duration = duration
      segments_video_template.target_timerange.duration = duration
      segments_video_template.target_timerange.start = start
      segments_video.push(segments_video_template)
      segments_audio_template.extra_material_refs = [
        speeds[index + 1].id,
        beats_template.id,
        sound_channel_mappings[index + 1].id,
      ]
      segments_audio_template.material_id = audios_template.id
      segments_audio_template.source_timerange.duration = duration
      segments_audio_template.target_timerange.duration = duration
      segments_audio_template.target_timerange.start = start
      segments_audio.push(segments_audio_template)
      start += duration
    })
    draft_content.duration = start
    draft_content.materials.audios = audios
    draft_content.materials.beats = beats
    draft_content.materials.canvases = canvases
    draft_content.materials.sound_channel_mappings = sound_channel_mappings
    draft_content.materials.speeds = speeds
    draft_content.materials.videos = videos
    draft_content.tracks[0].segments = segments_video
    draft_content.tracks[1].segments = segments_audio

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }
    const draft_meta_info_file = JSON.stringify(draft_meta_info)
    const meta_path = path.join(__dirname, '../public/drafts/' + draft_dir_name + '/draft_meta_info.json');
    fs.writeFileSync(meta_path, draft_meta_info_file)
    const draft_content_file = JSON.stringify(draft_content)
    const content_path = path.join(__dirname, '../public/drafts/' + draft_dir_name + '/draft_content.json');
    fs.writeFileSync(content_path, draft_content_file)

    $zip(path.join(__dirname, '../public/drafts/' + draft_dir_name), path.join(__dirname, '../public/drafts/' + draft_dir_name + '.zip'))
    return path.join('../public/drafts/' + draft_dir_name + '.zip')
  } catch (error) {
    console.error(error);
  }
}

module.exports = genDraft