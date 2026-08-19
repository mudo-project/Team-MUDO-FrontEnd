import type { MetadataRoute } from "next";
import { headers } from "next/headers";

const APEX_HOST = 'ieum.store';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const requestHeaders = await headers();
    const forwardedHost = requestHeaders.get('x-forwarded-host')?.split(',')[0];
    const host = (forwardedHost ?? requestHeaders.get('host') ?? '')
        .trim()
        .toLowerCase()
        .split(':', 1)[0];

    if (host !== APEX_HOST) {
        return {
            rules: {
                userAgent: '*',
                disallow: '/',
            },
        };
    }

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/alarm/',
                '/approval/',
                '/attendance/',
                '/finance/',
                '/initial/',
                '/lecture/',
                '/members/',
                '/message/',
                '/messenger/',
                '/mypage/',
                '/notice/',
                '/revenue-report/',
                '/role/',
                '/rollbook/',
                '/schedule/',
                '/setting/',
                '/settings/',
                '/shared-folder/',
                '/student/',
                '/timetable/',
                '/workspace/',
                '/auth/',
                '/password-setup/',
                '/superadmin/',
            ],
        },
        sitemap: 'https://ieum.store/sitemap.xml',
    };
}
