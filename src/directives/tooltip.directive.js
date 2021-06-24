import localizeFilter from '@/filters/localize.filter' // импортируем фильтр

export default {
  bind(el, {value}) { // создает тултип
    window.M.Tooltip.init(el, {html: localizeFilter(value)})
  },
  unbind(el) { // уничтожает тултип, при переходе не другую страницу
    const tooltip = window.M.Tooltip.getInstance(el)
    if (tooltip && tooltip.destroy) {
      tooltip.destroy()
    }
  }
}