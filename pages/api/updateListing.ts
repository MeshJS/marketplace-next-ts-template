import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const updatedListing = req.body.updatedListing;

  const db = await getDatabase(process.env.MONGODB_DBNAME);
  const collection = db.collection("listings");

  let data = await collection.updateOne(
    { unit: updatedListing.unit },
    { $set: updatedListing }
  );

  res.status(200).json({ data: data });
}
