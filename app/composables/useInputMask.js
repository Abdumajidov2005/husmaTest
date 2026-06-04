/**
 * Input mask composable — telefon va narx (price) inputlari uchun.
 *
 * Sof (pure) format funksiyalari + cursorni saqlovchi `applyMask` handler.
 * SSR-safe: faqat string bilan ishlaydi, `import.meta.client` shart emas.
 *
 * Foydalanish (Form.vue):
 *   const { onPhoneInput, phoneDigits, onPriceInput, formatThousands } = useInputMask()
 *
 *   <input :value="form.phone" @input="onPhoneInput($event, v => form.phone = v)" />
 */

// Faqat raqamlarni qoldirish
const onlyDigits = (v) => String(v ?? '').replace(/\D/g, '')

/**
 * Davlat kodini (998) faqat KERAK bo'lganda olib tashlash.
 *
 * Diqqat: milliy raqam 9 xonali. Operator kodi "99" + ikkinchi raqam "8"
 * bo'lsa (mas. 99 876 54 32 → "998765432") bu ham 998 bilan boshlanadi,
 * lekin bu davlat kodi EMAS. Shu sababli 998 ni faqat umumiy uzunlik
 * 9 dan oshganda (ya'ni davlat kodi haqiqatan mavjud — to'liq paste) olib
 * tashlaymiz. Aks holda kiritilgan raqamni milliy deb qabul qilamiz.
 *
 * @param {string|number} value
 * @returns {string} eng ko'pi bilan 9 ta milliy raqam
 */
function nationalDigits(value) {
  let d = onlyDigits(value)
  // Mask doimo "+998 (" prefiksini ko'rsatadi — shuning uchun maydon qiymatini
  // qayta o'qiganda boshidagi "998" ni HAR DOIM olib tashlaymiz. Aks holda
  // prefiksdagi 998 ni milliy raqamga qo'shib, operator kodi buzilardi
  // (mas. "90" yozsa "+998 (99) 0..." bo'lib ketardi).
  if (d.startsWith('998')) d = d.slice(3)
  return d.slice(0, 9)
}

/**
 * O'zbekiston telefon raqamini formatlash.
 *   "998901234567" / "901234567" / "+998 (90) 1..."  →  "+998 (90) 123-45-67"
 * @param {string|number} value
 * @returns {string}
 */
export function formatUzPhone(value) {
  const d = nationalDigits(value)

  if (!d) return '' // bo'sh bo'lsa — placeholder ko'rinadi

  // Ajratuvchi belgilar faqat KEYINGI raqam bo'lganda qo'shiladi —
  // shunda o'chirish (backspace) qotib qolmaydi.
  let out = '+998 (' + d.slice(0, 2)
  if (d.length > 2) out += ') ' + d.slice(2, 5)
  if (d.length > 5) out += '-' + d.slice(5, 7)
  if (d.length > 7) out += '-' + d.slice(7, 9)
  return out
}

/**
 * Telefondan faqat milliy raqamlar (validatsiya/yuborish uchun).
 *   "+998 (90) 123-45-67" → "901234567"
 * @param {string|number} value
 * @returns {string}
 */
export function phoneDigits(value) {
  return nationalDigits(value)
}

/** To'liq (9 xonali) telefon raqami kiritilganmi? */
export function isPhoneComplete(value) {
  return phoneDigits(value).length === 9
}

/**
 * Narxni mingliklarga bo'sh joy bilan ajratish: 600000 → "600 000".
 * @param {string|number} value
 * @returns {string}
 */
export function formatThousands(value) {
  const d = onlyDigits(value)
  if (!d) return ''
  // Boshidagi keraksiz nollarni olib tashlaymiz (lekin yagona "0" qoladi)
  const clean = d.replace(/^0+(?=\d)/, '')
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Formatlangan narx matnidan toza Number. Bo'sh bo'lsa — null.
 * @param {string|number} value
 * @returns {number|null}
 */
export function parseThousands(value) {
  const d = onlyDigits(value)
  return d ? Number(d) : null
}

/**
 * Cursorni saqlagan holda input qiymatini formatlaydi.
 *
 * Vue bilan ishlash uchun muhim: biz `el.value` ni va `form` ref ni
 * BIR XIL formatlangan qiymatga o'rnatamiz. Shu sababli Vue qayta render
 * paytida DOM value o'zgarmaydi (patch bo'lmaydi) va cursor joyida qoladi.
 *
 * @param {Event}  e
 * @param {(raw:string)=>string} formatter
 * @param {{ cursorToEnd?: boolean }} [opts]
 *        cursorToEnd — prefiksli mask (telefon: +998) uchun, cursor oxiriga.
 * @returns {string} formatlangan qiymat
 */
export function applyMask(e, formatter, opts = {}) {
  const el = e.target
  const before = el.value
  const caret = el.selectionStart ?? before.length

  // cursordan oldingi raqamlar soni — keyin shu joyni tiklaymiz
  const digitsBefore = onlyDigits(before.slice(0, caret)).length

  const formatted = formatter(before)
  el.value = formatted

  // Cursorni qayta tiklash
  let pos = formatted.length
  if (!opts.cursorToEnd) {
    let seen = 0
    pos = 0
    while (pos < formatted.length && seen < digitsBefore) {
      if (/\d/.test(formatted[pos])) seen++
      pos++
    }
  }
  try { el.setSelectionRange(pos, pos) } catch { /* tel/text bo'lmasligi mumkin */ }

  return formatted
}

/**
 * Komponent ichida ishlatish uchun tayyor handler'lar.
 */
export function useInputMask() {
  /**
   * Telefon input handler. Telefon prefiksli (+998) bo'lgani uchun cursor oxirida.
   * @param {Event} e
   * @param {(val:string)=>void} setValue — masalan: v => form.phone = v
   */
  function onPhoneInput(e, setValue) {
    setValue(applyMask(e, formatUzPhone, { cursorToEnd: true }))
  }

  /**
   * Narx input handler. Formatlangan matn + toza Number ni qaytaradi.
   * @param {Event} e
   * @param {(display:string, num:number|null)=>void} setValue
   */
  function onPriceInput(e, setValue) {
    const display = applyMask(e, formatThousands)
    setValue(display, parseThousands(display))
  }

  return {
    // handlerlar
    onPhoneInput,
    onPriceInput,
    // pure helperlar
    formatUzPhone,
    phoneDigits,
    isPhoneComplete,
    formatThousands,
    parseThousands,
  }
}
