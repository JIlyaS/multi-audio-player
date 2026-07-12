export const getTrackName = (trackLink: string | undefined) => {
    const parsedLink = trackLink?.split("/") || [];
    const fileName = parsedLink[parsedLink.length - 1] || "";

    return fileName;
}
