export const downloadFileFromLink = (downloadedFile: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(downloadedFile);
  const aTag = document.createElement("a");
  aTag.href = url;
  aTag.download = fileName;
  document.body.appendChild(aTag);
  aTag.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(aTag);
};