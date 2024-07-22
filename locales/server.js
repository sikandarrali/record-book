import { createI18nServer } from 'next-international/server'

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
    ur: () => import('./Urdu.js'),
    en: () => import('./English.js'),
})