import withTM from 'next-transpile-modules'; // Import next-transpile-modules

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    config.module.rules.push({
      test: /\.m?js$/,
      include: /node_modules/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

export default withTM([
  '@ant-design/icons',
  '@ant-design/icons-svg',
  'rc-util',
  'rc-pagination',
  'rc-picker',  // Add rc-picker to be transpiled
])(nextConfig);
