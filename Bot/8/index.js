const keys = require('./auth.json')

const Discord = require('discord.js')
//const png = require('pnglib-es6').default
const client = new Discord.Client()
const jimp = require('jimp')
const tinycolor = require('tinycolor2')
const vectorMath = require('./vector')
const makettgline = require('./makettgline')
const makePolarLine = require('./makePolarLine')
//icky and useless has dependencies that died as well
const makeLineChart = require('./makeLineChart')
const imageGen = require('./maths/image')

const remiFile = require('./drawings/remi.json')
const sebFile = require('./drawings/rainbowandsky.json')
const serinFile = require('./drawings/serin.json')



//const fs = require('fs')
const colours = [
    '08415c',
    'cc2936',
    '4da167',
    'd58936',
    'f6f930',
    'e86a92',
    '016fb9',
    'd1d646',
    '390040',
    '1d3461',
    '35a7ff',
    'f5f1ed',
    'cc4bc2',
    'bf4e30',
]

client.login(keys.token)
client
    .on('ready', () => {
        console.log('ready')
    })
    .on('error', (Error) => {
        console.log(error)
    })

async function createMatrix(drawFile) {
    var i = 0
    var colourMap = new Map()
    drawFile.colourNames.forEach((Element) => {
        colourMap.set(Element, drawFile.colours[i])
        i++
    })
 
    var outDrawing = new Array()
    drawFile.drawing.forEach((Element) => {
        outDrawing.push(colourMap.get(Element))
    })

    return outDrawing
}

//!this function needs to be remade with jimp
async function imageFile(width, height, gridArrayWidth, gridArrayHeight, squareHeight, squareWidth, hexArray, msg, ) {
    var tempImage = new jimp(width, height)

    
        for (let w = 0; w < gridArrayWidth; w++) {
            //width in colours
            for (let h = 0; h < gridArrayHeight; h++) {
                //height in colours
                for (let j = 0; j < squareHeight; j++) {
                    //j is horizontal in pixel
                    for (let k = 0; k < squareHeight; k++) {
                        //k is vertical in pixel
                        var x = w * squareHeight + j
                        var y = h * squareHeight + k
                        var selectcolour = h * gridArrayWidth + w
                        
                        tempImage.setPixelColor(hexArray[selectcolour], x, y)
                    }
                }
            }
        }

        //image.writeAsync(`./colours/${msg}.png`)

    
    
        await tempImage.writeAsync(`./colours/${msg}.png`)

    
}
async function createImage(squareHeight, cArray, msg, dims, artName) {
    var toSend = new Discord.MessageEmbed().setTitle('Your Colours').setColor(0xdcebff).setDescription('Test')

    var squareWidth = squareHeight

    var gridArrayWidth
    var gridArrayHeight

    if (dims === undefined) {
        gridArrayWidth = Math.ceil(Math.sqrt(cArray.length))
        gridArrayHeight = Math.ceil(Math.sqrt(cArray.length))
    } else {
        gridArrayWidth = dims[0]
        gridArrayHeight = dims[1]
    }
    var height = gridArrayHeight * squareHeight
    var width = gridArrayWidth * squareWidth
    //var totalSquares = gridArrayHeight * gridArrayWidth


    var hexArray = Array(gridArrayWidth * gridArrayHeight).fill(11111111)
    var counter = 0
    cArray.forEach((Element) => {
        hexArray[counter] = parseInt(tinycolor(Element).toHex8(), 16)
        counter++
    })
  

    //!use jimp write here
    await imageFile(width, height, gridArrayWidth, gridArrayHeight, squareHeight, squareWidth, hexArray, msg)
    //await imageDataURI.outputFile(image.getDataURL(), `./colours/${imageTitle}`)
    toSend.attachFiles(`./colours/${msg}.png`)
    console.log('escaped')
    
    return toSend
}
//palette preview image
createImage(50, colours, 'asdf')

