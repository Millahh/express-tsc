import { Request, Response } from "express";
import Product, { IProduct } from "../models/product";
import { FilterQuery, Query } from "mongoose";

interface ProductQuery {
  featured?: string;
  company?: string;
  name?: string;
  sort?: string;
  fields?: string;
  numericFilters?: string;
  page?: string;
  limit?: string;
}

export const getAllProducts = async (
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response
): Promise<void> => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;

  // type-safe queryObject
  const queryObject: FilterQuery<IProduct> = {};

  if (featured) {
    queryObject.featured = featured === "true";
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  // numericFilters handling
  if (numericFilters) {
    const operatorMap: Record<string, string> = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;

    let filters = numericFilters.replace(regEx, (match) => `—${operatorMap[match]}—`);

    const options = ["price"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("—");
      if (options.includes(field)) {
        if (!queryObject[field as keyof IProduct]) {
          queryObject[field as keyof IProduct] = {} as any;
        }
        (queryObject[field as keyof IProduct] as any)[operator] = Number(value);
      }
    });
  }

  // explicitly type result as a Mongoose Query
  let result: Query<IProduct[], IProduct> = Product.find(queryObject);

  // sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  // selected fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

// optional
export const getAllProductsStatic = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await Product.find({});
  res.status(200).json({ products, nbHits: products.length });
};
