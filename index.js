#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const yargs = require('yargs');
const path = require('path');

const argv = yargs
    .scriptName('npx github:wararyo/coreink-image-converter')
    .option('resize',{
        alias: 'r',
        description: 'Resize the image(s) into 200x200 only when larger'
    })
    .option('resize-force', {
        alias: 'R',
        description: 'Always resize the image(s) into 200x200'
    })
    .option('output', {
        alias: 'o',
        description: 'Output directory',
        default: './'
    })
    .command('$0 [files..]', 'the default command', () => {}, (argv) => {
        if(argv.files === void 0) {
            console.error('\x1b[31mInput files are not specified.\x1b[0m');
            console.error('See `npx github:wararyo/coreink-image-converter --help` .');
        } else {
            console.log(argv.files);
            let output = path.dirname(argv.output);
            console.log(argv.output);
            for(file of argv.files) {
                if(fs.existsSync(file)) Generate(file, output);
            }
        }
      })
    .help()
    .argv;

async function Generate(filePath, outputPath, resize = false, resizeForce = false){

    let image = await sharp(filePath).gamma().greyscale().raw();
    if(resizeForce || resize) image.resize({width: 200, height:200, fit: 'contain', background: {r:255,g:255,b:255,alpha:1}, withoutEnlargement: !resizeForce });
    let buffer = await image.toBuffer();
    let metadata = await image.metadata();

    let tempbyte = 0b00000000;
    let tempbyteCursor = 0;
    let arrayCount = 0;//改行のために使用

    let length = Math.ceil(buffer.length / 8);

    let output = `unsigned char image[${length}] = {`;

    for (byte of buffer.entries()) {
        tempbyte |= (byte[1] > 127) << (7-tempbyteCursor);
        if(byte[0] == buffer.length - 1) { //画像の終端
            output += `0x${tempbyte.toString(16)}};`;
        }
        else if(tempbyteCursor == 7){ // 8ビット単位で文字列化
            tempbyteCursor = 0;
            if(arrayCount % (metadata.width / 8) == 0) output += '\n';
            arrayCount++;
            output += `0x${tempbyte.toString(16)}, `;
            tempbyte = 0b00000000;
            tempbyteCursor = 0;
        }
        else tempbyteCursor++;
    }

    fs.writeFileSync(outputPath + '/' + path.basename(filePath,path.extname(filePath)) + '.c', output);
}
