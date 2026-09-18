import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { ValuationCalculator } from '@/components/ValuationCalculator'

export const metadata: Metadata = {
  title: 'Yrityksen arvonmäärityslaskuri – ilmainen suuntaa-antava arvio',
  description:
    'Laske yrityksesi arvolle karkea haarukka toimialakertoimilla (EV/EBITDA). Ilmainen laskuri antaa suuntaa-antavan arvion — varsinainen raportti syventää sen kassavirta-analyysillä ja riskiarviolla.',
  alternates: { canonical: '/laskuri' },
  openGraph: {
    title: 'Yrityksen arvonmäärityslaskuri – ilmainen suuntaa-antava arvio',
    description:
      'Karkea arvohaarukka toimialakertoimilla. Suuntaa-antava työkalu ennen varsinaista arvonmääritysraporttia.',
    type: 'website',
  },
}

const REPORT_DIFFERENCES = [
  {
    title: 'Kassavirta-analyysi (DCF)',
    text: 'Raportti mallintaa yrityksen tulevat kassavirrat ja diskonttaa ne yrityskohtaisella tuottovaatimuksella. Pelkkä kerroin ei huomioi kannattavuuden suuntaa eikä investointitarpeita.',
  },
  {
    title: 'Yrityskohtaiset riskit',
    text: 'Asiakaskeskittymä, avainhenkilöriippuvuus, taseen laatu ja käyttöpääoman sitoutuminen vaikuttavat arvoon merkittävästi — laskuri ei näe niitä.',
  },
  {
    title: 'Skenaariot ja herkkyys',
    text: 'Raportti näyttää, miten arvo muuttuu eri oletuksilla. Neuvottelussa perusteltu haarukka skenaarioineen on käyttökelpoisempi kuin yksi luku.',
  },
]

export default function LaskuriPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="hero-pattern absolute inset-0" aria-hidden="true" />
        <div className="hero-glow absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-40">
          <Reveal className="max-w-3xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-light">
              Ilmainen työkalu
            </p>
            <h1 className="mt-4 text-balance text-4xl font-light tracking-[-0.02em] lg:text-5xl">
              Arvonmäärityslaskuri
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-[17px] font-light leading-relaxed text-white/75">
              Laskuri antaa karkean, suuntaa-antavan arvion yrityksen arvosta listattujen verrokkien
              kertoimilla. Se ei korvaa varsinaista analyysia — mutta auttaa hahmottamaan
              kokoluokan ennen raportin tilaamista.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <ValuationCalculator />
          </Reveal>
        </div>
      </section>

      <section className="border-y border-mist bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Miten laskelma toimii
            </p>
            <h2 className="mt-3 text-balance text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-4xl">
              EBITDA-kertoimesta yritysarvoon ja osakearvoon
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-charcoal-mid">
              Laskuri laskee ensin käyttökatteen (liikevaihto × EBITDA-%), kertoo käyttökatteen toimialalle asetetulla EV/EBITDA-haarukalla ja vähentää nettovelan. Näin se antaa karkean yritysarvon (EV) ja oman pääoman arvon haarukan. Nettovelka tarkoittaa tässä korollisia velkoja miinus kassa.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 rounded-3xl bg-off-white p-6 md:p-8">
              <h3 className="text-lg font-medium text-forest">Havainnollistava lasku</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal/75">
                Esimerkiksi yrityspalvelujen 5–9× EV/EBITDA-haarukalla: jos liikevaihto on 5 M€ ja EBITDA-marginaali 20 %, käyttökate on 1 M€ ja yritysarvo 5–9 M€. Kun nettovelkaa on 1 M€, oman pääoman arvo on 4–8 M€ ennen muita kauppakohtaisia oikaisuja.
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-steel">
                Esimerkki havainnollistaa laskukaavaa, ei anna markkinahintaa tai arviota tietystä yrityksestä. {` `}
                <Link href="/kertoimet" className="text-green-deep underline underline-offset-2 hover:text-green">
                  Katso laskurissa käytetyt kertoimet ja niiden rajat.
                </Link>
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-8 text-[14px] leading-relaxed text-charcoal/75">
              Työkalu ei arvioi tappiollista yritystä: EBITDA-marginaalin alaraja on nolla, ja osakearvon tulos rajataan vähintään nollaan. Se ei mallinna kassavirtaennusteita, yrityskohtaisia riskejä, käyttöpääomaa eikä kaupanteon muita oikaisuja. Lue myös {` `}
              <Link href="/blogi/miten-yrityksen-arvo-maaritetaan" className="text-green-deep underline underline-offset-2 hover:text-green">
                miten yrityksen arvoa määritetään eri menetelmillä
              </Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Miksi raportti eroaa laskurista
            </p>
            <h2 className="mt-3 text-balance text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-4xl">
              Kerroin kertoo kokoluokan — analyysi kertoo perustelut.
            </h2>
            <p className="mt-5 text-pretty text-[16px] font-light leading-relaxed text-charcoal-mid">
              Varsinainen arvonmääritysraportti käyttää yhtiölle soveltuvaa menetelmää, ennusteita,
              riskiarviota ja skenaarioita. Esimerkkiraportista näet myös, milloin markkinakertoimet
              hylätään. Raportti on analyysi päätöksenteon
              tueksi, ei tilintarkastus, fairness opinion tai sijoitusneuvontaa.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REPORT_DIFFERENCES.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <article className="h-full rounded-3xl border border-mist bg-white p-7 transition-all duration-300 hover:border-green/40 hover:shadow-[0_20px_60px_rgba(26,36,32,0.08)]">
                  <h3 className="text-[17px] font-medium text-forest">{item.title}</h3>
                  <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-3xl bg-forest p-8 text-white md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-light tracking-tight">
                  Muuta haarukka perustelluksi arvonmääritykseksi.
                </h2>
                <p className="mt-2 text-[15px] font-light text-white/70">
                  Raportti valmistuu tilinpäätöstiedoista automaattisesti — ilman kokouksia.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/yritys"
                  className="rounded-full bg-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-deep"
                >
                  Tilaa raportti
                </Link>
                <Link
                  href="/kertoimet"
                  className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-light text-white/90 transition-colors hover:bg-white/10"
                >
                  Katso toimialakertoimet
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
