import { createWorker } from 'tesseract.js';
import type { IDData } from '../types';

export async function processImage(imageFile: File | Blob): Promise<IDData> {
  const worker = await createWorker('eng');
  
  try {
    const { data: { text } } = await worker.recognize(imageFile);
    return parseOCRResult(text);
  } finally {
    await worker.terminate();
  }
}

function parseOCRResult(text: string): IDData {
  const lines = text.split('\n');
  
  return {
    firstName: extractField(lines, 'First Name:'),
    lastName: extractField(lines, 'Last Name:'),
    idNumber: extractField(lines, 'ID Number:'),
    birthDate: extractField(lines, 'Birth Date:'),
    sex: extractField(lines, 'Sex:'),
    addressStreet: extractField(lines, 'Address:'),
    addressNumber: extractField(lines, 'Address Number:'),
    postalCode: extractField(lines, 'Postal Code:'),
  };
}

function extractField(lines: string[], fieldName: string): string {
  const line = lines.find(l => l.toLowerCase().includes(fieldName.toLowerCase()));
  return line ? line.split(':')[1].trim() : '';
}