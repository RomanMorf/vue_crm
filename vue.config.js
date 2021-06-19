// module.exports = {
//   publicPath: '/vue_crm/'
// }

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue_crm/'
    : '/'
}