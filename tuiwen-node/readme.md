1. 用户输入一章小说内容
2. 处理小说内容，将其根据句号或者指定符号进行分割，可自行选择分割数
3. 将分割好后的段落进行分词，可自行选择分词工具（Natural，franc-min，nodejieba）
4. 将(项目名，创建时间，原文，分割后的段落，分词后的段落)存入数据库
5. 将分词后的段落发送到gpt进行词组翻译，将翻译结果存入数据库
6. 将翻译结果发送到本地或远程stable diffusion进行生图，将图片结果存入数据库
7. 将分割后的段落发送给配音工具进行配音，将配音结果存入数据库
8. 目前已收集到(分割段落，对应图片，对应音频)三个数据，将其发送到前端进行展示
9. 在前端进行展示，用户最终选择后，发送至后端，后端处理生成 草稿 文件，打包后发送至前端，供前端下载。

1. 音频
2. 图片
3. 音频和图片组合在一起