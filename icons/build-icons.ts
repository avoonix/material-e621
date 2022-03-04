const Jimp = require("jimp");
const toIco = require("to-ico");
const fs = require("fs");

console.log(__dirname);

const resizeImages = async (sizes: number[]) => {
  for (const size of sizes) {
    const icon = await Jimp.read(`${__dirname}/icon.png`);
    icon
      .resize(size, size)
      .write(`${__dirname}/../public/static/${size}x${size}.png`);
  }
};

const generateIco = (sizes: number[]) => {
  return new Promise<void>((resolve, reject) => {
    fs.readFile(`${__dirname}/icon.png`, (err: Error, data: Buffer) => {
      if (err) return reject(err);
      toIco(data, {
        resize: true,
        sizes,
      }).then((buf: Buffer) => {
        fs.writeFile(
          `${__dirname}/../public/favicon.ico`,
          buf,
          (err: Error) => {
            if (err) return reject(err);
            resolve();
          },
        );
      });
    });
  });
};

(async () => {
  try {
    await fs.mkdirSync(`${__dirname}/../public/static`);
  } catch (error: any) {
    console.log(error.message);
  }
  await generateIco([16, 24, 32, 48, 64, 128]);
  console.log("generated favicon");
  await resizeImages([
    8,
    16,
    24,
    32,
    48,
    64,
    72,
    96,
    128,
    144,
    168,
    192,
    256,
    512,
    1024,
  ]);
  console.log("generated images");
})();
