import { Request, Response, NextFunction } from "express";

function validateListingsQuery(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { price_min, price_max, beds, baths, limit, page, property_type } =
    req.query as Record<string, string | undefined>;

  const VALID_TYPES = ["house", "apartment", "townhouse", "land"];

  const invalidNumber = (val: string | undefined): boolean =>
    val !== undefined && (isNaN(Number(val)) || Number(val) < 0);

  if (invalidNumber(price_min)) {
    res.status(400).json({ error: "price_min must be a positive number" });
    return;
  }

  if (invalidNumber(price_max)) {
    res.status(400).json({ error: "price_max must be a positive number" });
    return;
  }

  if (price_min && price_max && Number(price_min) > Number(price_max)) {
    res
      .status(400)
      .json({ error: "price_min cannot be greater than price_max" });
    return;
  }

  if (invalidNumber(beds)) {
    res.status(400).json({ error: "beds must be a positive number" });
    return;
  }

  if (invalidNumber(baths)) {
    res.status(400).json({ error: "baths must be a positive number" });
    return;
  }

  if (invalidNumber(limit) || (limit && Number(limit) > 50)) {
    res.status(400).json({ error: "limit must be between 1 and 50" });
    return;
  }

  if (invalidNumber(page)) {
    res.status(400).json({ error: "page must be a positive number" });
    return;
  }

  if (property_type && !VALID_TYPES.includes(property_type.toLowerCase())) {
    res.status(400).json({
      error: `property_type must be one of: ${VALID_TYPES.join(", ")}`,
    });
    return;
  }

  next();
}

export default validateListingsQuery;
