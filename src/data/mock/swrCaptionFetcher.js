import * as captionData from './captionDB'
export default function swrCaptionFetcher(url, type = 'caption_locked_me') {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(captionData[type])
        }, 2000)
    })
}