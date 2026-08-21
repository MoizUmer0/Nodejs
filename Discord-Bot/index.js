import connectMongoDB from './connection.js'
import mongoose from "mongoose";
import URL from "./model/url.js"
import { nanoid } from "nanoid";

connectMongoDB("mongodb://127.0.0.1:27017/discord-Short-url")
.then(()=> console.log("MongoDB connected"))
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
     intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
    });


client.on('messageCreate', async(message) =>{
    if(message.author.bot) return
    if(message.content.startsWith("create")){
        const url = message.content.split("create")[1].trim()
        const shortId=nanoid(8)
        await URL.create({
            shortId:shortId,
            redirectURL: url

        })
        return message.reply({
            content:`Generating Short ID: ${shortId}`
        })
    }
    message.reply({
        content:"Hi from Bot"
    })

client.on("interactionCreate",(interaction)=>{
    console.log(interaction)
    interaction.reply("Pong!!!")
})
})

client.login('')