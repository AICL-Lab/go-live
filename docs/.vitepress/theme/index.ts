import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  setup() {
    if (typeof window !== 'undefined') {
      const updateThemeColor = () => {
        const isDark = document.documentElement.classList.contains('dark')
        const meta = document.querySelector('meta[name="theme-color"]')
        if (meta) {
          meta.setAttribute('content', isDark ? '#0d1117' : '#0969da')
        }
      }

      const observer = new MutationObserver(() => {
        updateThemeColor()
      })

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })

      updateThemeColor()
    }
  },
}
