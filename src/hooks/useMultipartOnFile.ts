import type { MultipartFile } from '@fastify/multipart'
import { createReadStream, createWriteStream } from 'fs'
import { Readable, pipeline } from 'stream'
import { promisify } from 'util'

export async function useMultipartOnFile(part: any) {
   const file: MultipartFile = part;
   part.value = { ...file }
}