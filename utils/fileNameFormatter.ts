export const formatFileName = (fileName: string): string => {
  // Remove the file extension
  const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

  // Replace spaces with underscores
  const formattedName = nameWithoutExtension.replace(/\s+/g, "_");

  return formattedName;
};
