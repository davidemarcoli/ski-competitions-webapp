import { SHORT_DESCRIPTION, SHORT_TITLE, TITLE } from '@/lib/constants'
import type { MetadataRoute } from 'next'

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

export default function manifest(): MetadataRoute.Manifest {
  return {
    theme_color: '#0a0a0a',
    background_color: '#0a0a0a',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    name: TITLE,
    short_name: SHORT_TITLE,
    description: SHORT_DESCRIPTION,
    icons: ICON_SIZES.map((size) => ({
      src: `/icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    })),
    screenshots: [
      {
        src: '/screenshots/desktop/list-view.png',
        type: 'image/png',
        sizes: '3282x2167',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/desktop/details-view.png',
        type: 'image/png',
        sizes: '3282x2167',
        form_factor: 'wide',
      },
      {
        src: '/screenshots/mobile/list-view.png',
        type: 'image/png',
        sizes: '1145x2167',
        form_factor: 'narrow',
      },
      {
        src: '/screenshots/mobile/details-view.png',
        type: 'image/png',
        sizes: '1145x2167',
        form_factor: 'narrow',
      },
    ],
  }
}