var emoteHelp = new Discord.MessageEmbed()
function makePairs(messageArray) {
    var iPairsPushIndex = 0
    var iMessageArrayIndex = 0
    var pairs = new Array(Array())

    for (iMessageArrayIndex = 0; iMessageArrayIndex < messageArray.length; iMessageArrayIndex++) {
        if (pairs[iPairsPushIndex].length % 2 == 0 && pairs[iPairsPushIndex].length !== 0) {
            pairs.push(Array())
            pairs[iPairsPushIndex + 1].push(parseInt(messageArray[iMessageArrayIndex]))
            iPairsPushIndex++
        } else {
            pairs[iPairsPushIndex].push(messageArray[iMessageArrayIndex])
        }
    }

    

    return pairs
}
async function sortPairs(pairsIn) {
    var pairsOut
    var iPairSort = 0
    var loopSort = 0
    for (loopSort = 0; loopSort < pairsIn.length; loopSort++) {
        for (iPairSort = 0; iPairSort < pairsIn.length; iPairSort++) {
            var altSort = iPairSort + 1
            var first = pairsIn[iPairSort][0]
            try {
                var second = pairsIn[altSort][1]
            } catch (e) {
                break
            }

            var temp1
            var temp2

            if (pairsIn[altSort][0] < pairsIn[iPairSort][0]) {
                temp1 = pairsIn[iPairSort]
                temp2 = pairsIn[altSort]
                pairsIn[iPairSort] = temp2
                pairsIn[altSort] = temp1
                
            }
        }
    }
    pairsOut = pairsIn
    return pairsOut
}
async function defineHelps() {
    var thisarraything = (await client.guilds.fetch('757052713489006652')).emojis.cache
    var spaceEmoteArray = thisarraything.keyArray()
    var emoteMap = new Map()
    spaceEmoteArray.forEach((Element) => emoteMap.set(thisarraything.get(Element).name, thisarraything.get(Element).id))
    emoteHelp
        .setTitle('Emotes')
        .setColor(0xdcebff)
        .addField((name = 'Joy'), (value = `<:ObsequiJoy:${emoteMap.get('ObsequiJoy')}>`), (inline = true))
        .addField((name = 'Derp'), (value = `<:Derp:${emoteMap.get('ObsequiDerp')}>`), (inline = true))
        .addField((name = 'Lenny'), (value = `<:ObsequiLenny:${emoteMap.get('ObsequiLenny')}>`), (inline = true))
        .addField(
            (name = 'Concerned'),
            (value = `<:ObsequiConcerned:${emoteMap.get('ObsequiConcerned')}>`),
            (inline = true),
        )
        .addField((name = 'Loopy'), (value = `<:ObsequiLoopy:${emoteMap.get('ObsequiLoopy')}>`), (inline = true))
        .addField((name = 'Yell'), (value = `<:ObsequiYell:${emoteMap.get('ObsequiYell')}>`), (inline = true))
        .addField((name = 'Sad'), (value = `<:ObsequiSad:${emoteMap.get('ObsequiSad')}>`), (inline = true))
        .addField((name = 'Wicked'), (value = `<:ObsequiWicked:${emoteMap.get('ObsequiWicked')}>`), (inline = true))
        .addField(
            (name = 'Soulless'),
            (value = `<:ObsequiSoulless:${emoteMap.get('ObsequiSoulless')}>`),
            (inline = true),
        )
}
defineHelps()


