const sharp = require('sharp');
const fs = require('fs');
const yargs = require('yargs');

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
        console.log('this command will be run by default');
        console.log(argv.files);
        console.log(argv.output);
        if(argv.files === void 0) {
            console.error('\x1b[31mInput files are not specified.\x1b[0m');
            console.error('See npx github:wararyo/coreink-image-converter --help .');
        } else {
            
        }
      })
    .help()
    .argv;

process.exit(0);

if(process.argv[2] == void 0 || (process.argv[2] != void 0 && !fs.existsSync(process.argv[2]))){
    console.log(`Usage: npx github:wararyo/coreink-image-converter [ImageFilePath]`);
    process.exit(0);
}

let filePath = process.argv[2];

(async() => {

let image = await sharp(filePath).gamma().greyscale().raw().toBuffer();

let tempbyte = 0b00000000;
let tempbyteCursor = 0;

console.log("unsigned char image[5000] = {");

for (byte of image.entries()) {
    tempbyte |= (byte.value > 127) << (7-tempbyteCursor);
    if(tempbyteCursor == 7){
        tempbyteCursor = 0;
        console.log(`0x${tempbyte.toString(16)}, `);
    }
    else tempbyteCursor++;
    if(byte.index == image.length - 1) {
        console.log(`0x${tempbyte.toString(16)}};`);
    }
}

})();
