const API_SERVER = process.env.API_SERVER;
const IMG_SERVER = process.env.IMG_SERVER;

/** @type {import('next').NextConfig} */
const nextConfig = {
  //temporal for the ref.tsx
  images: {
    //unoptimized: true,
    domains: ["flowbite.com"]
  },
  //target: "serverless",
  //reactStrictMode: false,
  //swcMinify: true,
  async redirects() {
    console.log("===API_SERVER===", API_SERVER);
    console.log("===IMG_SERVER===", IMG_SERVER);
    return [
      // everything under /api to `backend/api`\
      {
        source: "/sapi/:path*",
        destination: `${API_SERVER}/:path*`,
        permanent: false,
      },
      {
        source: "/simg/:path*",
        destination: `${IMG_SERVER}/:path*`,
        permanent: false,
      },
      {
        source: '/index',
        destination: '/',
        permanent: false,
      },
      {
        source: '/home',
        destination: '/',
        permanent: false,
      }

    ];
  },
  async rewrites() {
    return [
      // Do not rewrite API routes
      /*{
        source: '/api/:any*',
        destination: '/api/:any*',
      },*/
      // Rewrite everything else to use `pages/index`
      /*
      {
        source: '/:any*',
        destination: '/http404',
      }
      */
    ];
  }
};

module.exports = nextConfig;

const intercept = require("intercept-stdout")

// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return ""
  }
  return text
}

if (process.env.NODE_ENV === "development") {
  intercept(interceptStdout)
}
