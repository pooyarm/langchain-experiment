import fs from 'fs';
import EmlParser from 'eml-parser';

import { sampleDir } from './env.ts';

export const parseEmails = async () => {
  console.log('Check if cache exists...');

  if (fs.existsSync('./sample/emails_all.json')) {
    console.log('Cache exists, reading from cache...');
    const data = await fs.readFileSync('./sample/emails_all.json', 'utf-8');
    return JSON.parse(data);
  }

  console.log('Parsing emails...');
  const files = await fs.readdirSync(sampleDir);
  console.log(`Found ${files.length} emails`);
  const data = await Promise.all(files.map(async (file) => {
    const eml = fs.createReadStream(`${sampleDir}/${file}`, 'utf-8');
    return new EmlParser(eml).parseEml({ ignoreEmbedded: true });
  }));

  const emails = data.map((parsed) => ({
    id: parsed.messageId,
    date: parsed.date,
    from: parsed.from,
    subject: parsed.subject,
    text: parsed.text,
  }));

  console.log('Caching the parsed emails...');
  await fs.writeFileSync(`${sampleDir}.json`, JSON.stringify(emails));

  console.log('Parsing is done');

  return emails;
};
