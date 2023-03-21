import type { NextApiRequest, NextApiResponse } from "next";
import { getDatabase } from "@/lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const policy = req.query.policy;

  const db = await getDatabase(process.env.MONGODB_DBNAME);
  const collection = db.collection("listings");

  let data = await collection
    .find({ "metadata.policy": policy })
    .sort({ "listing.date": -1 })
    .toArray();

  data.map((item) => {
    item["owner"] = item.listing.seller;
  });

  res.status(200).json(data);
}
