// Shrinks a photo in the browser before the admin uploads it for display on
// the site (hero, bio, sessions, testimonials, portfolio gallery), so pages
// don't load 15 MB camera originals. Client-gallery uploads skip this --
// clients should get the full-resolution file.
export async function resizeForWeb(file: File, maxEdge = 2400, quality = 0.8): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    // Unsupported format (e.g. HEIC in some browsers) -- upload as-is.
    return file;
  }
}
