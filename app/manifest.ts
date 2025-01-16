import type { MetadataRoute } from 'next'

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

export default function manifest(): MetadataRoute.Manifest {
    return {
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "FIS Alpine Ski World Cup Live",
        short_name: "FIS Live",
        description: "Live results and standings of FIS Alpine Ski World Cup events",
        icons:  ICON_SIZES.map(size => ({
            src: `/icons/icon-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: "image/png"
        })),
        screenshots: [
            {
                src: "/screenshots/desktop/list-view.png",
                type: "image/png",
                sizes: "3282x2167",
                form_factor: "wide"
            },
            {
                src: "/screenshots/desktop/details-view.png",
                type: "image/png",
                sizes: "3282x2167",
                form_factor: "wide"
            },
            {
                src: "/screenshots/mobile/list-view.png",
                type: "image/png",
                sizes: "1142x2167",
                form_factor: "narrow"
            },
            {
                src: "/screenshots/mobile/details-view.png",
                type: "image/png",
                sizes: "1142x2167",
                form_factor: "narrow"
            }
        ]
    }
}