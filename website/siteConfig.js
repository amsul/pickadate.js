// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const baseUrl = '/pickadate.js/'

const siteConfig = {
  title: 'pickadate.js',
  tagline: 'The composable date & time picker.',
  url: 'https://amsul.github.io',
  baseUrl,

  // Used for publishing and more
  projectName: 'pickadate.js',
  organizationName: 'amsul',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'introduction', label: 'Documentation' },
    { href: 'https://github.com/amsul/pickadate.js', label: 'Discussions' },
    { href: 'https://github.com/amsul/pickadate.js', label: 'GitHub' },
    { href: 'https://github.com/amsul/pickadate.js', label: 'v3 Docs' },
  ],

  // Path to images for header/footer
  headerIcon: 'img/logo.svg',
  footerIcon: 'img/favicon.svg',
  favicon: 'img/favicon.png',

  disableHeaderTitle: true,

  // Colors for website
  colors: {
    primaryColor: '#0474c5',
    secondaryColor: '#0474c5',
  },

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © 2012-${new Date().getFullYear()} Amsul and the pickadate.js documentation authors.`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'tomorrow',
  },
  usePrism: ['html', 'js', 'jsx'],

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    {
      src: 'https://unpkg.com/pickadate@5.0.0-alpha.0/builds/index.js',
      defer: true,
    },
    {
      src: `${baseUrl}js/custom.js`,
      defer: true,
    },
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo.png',
  twitterImage: 'img/logo.png',
}

module.exports = siteConfig
