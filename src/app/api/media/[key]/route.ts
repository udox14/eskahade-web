import { getBucket } from "@/lib/cf";
import { NextRequest, NextResponse } from "next/server";

// GET /api/media/:key — serve object from R2
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const bucket = getBucket();
  const obj = await bucket.get(decodeURIComponent(key));

  if (!obj) {
    return new NextResponse("Not found", { status: 404 });
  }

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("cache-control", "public, max-age=31536000, immutable");

  return new NextResponse(obj.body, { headers });
}
