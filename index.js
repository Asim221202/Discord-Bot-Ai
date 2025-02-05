const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');

// Discord token'ınızı burada girin
const token = process.env.TOKEN;

// OpenAI API anahtarınızı burada girin
const openai = new OpenAI({
  apiKey: process.env.KEY,
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once('ready', () => {
  console.log('Bot başarıyla giriş yaptı!');
});

client.on('messageCreate', async (message) => {
  // Bot kendine mesaj göndermesin
  if (message.author.bot) return;

  // @bot etiketlemesi ile gelen mesajları işleme
  if (message.content.startsWith(`<@!${client.user.id}>`)) {
    const prompt = message.content.replace(`<@!${client.user.id}>`, '').trim();

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Ya da istediğiniz başka bir model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Yanıtı gönderme
      message.reply(response.choices[0].message.content);
    } catch (error) {
      console.error(error);
      message.reply('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  }
});

client.login(token);
