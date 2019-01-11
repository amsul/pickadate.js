const React = require('react')

class Footer extends React.Component {
  docUrl(doc) {
    const baseUrl = this.props.config.baseUrl
    const docsUrl = this.props.config.docsUrl
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
    return `${baseUrl}${docsPart}${doc}`
  }

  pageUrl(doc) {
    const baseUrl = this.props.config.baseUrl
    return baseUrl + doc
  }

  render() {
    const baseUrl = this.props.config.baseUrl
    return (
      <footer className='nav-footer' id='footer'>
        <section className='sitemap'>
          <a href={this.props.config.baseUrl} className='nav-home'>
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width='66'
                height='58'
              />
            )}
          </a>
          <div>
            <h5>Documentation</h5>
            <a href={this.docUrl('introduction')}>Getting Started</a>
            <a href={this.docUrl('binding-javascript')}>JavaScript</a>
            <a href={this.docUrl('binding-react-dom')}>React DOM</a>
            <a href={this.docUrl('binding-react-native')}>React Native</a>
            <a href={this.docUrl('binding-jquery')}>jQuery</a>
          </div>
          <div>
            <h5>Community</h5>
            <a
              href='https://stackoverflow.com/questions/tagged/pickadate'
              target='_blank'
              rel='noreferrer noopener'
            >
              Stack Overflow
            </a>
            <a
              href='https://spectrum.chat/pickadate'
              target='_blank'
              rel='noreferrer noopener'
            >
              Spectrum
            </a>
          </div>
          <div>
            <h5>More</h5>
            {/*<a
              href='https://twitter.com/pickadate_js'
              target='_blank'
              rel='noreferrer noopener'
            >
              Twitter
            </a>*/}
            <a href='https://github.com/amsul/pickadate.js'>GitHub</a>
            <a
              className='github-button'
              href='https://github.com/amsul/pickadate.js'
              data-show-count='true'
              data-count-href='/amsul/pickadate.js/stargazers'
              aria-label='Star amsul/pickadate.js on GitHub'
              data-count-aria-label='# stargazers on GitHub'
              aria-label='Star this project on GitHub'
            >
              Star
            </a>
          </div>
        </section>
        <section className='copyright'>{this.props.config.copyright}</section>
      </footer>
    )
  }
}

module.exports = Footer
