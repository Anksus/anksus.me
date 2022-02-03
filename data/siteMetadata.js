const siteMetadata = {
  title: 'Blog - Ankit Susne',
  author: 'Ankit Susne',
  headerTitle: '',
  description:
    "Curious mind, developer, and an otaku with a knack for building things. I'm a 21-year-old from India and currently a senior at IIT(BHU).",
  language: 'en-us',
  siteUrl: 'https://anksus.me',
  siteRepo: 'https://github.com/Anksus/anksus.me',
  siteLogo: '/static/images/logo.png',
  image: '/static/images/ankit.jpg',
  socialBanner: '/static/images/twitter-card.png',
  email: 'ronaksusne@gmail.com',
  github: 'https://github.com/Anksus',
  twitter: 'https://twitter.com/AnkitSusne',
  facebook: 'https://facebook.com',
  youtube: 'https://youtube.com',
  linkedin: 'https://www.linkedin.com/in/ankitsusne/',
  locale: 'en-US',
  comment: {
    provider: 'giscus', // supported providers: giscus, utterances, disqus
    giscusConfig: {
      repo: 'Anksus/anksus.me', // username/repoName
      // Visit the link below, enter your repo in the configuration section and copy the script data parameters
      // Before that you should create a new Github discussions category with the Announcements type so that new discussions can only be created by maintainers and giscus
      // https://giscus.app/
      repositoryId: 'MDEwOlJlcG9zaXRvcnkzODc4MTk3NjA=',
      category: 'Blog Comments',
      categoryId: 'DIC_kwDOFx2o8M4B-Y70',
      mapping: 'pathname', // supported options: pathname, url, title
      reactions: '1', // Emoji reactions: 1 = enable / 0 = disable
      // Send discussion metadata periodically to the parent window: 1 = enable / 0 = disable
      metadata: '0',
      // theme example: light, dark, dark_dimmed, dark_high_contrast
      // transparent_dark, preferred_color_scheme, custom
      theme: 'light',
      // theme when dark mode
      darkTheme: 'transparent_dark',
      // If the theme option above is set to 'custom`
      // please provide a link below to your custom theme css file.
      // example: https://giscus.app/themes/custom_example.css
      themeURL: '',
    },
    utterancesConfig: {
      repo: '', // username/repoName
      issueTerm: '', // supported options: pathname, url, title
      label: '', // label (optional): Comment 💬
      // theme example: github-light, github-dark, preferred-color-scheme
      // github-dark-orange, icy-dark, dark-blue, photon-dark, boxy-light
      theme: '',
      // theme when dark mode
      darkTheme: '',
    },
    disqus: {
      // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
      shortname: '',
    },
  },
}

module.exports = siteMetadata
