const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    images: {
        domains: ['localhost'],
    },
}

module.exports = withMDX(nextConfig)
