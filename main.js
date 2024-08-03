import fs from 'fs';
import _ from 'dotenv';
import axios from 'axios';

const data = _.parse(fs.readFileSync('.env'));
const baseUrl = data.BASE_URL;
const apiUrl = `${baseUrl}:3000/api/stampInfo`;
const origin = `${baseUrl}:8026`;
const referer = `${baseUrl}:8026/`;
const headers = {
  'Origin': origin,
  'Referer': referer,
};

const args = process.argv.slice(2);
if (!args[0]) {
  console.log('missing start index');
  exit(1);
}
const start = parseInt(args[0]);
const end = args[1] ? args[1] : 62000000;
const myCountry = 'Germany';

const outputFile = `${start}.csv`;
const logger = fs.createWriteStream(outputFile, {
  flags: 'a',
});
logger.write('serial,product\n');

for (let index = start; index <= end; index += 5) {
  const serial = serialNum(index);
  const ip = randomIp();

  const url = `${apiUrl}?checkInfo=${serial},${ip},${myCountry}`;
  try {
    const response = await axios.get(url, { headers });
    const { data } = response;
    const { description, hsa } = data;

    if (description && hsa) {
      const desp = description.replace(/(\r\n|\n|\r)/gm, '');
      const content = `${serial},${desp}`;
      logger.write(`${content}\n`);
      console.log(`${content}`);
    } else {
      logger.write(`${serial},No product\n`);
      console.log(`${serial}:no description`);
    }
  } catch (err) {
    logger.write(`${serial},Server error\n`);
    console.error(`${serial}:server error`);
  }
}

logger.end();

function serialNum(index) {
  return `0000${index}`;
}

function randomIp() {
  return (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255)) + "." + (Math.floor(Math.random() * 255));
}
