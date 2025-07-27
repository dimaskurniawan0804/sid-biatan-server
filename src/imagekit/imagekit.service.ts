import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
// import * as ImageKit from 'imagekit';

@Injectable()
export class ImagekitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMG_KIT_API_PUB_KEY,
      privateKey: process.env.IMG_KIT_API_SECRET_KEY,
      urlEndpoint: process.env.IMG_KIT_API_URL,
    });
  }

  async uploadImage(
    file: Buffer | string,
    fileName: string,
    isNota: boolean = false,
  ): Promise<any> {
    const folder = isNota ? '/sid-biatan-dev/notas' : '/sid-biatan-dev/feeds';
    const uploadOptions = {
      file: file, // Buffer, URL, or base64 string
      fileName,
      folder,
    };

    return await this.imagekit.upload(uploadOptions);
  }

  async deleteImage(fileId: string): Promise<any> {
    return await this.imagekit.deleteFile(fileId);
  }
}
