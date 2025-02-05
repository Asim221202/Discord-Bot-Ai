require('dotenv').config(); // .env dosyasını yükler
const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai'); // OpenAI istemcisini içe aktar

// Discord botu için istemciyi başlatma
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

// OpenAI istemcisini başlatma
const openai = new OpenAI({
  apiKey: process.env.KEY, // OpenAI API anahtarını .env dosyasından alıyoruz
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Botlardan gelen mesajları yoksay

  // Eğer bot etiketlenirse, OpenAI'ye mesaj gönderilir
  if (message.content.includes(`<@${client.user.id}>`)) {
    try {
      const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo', // veya 'text-davinci-003' kullanabilirsiniz
  messages: [{ role: 'user', content: 'Hello, how are you?' }],
});

      // Yanıtı gönderme
      message.reply(response.choices[0].message.content);
    } catch (error) {
      console.error('Error with OpenAI API:', error);
      message.reply('Bir şeyler ters gitti. Lütfen tekrar deneyin.');
    }
  }
});

// Botu Discord'a bağlamak için login() kullanılır
client.login(process.env.TOKEN);
