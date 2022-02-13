import { Request, Response } from "express";
import slugify from "slugify";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";
import fs from "fs";
import { MyRequest } from "../middlewares/auth";
import Category from "../models/Category";

const S3 = new AWS.S3({
  apiVersion: "2010-12-01",
});

export const CreateCategoryController = async (req: Request, res: Response) => {
  const profile = (req as MyRequest).profile;
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "image could not upload" });
    }
    const { name, content } = fields;
    const { image } = files;
    const slug = slugify(name as string);

    if ((image as any).size > 2000000) {
      return res.status(400).json({ message: "image should be less than 2mb" });
    }

    // uploading to s3
    const params: AWS.S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `category/${uuidv4()}`,
      Body: fs.readFileSync((image as any).filepath),
      ContentType: `image/jpg`,
      ACL: "public-read",
    };

    const newCategory = new Category({
      name,
      content,
      slug,
      posted_by: profile?._id,
    });
    S3.upload(params, async function (err, data) {
      if (err) {
        return res
          .status(400)
          .json({ message: "error while uploading image to bucket" });
      }
      newCategory.image.url = data.Location;
      newCategory.image.key = data.Key;
      await newCategory.save();
      res.json({ message: "success creating category", data: newCategory });
    });
  });

  // try {

  //   return res.json({
  //     message: "successfully creating category",
  //     data: newCategory,
  //   });
  // } catch (error) {
  //   return res.status(500).json({
  //     message: "something went wrong when creating category",
  //   });
  // }
};

export const GetCategoriesController = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({})
      .select("id name content image posted_by createdAt updatedAt")
      .limit(10);
    return res.json({
      message: "successfully get categories",
      data: categories,
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: category.ts ~ line 44 ~ GetCategoriesController ~ error",
      error
    );
    return res.status(500).json({
      message: "something went wrong when getting categories",
    });
  }
};

export const GetCategoryController = async (req: Request, res: Response) => {
  return res.json({ message: "successfully creating category" });
};

export const UpdateCategoryController = async (req: Request, res: Response) => {
  return res.json({ message: "successfully creating category" });
};
export const DeleteCategoryController = async (req: Request, res: Response) => {
  return res.json({ message: "successfully creating category" });
};
