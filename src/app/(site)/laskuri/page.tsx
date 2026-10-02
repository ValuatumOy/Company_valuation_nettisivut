import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { ValuationCalculator } from '@/components/ValuationCalculator'

export const metadata: Metadata = {
  title: 'Yrityksen arvonmäärityslaskuri – ilmainen suuntaa-antava arvio',
  description:
    'Laske karkea yritysarvohaarukka liikevaihdon, EBITDA-marginaalin ja nettovelan perusteella. Laskuri käyttää kiinteitä EV/EBITDA-oletuksia, ei ajantasaisia markkinakertoimia.',
  alternates: { canonical: '/laskuri' },
  openGraph: {
    title: 'Yrityksen arvonmäärityslaskuri – ilmainen suuntaa-antava arvio',
    description:
      'Karkea yritysarvohaarukka liikevaihdon, EBITDA-marginaalin ja nettovelan avulla. Työkalu käyttää kiinteitä suuntaa-antavia toimialaoletuksia.',
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
              Yrityksen arvonmäärityslaskuri
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-[17px] font-light leading-relaxed text-white/75">
              Valitse toimiala ja syötä liikevaihto, käyttökate-% sekä nettovelka. Laskuri näyttää
              näillä tiedoilla karkean arvion yrityksen arvosta kiinteillä oletuskertoimilla.
              Tulos auttaa hahmottamaan kokoluokkaa, mutta ei ole markkinahinta eikä korvaa
              yrityskohtaista analyysia.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-light tracking-[-0.02em] text-charcoal">Mitä tietoja laskuri tarvitsee?</h2>
            <p className="mt-3 text-[15px] font-light leading-relaxed text-charcoal/75">
              Valitse toimiala, syötä tarkastelujakson liikevaihto ja arvioi EBITDA-marginaali eli
              käyttökate suhteessa liikevaihtoon. Laskuri laskee niiden avulla käyttökatteen.
              Nettovelka on korolliset velat vähennettynä kassalla. Positiivinen nettovelka pienentää
              oman pääoman arviota; negatiivinen nettovelka tarkoittaa nettokassaa ja kasvattaa sitä
              tässä yksinkertaistetussa laskussa.
            </p>
          </Reveal>
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
              Laskuri laskee ensin EBITDA:n eli käyttökatteen (liikevaihto × EBITDA-marginaali), kertoo sen valitun toimialan EV/EBITDA-oletushaarukalla ja vähentää nettovelan. Näin se näyttää suuntaa-antavan yritysarvon (EV) ja oman pääoman arvon haarukan. Tämä yksinkertaistus ei huomioi kaikkia tase-eriä tai kaupanteon mahdollisia oikaisuja. EV:n ja EBITDA:n suhteen tulkintaa kuvaa myös {` `}
              <a href="https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/market-based-valuation-price-enterprise-value-multiples" target="_blank" rel="noreferrer" className="text-green-deep underline underline-offset-2 hover:text-green">CFA Instituten aineisto</a>.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-8 rounded-3xl bg-off-white p-6 md:p-8">
              <h3 className="text-lg font-medium text-forest">Kuvitteellinen laskuesimerkki</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal/75">
                Kuvitteellisen yrityksen liikevaihto on 800 000 € ja EBITDA-marginaali 12,5 %, joten käyttökate on 100 000 €. Jos vain laskutavan havainnollistamiseksi käytetään kerrointa 7,3×, yritysarvoksi saadaan 730 000 €. Kun nettovelkaa on 80 000 €, oman pääoman laskennallinen arvo on 650 000 €.
              </p>
              <p className="mt-4 text-[13.5px] leading-relaxed text-steel">
                Luvut ja 7,3× kerroin ovat keksittyjä: ne eivät kuvaa markkinahintaa eivätkä laskurin toimialaoletusta. Esimerkki havainnollistaa vain kaavaa. {` `}
                <Link href="/kertoimet" className="text-green-deep underline underline-offset-2 hover:text-green">
                  Katso laskurin oletuskertoimet ja niiden rajat.
                </Link>
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-8 text-[14px] leading-relaxed text-charcoal/75">
              Laskuri ei arvioi tappiollista yritystä: EBITDA-marginaalin alaraja on nolla, joten työkalu ei mallinna negatiivista käyttökatetta tai siitä palautumista. Myöskään vähintään nollaan rajautuva osakearvotulos ei ole arvio tappioyhtiön arvosta. Laskuri ei mallinna kassavirtaennusteita, yrityskohtaisia riskejä, käyttöpääomaa eikä kaupanteon muita oikaisuja. Lue myös {` `}
              <Link href="/blogi/miten-yrityksen-arvo-maaritetaan" className="text-green-deep underline underline-offset-2 hover:text-green">
                miten yrityksen arvoa määritetään eri menetelmillä
              </Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Usein kysyttyä
            </p>
            <h2 className="mt-3 text-balance text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-4xl">
              Yrityksen arvonmäärityslaskurin rajat ja seuraavat askeleet
            </h2>
          </Reveal>

          <div className="mt-8 divide-y divide-mist border-y border-mist">
            <details className="group py-5" open>
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Riittääkö pelkkä liikevaihto yrityksen arvon laskemiseen?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Ei tähän laskuriin. Se muodostaa käyttökatteen liikevaihdosta ja EBITDA-marginaalista, joten pelkkä liikevaihto ei kerro laskennan kannalta tarvittavaa kannattavuutta. Samankokoisilla yrityksillä voi olla erilainen kustannusrakenne. Liikevaihtokertoimista ja niiden rajoista voit lukea {` `}
                <Link href="/kertoimet" className="text-green-deep underline underline-offset-2 hover:text-green">toimialakertoimien sivulta</Link>.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Miten nettovelka vaikuttaa laskurin tulokseen?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Tässä laskurissa nettovelka tarkoittaa korollisia velkoja vähennettynä kassalla. Positiivinen nettovelka vähennetään EV:stä oman pääoman arvoa laskettaessa. Jos kassaa on velkoja enemmän, nettovelka on negatiivinen ja nostaa laskennallista oman pääoman arvoa. Käytä keskenään samaan ajankohtaan ja kokonaisuuteen liittyviä lukuja; laskuri ei tee tase- tai kauppakohtaisia lisäoikaisuja.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Soveltuuko laskuri listaamattoman yrityksen arvon arviointiin?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Se antaa karkean suuntaa-antavan haarukan myös listaamattomalle yritykselle, mutta ei arvioi yrityksen omia tietoja tai sitä, kuinka hyvin listatut verrokit sopivat siihen. Esimerkiksi asiakaskeskittymä, omistajariippuvuus, sopimuskanta, investointitarve ja kasvunäkymä voivat muuttaa kuvaa olennaisesti. Laskurin kiinteitä kertoimia ei pidä tulkita nykyisen markkinan tai toteutuneiden kauppojen hinnoiksi. {` `}
                <Link href="/blogi/miten-yrityksen-arvo-maaritetaan" className="text-green-deep underline underline-offset-2 hover:text-green">Eri arvonmääritysmenetelmät</Link>.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Mitä teen suuntaa-antavan arvion jälkeen?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Käytä haarukkaa lähtökohtana ja tarkista, millä oletuksilla se syntyy. Jos harkitset myyntiä, {` `}
                <Link href="/blogi/yrityksen-arvonmaarityksen-hinta" className="text-green-deep underline underline-offset-2 hover:text-green">lue arvonmääritysraportin hinnasta ja sisällöstä</Link>.
                {` `}Jos olet jo saanut tarjouksen, tämä laskuri ei yksin arvioi tarjouksen yrityskohtaista perustelua; tutustu myös artikkeliin {` `}
                <Link href="/blogi/sain-ostotarjouksen-yrityksesta" className="text-green-deep underline underline-offset-2 hover:text-green">yrityksestä saadun ostotarjouksen arvioinnista</Link>.
                {` `}Yrityskohtaisen raportin tilaaminen alkaa {` `}
                <Link href="/yritys" className="text-green-deep underline underline-offset-2 hover:text-green">yrityshausta</Link>.
              </p>
            </details>
          </div>
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
