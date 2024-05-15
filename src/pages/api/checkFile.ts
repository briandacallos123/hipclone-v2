// pages/api/checkFile.ts
import fs from 'fs';
import path from 'path';

export default (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.status(400).json({ error: 'Filename parameter is missing.' });
  }

  const filePath = path.join(process.cwd(), '', filename as string);

  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    console.log(`File exists: ${filePath}`);
    res.status(200).json({ exists: true });
  } catch (error) {
    console.error(`Error accessing file ${filePath}:`, error);
    res.status(200).json({ exists: false });
  }
};
