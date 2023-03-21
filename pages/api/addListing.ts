import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const newListing = req.body.newListing;

  const db = await getDatabase(process.env.MONGODB_DBNAME);
  const collection = db.collection("listings");

  let data = await collection.insertOne(newListing);

  res.status(200).json({ data: data });
}
