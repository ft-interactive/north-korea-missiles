export default () => ({ // eslint-disable-line

  // link file UUID
  id: 'de542624-4063-11e7-9d56-25f963e998b2',

  // canonical URL of the published page
  // https://ig.ft.com/north-korea-missiles get filled in by the ./configure script
  url: 'https://ig.ft.com/north-korea-missiles',

  // To set an exact publish date do this:
  //       new Date('2016-05-17T17:11:22Z')
  publishedDate: new Date('2017-07-04T15:23:17Z'),

  headline: 'North Korea: A rising threat',

  // summary === standfirst (Summary is what the content API calls it)
  summary: "Pyongyang's development of missiles and nuclear weapons rings alarms in Washington",

  topic: {
    name: 'Asia Pacific',
    url: 'https://www.ft.com/world/asia-pacific',
  },

  relatedArticle: {
    text: '',
    url: '',
    // text: 'Related article »',
    // url: 'https://en.wikipedia.org/wiki/Politics_and_the_English_Language',
  },

  mainImage: {
    title: '',
    description: '',
    credit: '',
    url: 'http://ft-ig-images-prod.s3-website-eu-west-1.amazonaws.com/v1/8502626190-ua6uo.jpg',
    width: 2048, // ensure correct width
    height: 1152, // ensure correct height
  },

  // Byline can by a plain string, markdown, or array of authors
  // if array of authors, url is optional
  byline: [
    { name: 'Bryan Harris', url: 'https://www.ft.com/stream/authorsId/Q0ItQkg2Nzg5MA==-QXV0aG9ycw==' },
    { name: 'Ian Bott', url: 'https://www.ft.com/ian-bott'},
    { name: 'Jane Pong', url: 'https://www.ft.com/jane-pong'},
    { name: 'Lauren Leatherby', url: 'https://www.ft.com/lauren-leatherby'}
  ],

  // Appears in the HTML <title>
  title: 'North Korea: A rising threat',

  // meta data
  description: "Pyongyang's development of missiles and nuclear weapons rings alarms in Washington",

  /*
  TODO: Select Twitter card type -
        summary or summary_large_image

        Twitter card docs:
        https://dev.twitter.com/cards/markup
  */
  twitterCard: 'summary',

  /*
  TODO: Do you want to tweak any of the
        optional social meta data?
  */
  // General social
  // socialImage: '',
  // socialHeadline: '',
  // socialDescription: '',
  // twitterCreator: '@author's_account', // shows up in summary_large_image cards

  // TWEET BUTTON CUSTOM TEXT
  // tweetText: '',
  twitterRelatedAccounts: ['bryanhimself', 'ian_bott_artist', 'officeofjane', 'LaurenLeatherby', 'ftdata'], // Twitter lists these as suggested accounts to follow after a user tweets (do not include @)

  // Fill out the Facebook/Twitter metadata sections below if you want to
  // override the General social options above

  // TWITTER METADATA (for Twitter cards)
  twitterImage: 'https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fft-ig-images-prod.s3-website-eu-west-1.amazonaws.com%2Fv1%2F8502626190-ua6uo.jpg?source=ig&width=300&height=300&gravity=faces',
  // twitterHeadline: '',
  // twitterDescription: '',

  // FACEBOOK
  // facebookImage: '',
  // facebookHeadline: '',
  // facebookDescription: '',

  // ADVERTISING
  ads: {
    // Ad unit hierarchy makes ads more granular.
    gptSite: 'ft.com',
    // Start with ft.com and /companies /markets /world as appropriate to your story
    gptZone: false,
    // granular targeting is optional and will be specified by the ads team
    dfpTargeting: false,
  },

  tracking: {

    /*

    Microsite Name

    e.g. guffipedia, business-books, baseline.
    Used to query groups of pages, not intended for use with
    one off interactive pages. If you're building a microsite
    consider more custom tracking to allow better analysis.
    Also used for pages that do not have a UUID for whatever reason
    */
    // micrositeName: '',

    /*
    Product name

    This will usually default to IG
    however another value may be needed
    */
    // product: '',
  },
});
