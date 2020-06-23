import Discord from 'discord.js';
import fs from 'fs';
import yaml from 'js-yaml';

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

const configFile = fs.readFileSync('./config/config.yaml', {
  encoding: 'utf-8',
});

const config = yaml.safeLoad(configFile);

client.login(config.bot.token);
