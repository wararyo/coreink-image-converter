# coreink-image-converter
Utility for M5Stack CoreInk which converts image files into array

## Usage

```
npx github:wararyo/coreink-image-converter [options] [files..]

オプション:
      --version       バージョンを表示                                    [真偽]
  -r, --resize        Resize the image(s) into 200x200 only when larger
  -R, --resize-force  Always resize the image(s) into 200x200
  -o, --output        Output directory                        [デフォルト: "./"]
      --help          ヘルプを表示                                        [真偽]
```

### Example

```
npx github:wararyo/coreink-image-converter example.png
npx github:wararyo/coreink-image-converter images/* converted/
```
