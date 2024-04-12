import { ElMessage } from 'element-plus';

export function copy(text) {
  if (navigator.clipboard) {
    // 使用新的 Clipboard API 如果可用
    navigator.clipboard.writeText(text)
      .then(() => {
        ElMessage.success('复制成功');
      })
      .catch(err => {
        ElMessage.error('复制失败 ' + err);
      });
  } else {
    // 使用旧的 execCommand API 作为备选方案
    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    textarea.style.position = 'fixed';  // 防止滚动到页面底部
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');  // 复制到剪贴板
      ElMessage.success('复制成功');
    } catch (err) {
      ElMessage.error('复制失败 ' + err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}