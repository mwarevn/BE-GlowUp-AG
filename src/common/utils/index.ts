import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as fs from 'fs';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

export const hashPasswd = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
  return hashedPassword;
};

export const selectFileds = {
  id: true,
  gender: true,
  role: true,
  full_name: true,
  phone_number: true,
  avatar: true,
  date_of_birth: true,
  address: true,
  profile: true,
};

export const uploadSingleImageThirdParty = async (req: Request) => {
  const file = req.file;

  const imgPath: string = file.path;

  const formData = new FormData();
  formData.append('image', fs.createReadStream(imgPath));
  formData.append('type', 'file');

  const formDataLength = await new Promise((resolve, reject) => {
    formData.getLength((err, length) => {
      if (err) {
        reject(err);
      } else {
        resolve(length);
      }
    });
  });

  const uploadImgur = await fetch(process.env.IMGUR_API_URI, {
    method: 'POST',
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
      ...formData.getHeaders(),
      'Content-Length': formDataLength.toString(),
    },
    body: formData,
  });

  fs.unlinkSync(imgPath);

  const dedata = await uploadImgur.json();

  if (!dedata.success) {
    return null;
  }

  return dedata;
};
