import playdl from "play-dl"

export const getListMusic = async (url) => {
    const playlist = await playdl.playlist_info(url)
    console.log(playlist);
}