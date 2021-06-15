// module.exports = {
//   publicPath: '/vue_crm/dist/'
// }
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue_crm/dist/'
    : '/'
}