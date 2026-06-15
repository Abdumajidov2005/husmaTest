
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T


export const AppFooter: typeof import("../app/components/app/Footer.vue")['default']
export const AppHeader: typeof import("../app/components/app/Header.vue")['default']
export const AppHeaderTab: typeof import("../app/components/app/HeaderTab.vue")['default']
export const AppLogo: typeof import("../app/components/app/Logo.vue")['default']
export const ApplicationForm: typeof import("../app/components/application/Form.vue")['default']
export const HomeFeatureCard: typeof import("../app/components/home/FeatureCard.vue")['default']
export const HomeHeroCarousel: typeof import("../app/components/home/HeroCarousel.vue")['default']
export const HomeReviewCard: typeof import("../app/components/home/ReviewCard.vue")['default']
export const HomeStatCard: typeof import("../app/components/home/StatCard.vue")['default']
export const HomeTab: typeof import("../app/components/home/Tab.vue")['default']
export const ProfileAnketaCard: typeof import("../app/components/profile/AnketaCard.vue")['default']
export const RieltorApplicationCard: typeof import("../app/components/rieltor/ApplicationCard.vue")['default']
export const RieltorCarousel: typeof import("../app/components/rieltor/Carousel.vue")['default']
export const RieltorTab: typeof import("../app/components/rieltor/Tab.vue")['default']
export const UiButton: typeof import("../app/components/ui/Button.vue")['default']
export const UiDarkModeSwitch: typeof import("../app/components/ui/DarkModeSwitch.vue")['default']
export const UiFlag: typeof import("../app/components/ui/Flag.vue")['default']
export const UiFormField: typeof import("../app/components/ui/FormField.vue")['default']
export const UiIcons: typeof import("../app/components/ui/Icons.vue")['default']
export const UiInfoCard: typeof import("../app/components/ui/InfoCard.vue")['default']
export const UiLanguageSwitcher: typeof import("../app/components/ui/LanguageSwitcher.vue")['default']
export const UiLanguageSwitcherCompact: typeof import("../app/components/ui/LanguageSwitcherCompact.vue")['default']
export const UiSuccessModal: typeof import("../app/components/ui/SuccessModal.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAppFooter: LazyComponent<typeof import("../app/components/app/Footer.vue")['default']>
export const LazyAppHeader: LazyComponent<typeof import("../app/components/app/Header.vue")['default']>
export const LazyAppHeaderTab: LazyComponent<typeof import("../app/components/app/HeaderTab.vue")['default']>
export const LazyAppLogo: LazyComponent<typeof import("../app/components/app/Logo.vue")['default']>
export const LazyApplicationForm: LazyComponent<typeof import("../app/components/application/Form.vue")['default']>
export const LazyHomeFeatureCard: LazyComponent<typeof import("../app/components/home/FeatureCard.vue")['default']>
export const LazyHomeHeroCarousel: LazyComponent<typeof import("../app/components/home/HeroCarousel.vue")['default']>
export const LazyHomeReviewCard: LazyComponent<typeof import("../app/components/home/ReviewCard.vue")['default']>
export const LazyHomeStatCard: LazyComponent<typeof import("../app/components/home/StatCard.vue")['default']>
export const LazyHomeTab: LazyComponent<typeof import("../app/components/home/Tab.vue")['default']>
export const LazyProfileAnketaCard: LazyComponent<typeof import("../app/components/profile/AnketaCard.vue")['default']>
export const LazyRieltorApplicationCard: LazyComponent<typeof import("../app/components/rieltor/ApplicationCard.vue")['default']>
export const LazyRieltorCarousel: LazyComponent<typeof import("../app/components/rieltor/Carousel.vue")['default']>
export const LazyRieltorTab: LazyComponent<typeof import("../app/components/rieltor/Tab.vue")['default']>
export const LazyUiButton: LazyComponent<typeof import("../app/components/ui/Button.vue")['default']>
export const LazyUiDarkModeSwitch: LazyComponent<typeof import("../app/components/ui/DarkModeSwitch.vue")['default']>
export const LazyUiFlag: LazyComponent<typeof import("../app/components/ui/Flag.vue")['default']>
export const LazyUiFormField: LazyComponent<typeof import("../app/components/ui/FormField.vue")['default']>
export const LazyUiIcons: LazyComponent<typeof import("../app/components/ui/Icons.vue")['default']>
export const LazyUiInfoCard: LazyComponent<typeof import("../app/components/ui/InfoCard.vue")['default']>
export const LazyUiLanguageSwitcher: LazyComponent<typeof import("../app/components/ui/LanguageSwitcher.vue")['default']>
export const LazyUiLanguageSwitcherCompact: LazyComponent<typeof import("../app/components/ui/LanguageSwitcherCompact.vue")['default']>
export const LazyUiSuccessModal: LazyComponent<typeof import("../app/components/ui/SuccessModal.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
