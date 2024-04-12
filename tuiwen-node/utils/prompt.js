const axios = require('axios');

async function getPrompt(content, options = {}, CONFIG) {
  try {
    const gpt_url = CONFIG.gpt_url || 'https://api.openai-proxy.org/v1/chat/completions';
    const gpt_accesskey = CONFIG.gpt_accesskey || '';
    const postData = {
      model: "gpt-3.5-turbo",
      messages: [{
        role: 'user',
        content: content
      }],
      ...options
    }
    const res = await axios.post(gpt_url, postData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + gpt_accesskey
      }
    });

    return res.data.choices[0].message.content || '';
  } catch (error) {
    console.error(error);
  }
}

module.exports = getPrompt