client.on('message', async (message) => {
    if (message.author.bot) {
        return
    }
    if (message.content === '?') {
        message.react('👍')
        message.react('👎')
    }
    if (!message.content.startsWith(keys.prefix)) {
        return
    }

    try {
        var serverID = message.guild.id
    } catch (e) {}

    //lock out of other servers
    /*if(safeServers.includes(message.guild.id)){
}else {
message.channel.send("Obsequious is not active in this server currently.");
return;
} /* */

    var args = message.content.split(/ +/)
    //below is command
    var command = args[0].substring(1).toLowerCase()
    //below is the array of the querry
    var song1 = args.splice(1)
    //below is the string of the querry or whatever
    var args = message.content.split(' ')
    switch (command) {
        case 'imagepalette':
            if (args[1]) {
                link = args[1]
            } else {
                try {
                    link = message.attachments.first().url
                } catch (e) {
                    message.channel.send('Attach a file or link to an image and try again.')
                    break
                }
            }
            imageGen.translateImage(link, message)

            //message.channel.send('The most popular colours in your image are:\n ' + parts[0], new Discord.MessageAttachment(`./images/${message.id}.png`))

            //heapdump.writeSnapshot("./images/"+ message.id + '.heapsnapshot');

            break
        case 'flex':
            message.channel.send('This bot probably has a better physics grade than you do.')
            break
        case 'serino':
            var colorMatrix = await createMatrix(serinFile)
            message.channel.send(await createImage(9, colorMatrix, message.id, serinFile.dims, serinFile.name))
            break
        case 'remi':
            message.channel.send(await createImage(20, remiFile.drawing, message.id, [18, 18], serinFile.name))
            break
        case 'custom':
            message.channel.send(await createImage(20, sebFile.drawing, message.id, sebFile.dims, serinFile.name))
            break
        case 'cc':
            args.shift()
            if (args[0] == 'dims') {
                args.shift()
                var dims = [args.shift(), args.shift()]
            }

            var cList = args
            
            var toSendEmbed = await createImage(25, cList, message.id, dims, 'colours')
            message.channel.send(toSendEmbed)

            break
        case 'preview':
            var toSend = new Discord.MessageEmbed()
            toSend.setTitle('Palette Colours')
            toSend.setDescription('Count from left to right starting at one to select a colour.')
            toSend.attachFiles('./colours/asdf.png')
            //toSend.setImage("https://cdn.discordapp.com/attachments/760965640210219008/796384002041708544/asdf.png")
            message.channel.send(toSend)
            break

        case 'vote':
            await message.delete()

            var messagesAll = await await message.channel.messages.fetch(true)
            var voteable = messagesAll.get(messagesAll.keyArray()[0])
            voteable.react('👍')
            voteable.react('👎')

            break
        case 'pfp':
            
            var testPFP
            var usePFP
            var useName
            if (message.mentions.members.size) {
                testPFP = message.mentions.members.first().user.avatar
                usePFP = message.mentions.members.first().user.avatarURL({format:"jpg"})
                useName = message.mentions.members.first().displayName.toString()
            } else {
                testPFP = message.author.avatar
                usePFP = message.author.avatarURL()
                useName = message.author.username
            }

            if (testPFP.substring(0, 2) === 'a_') {
                usePFP = usePFP.split('.')
                usePFP[usePFP.length - 1] = 'gif'
                usePFP = usePFP.join('.')
            }

            var toSend = new Discord.MessageEmbed()
            toSend.setTitle(useName)
            
            toSend.setImage(`${usePFP}?size=512`)
            toSend.setColor(0xdcebff)
            message.channel.send(toSend)
            break
        case 'id':
            var useID
            var syntacc
            var usePFP
            try {
                useID = message.mentions.members.first().user.id
                syntacc = message.mentions.members.first().displayName
                usePFP = message.mentions.members.first().user.avatar
            } catch (e) {
                useID = message.author.id
                syntacc = message.author.username
                usePFP = message.author.avatar
            }

            var sendID = new Discord.MessageEmbed()
            sendID.setTitle(syntacc)
            sendID.setDescription(`ID: ${useID}`)
            sendID.setThumbnail(`https://cdn.discordapp.com/avatars/${useID}/${usePFP}?size=512`)

            message.channel.send(sendID)
            break
        case 'obsequimote':
        case 'emote':
            var thisarraything = (await client.guilds.fetch('757052713489006652')).emojis.cache
            var potat = thisarraything.keyArray()
            var lego = new Map()
            potat.forEach((Element) => lego.set(thisarraything.get(Element).name, thisarraything.get(Element).id))

            if (args[1] == 'help') {
                emoteHelp.setDescription('&emote {Emoji}')
                message.channel.send(emoteHelp)
                break
            }
            var thisarraything = (await client.guilds.fetch('757052713489006652')).emojis.cache
            var potat = thisarraything.keyArray()
            var lego = new Map()
            potat.forEach((Element) => lego.set(thisarraything.get(Element).name, thisarraything.get(Element).id))
            if (args[1] == 'all') {
                var potat2 = new Array()
                lego.forEach((value, key, map) => {
                    potat2.push(key)
                })
                var finalstring = new String()
                potat2.forEach((Element) => {
                    finalstring = finalstring + ' ' + `<:${Element}:${lego.get(Element)}>`
                })
                message.channel.send(finalstring)
                break
            }

            ;`<:ObsequiJoy:${lego.get('ObsequiJoy')}>`

            try {
                var cappt = args[1].split('')[0].toUpperCase() + args[1].substring(1)
            } catch (e) {
                message.channel.send(emoteHelp)
                break
            }

            message.channel.send(`<:Obsequi${args[1]}:${lego.get(`Obsequi${cappt}`)}>`)
            break
        case 'react':
            var thisarraything = (await client.guilds.fetch('757052713489006652')).emojis.cache
            var potat = thisarraything.keyArray()
            var lego = new Map()
            potat.forEach((Element) => lego.set(thisarraything.get(Element).name, thisarraything.get(Element).id))

            if (args[1] == 'help') {
                emoteHelp.setDescription('&react {Emoji} {member}')

                message.channel.send(emoteHelp)
                break
            }

            try {
                var cappt = args[1].split('')[0].toUpperCase() + args[1].substring(1)
            } catch (e) {
                message.channel.send(emoteHelp)
                break
            }
            var useMem
            try {
                useMem = message.mentions.users.first().id
            } catch (e) {
                useMem = message.author.id
            }
            await message.guild.member(useMem).lastMessage.react(lego.get(`Obsequi${cappt}`))
            
            //.react(`<:Obsequi${args[1]}:${lego.get(`Obsequi${cappt}`)}>`)
            break
        case 'ttg':
            var toSend = new Discord.MessageEmbed()
            toSend
                .setTitle('Time to Ground')
                .setColor(0xdcebff)
                .setDescription(
                    `The object took ${vectorMath.calcTimeY([args[1], args[2] | 0, args[3] | -10])} to land.`,
                )
                .setImage(await makettgline.makeTTGLine([args[1], args[2] | 0, args[3] | -10]))
            message.channel.send(toSend)

            break
        case 'polarprojectile':
            var toSend = new Discord.MessageEmbed()
            console.log(args)
            if ((args[1] > 10000) | (args[2] > 10000) | (args[3] > 10000) | (args[4] > 10000)) {
                message.channel.send('values too large')
                break
            }
            var path = await makePolarLine.makePolarLine([
                args[1],
                args[2],
                args[3] | 0,
                args[4] | -10,
                serverID,
                message.id,
            ])

            toSend
                .setTitle('Polar Projectile')
                .setColor(0xdcebff)
                .setDescription(`${vectorMath.calcPolarDistance([args[1], args[2], args[3] | 0, args[4] | -10])}`)
                .setImage(path)
            //.setImage(`attachment://${path}`)
            console.log('sent')
            message.channel.send(toSend)
            break
        case 'makegraph':
            var path = await makeLineChart.makeLineChart([song1, serverID, message.id])
            var toSend = new Discord.MessageEmbed()
            toSend.setTitle('Your Chart').setColor(0xdcebff).setImage(path).setDescription(`Points: `)
            message.channel.send(toSend)
            break
        case 'nsfw':
            if (message.channel.nsfw) {
                message.channel.send('No you sick fuck.')
            }
            break
        case '':
            message.channel.send('Do you want something?')
            break
        default:
            break
    }
})

//TELL ME SOMETHING TO MAKE OBSEQUI DO
