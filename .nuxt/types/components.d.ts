
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

interface _GlobalComponents {
  AppFooter: typeof import("../../app/components/app/Footer.vue")['default']
  AppHeader: typeof import("../../app/components/app/Header.vue")['default']
  AppHeaderTab: typeof import("../../app/components/app/HeaderTab.vue")['default']
  AppLogo: typeof import("../../app/components/app/Logo.vue")['default']
  ApplicationForm: typeof import("../../app/components/application/Form.vue")['default']
  HomeFeatureCard: typeof import("../../app/components/home/FeatureCard.vue")['default']
  HomeHeroCarousel: typeof import("../../app/components/home/HeroCarousel.vue")['default']
  HomeReviewCard: typeof import("../../app/components/home/ReviewCard.vue")['default']
  HomeStatCard: typeof import("../../app/components/home/StatCard.vue")['default']
  HomeTab: typeof import("../../app/components/home/Tab.vue")['default']
  ProfileAnketaCard: typeof import("../../app/components/profile/AnketaCard.vue")['default']
  RieltorApplicationCard: typeof import("../../app/components/rieltor/ApplicationCard.vue")['default']
  RieltorCarousel: typeof import("../../app/components/rieltor/Carousel.vue")['default']
  RieltorTab: typeof import("../../app/components/rieltor/Tab.vue")['default']
  UiButton: typeof import("../../app/components/ui/Button.vue")['default']
  UiDarkModeSwitch: typeof import("../../app/components/ui/DarkModeSwitch.vue")['default']
  UiFlag: typeof import("../../app/components/ui/Flag.vue")['default']
  UiFormField: typeof import("../../app/components/ui/FormField.vue")['default']
  UiIcons: typeof import("../../app/components/ui/Icons.vue")['default']
  UiInfoCard: typeof import("../../app/components/ui/InfoCard.vue")['default']
  UiLanguageSwitcher: typeof import("../../app/components/ui/LanguageSwitcher.vue")['default']
  UiLanguageSwitcherCompact: typeof import("../../app/components/ui/LanguageSwitcherCompact.vue")['default']
  UiSuccessModal: typeof import("../../app/components/ui/SuccessModal.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAppFooter: LazyComponent<typeof import("../../app/components/app/Footer.vue")['default']>
  LazyAppHeader: LazyComponent<typeof import("../../app/components/app/Header.vue")['default']>
  LazyAppHeaderTab: LazyComponent<typeof import("../../app/components/app/HeaderTab.vue")['default']>
  LazyAppLogo: LazyComponent<typeof import("../../app/components/app/Logo.vue")['default']>
  LazyApplicationForm: LazyComponent<typeof import("../../app/components/application/Form.vue")['default']>
  LazyHomeFeatureCard: LazyComponent<typeof import("../../app/components/home/FeatureCard.vue")['default']>
  LazyHomeHeroCarousel: LazyComponent<typeof import("../../app/components/home/HeroCarousel.vue")['default']>
  LazyHomeReviewCard: LazyComponent<typeof import("../../app/components/home/ReviewCard.vue")['default']>
  LazyHomeStatCard: LazyComponent<typeof import("../../app/components/home/StatCard.vue")['default']>
  LazyHomeTab: LazyComponent<typeof import("../../app/components/home/Tab.vue")['default']>
  LazyProfileAnketaCard: LazyComponent<typeof import("../../app/components/profile/AnketaCard.vue")['default']>
  LazyRieltorApplicationCard: LazyComponent<typeof import("../../app/components/rieltor/ApplicationCard.vue")['default']>
  LazyRieltorCarousel: LazyComponent<typeof import("../../app/components/rieltor/Carousel.vue")['default']>
  LazyRieltorTab: LazyComponent<typeof import("../../app/components/rieltor/Tab.vue")['default']>
  LazyUiButton: LazyComponent<typeof import("../../app/components/ui/Button.vue")['default']>
  LazyUiDarkModeSwitch: LazyComponent<typeof import("../../app/components/ui/DarkModeSwitch.vue")['default']>
  LazyUiFlag: LazyComponent<typeof import("../../app/components/ui/Flag.vue")['default']>
  LazyUiFormField: LazyComponent<typeof import("../../app/components/ui/FormField.vue")['default']>
  LazyUiIcons: LazyComponent<typeof import("../../app/components/ui/Icons.vue")['default']>
  LazyUiInfoCard: LazyComponent<typeof import("../../app/components/ui/InfoCard.vue")['default']>
  LazyUiLanguageSwitcher: LazyComponent<typeof import("../../app/components/ui/LanguageSwitcher.vue")['default']>
  LazyUiLanguageSwitcherCompact: LazyComponent<typeof import("../../app/components/ui/LanguageSwitcherCompact.vue")['default']>
  LazyUiSuccessModal: LazyComponent<typeof import("../../app/components/ui/SuccessModal.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
