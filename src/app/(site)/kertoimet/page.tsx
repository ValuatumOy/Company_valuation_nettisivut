import type { Metadata } from 'next'
import Link from 'next/link'
import { Reveal } from '@/components/Reveal'
import { SECTOR_RANGES, WISDOM_PEERS } from '@/lib/marketMultiples'

export const metadata: Metadata = {
  title: 'Arvostuskertoimet toimialoittain – EV/EBITDA ja EV/Liikevaihto',
  description:
    'Tutustu Valuatumin kiinteisiin, suuntaa-antaviin kerroinoletuksiin ja listattujen verrokkien tunnuslukuihin. Lue, miten EV/EBITDA- ja EV/Liikevaihto-kertoimia tulkitaan.',
  alternates: { canonical: '/kertoimet' },
  openGraph: {
    title: 'Arvostuskertoimet toimialoittain – EV/EBITDA ja EV/Liikevaihto',
    description:
      'Valuatumin kiinteät, suuntaa-antavat kerroinoletukset ja niistä erilliset listattujen verrokkien tunnusluvut arvonmäärityksen tueksi.',
    type: 'article',
  },
}

const MULTIPLE_DEFINITIONS = [
  {
    term: 'EV/EBITDA',
    text: 'Yritysarvo jaettuna käyttökatteella. Kerroin auttaa vertaamaan liiketoimintoja ennen rahoitusrakenteen huomioimista. Se antaa yritysarvon, ei suoraan osakkeiden hintaa: oman pääoman arvo saadaan vähentämällä yritysarvosta nettovelka.',
  },
  {
    term: 'EV/Liikevaihto',
    text: 'Yritysarvo suhteessa liikevaihtoon. Sitä voidaan käyttää, kun EBITDA ei vielä kuvaa liiketoimintaa mielekkäästi. Kerroin ei yksin kerro kannattavuudesta, joten sitä pitää tarkastella yhdessä marginaalien, kasvun ja riskien kanssa.',
  },
]

export default function KertoimetPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="hero-pattern absolute inset-0" aria-hidden="true" />
        <div className="hero-glow absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-32 lg:px-10 lg:pb-20 lg:pt-40">
          <Reveal className="max-w-3xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-light">
              Toimialakertoimet
            </p>
            <h1 className="mt-4 text-balance text-4xl font-light tracking-[-0.02em] lg:text-5xl">
              Arvostuskertoimet toimialoittain
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-[17px] font-light leading-relaxed text-white/75">
              Listattujen verrokkien tunnusluvut antavat vertailukohtia, mutta eivät sellaisinaan
              kerro listaamattoman yrityksen arvoa. Laskurin kiinteät oletushaarukat ovat tästä
              erillinen karkea lähtökohta.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Mitä kertoimet tarkoittavat
            </p>
            <h2 className="mt-3 text-balance text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-4xl">
              Kaksi yleisintä kerrointa lyhyesti.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {MULTIPLE_DEFINITIONS.map((d, i) => (
              <Reveal key={d.term} delay={i * 100}>
                <article className="h-full rounded-3xl border border-mist bg-white p-7">
                  <h3 className="text-[17px] font-medium text-forest">{d.term}</h3>
                  <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">{d.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-8 max-w-3xl rounded-3xl bg-green-faint p-6 md:p-8">
              <h3 className="text-lg font-medium text-forest">Kuvitteellinen esimerkki euroilla</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-charcoal/75">
                Oletetaan vain laskukaavan havainnollistamiseksi, että yrityksen EBITDA on 80 000 € ja valittu kerroin 6,0×. Tällöin yritysarvo (EV) olisi 480 000 €. Jos nettovelkaa olisi 25 000 €, oman pääoman laskennallinen arvo olisi 455 000 € ennen muita mahdollisia oikaisuja.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-steel">
                Luvut ja kerroin ovat keksittyjä. Esimerkki ei kuvaa markkinahintaa, tiettyä yritystä eikä laskurin toimialahaarukkaa.
              </p>
            </div>
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
              Miten yrityksen arvostuskerrointa kannattaa tulkita?
            </h2>
          </Reveal>

          <div className="mt-8 divide-y divide-mist border-y border-mist">
            <details className="group py-5" open>
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Milloin EV/EBITDA sopii yrityksen vertailuun?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Kerroin on hyödyllinen vertailun lähtökohta, kun yrityksillä on mielekkäästi vertailukelpoinen ja positiivinen EBITDA. EV sisältää oman pääoman ja velkarahoituksen arvon vähennettynä kassalla, kun taas EBITDAa tarkastellaan ennen korkoja. Siksi suhdeluku auttaa vertaamaan myös eri tavoin rahoitettuja yrityksiä. Se ei kuitenkaan huomioi suoraan investointeja tai käyttöpääoman muutoksia, joten rinnalle tarvitaan tietoa liiketoiminnasta. {` `}
                <a href="https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/market-based-valuation-price-enterprise-value-multiples" target="_blank" rel="noreferrer" className="text-green-deep underline underline-offset-2 hover:text-green">CFA Instituten kuvaus yritysarvon kertoimista</a>.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Mikä on hyvä EV/EBITDA-kerroin?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Yleispätevää hyvää kerrointa ei ole. Tulkintaan vaikuttavat muun muassa kasvunäkymä, kannattavuus, investointitarve, kassavirran ennustettavuus ja riski. Siksi kerrointa verrataan ensisijaisesti liiketoiminnaltaan ja taloudellisilta ominaisuuksiltaan riittävän samankaltaisiin yhtiöihin sekä tarkastellaan yhdessä oletusten kanssa. {` `}
                <a href="https://pages.stern.nyu.edu/~adamodar/New_Home_Page/lectures/vebitnote.html" target="_blank" rel="noreferrer" className="text-green-deep underline underline-offset-2 hover:text-green">NYU Sternin aineisto avaa EV/EBITDA-kertoimen taustatekijöitä</a>.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Miten negatiivinen EBITDA vaikuttaa kertoimeen?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Kun EBITDA on nolla tai negatiivinen, EV/EBITDA ei anna käyttökelpoista vertailulukua. Liikevaihtoon perustuva kerroin voi joissakin yhteyksissä toimia yhtenä lisänäkökulmana, mutta se ei kerro, kuinka kannattavaa myynti on. Tappiollisen yrityksen arviointi edellyttää siksi muuta yrityskohtaista tarkastelua, kuten realistisia tulevaisuuden kassavirta- ja kannattavuusoletuksia.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Miten omistajan palkka voi vaikuttaa EBITDAan?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Jos omistaja tekee yrityksessä työtä, arvioi vastaako kirjattu palkka tehtävän ja vastuiden mukaista korvausta. Vertailua voidaan oikaista perustellulla palkkaerolla, jos omistajan työ jatkuu tai se pitää korvata omistajan vaihtuessa. Koko omistajapalkkaa ei lisätä tulokseen automaattisesti: tehtävä, vertailupalkka ja mahdollinen korvaava työvoima vaikuttavat arvioon. {` `}
                <a href="https://www.aicpa-cima.com/resources/download/assessing-reasonable-compensation-in-valuation-engagements" target="_blank" rel="noreferrer" className="text-green-deep underline underline-offset-2 hover:text-green">AICPA & CIMA käsittelee kohtuullisen korvauksen arviointia arvonmäärityksessä</a>.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Miten yritysarvo eroaa oman pääoman arvosta?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Yritysarvo (EV) kuvaa liiketoiminnan arvoa ennen sen jakamista velka- ja oman pääoman rahoittajille. Yksinkertaistetussa laskussa oman pääoman arvo saadaan vähentämällä EV:stä nettovelka eli korolliset velat miinus kassa. Kaupan lopulliseen laskelmaan voi liittyä muitakin tapauskohtaisia oikaisuja. Lue lisää {` `}
                <Link href="/laskuri" className="text-green-deep underline underline-offset-2 hover:text-green">laskurin EV- ja osakearvolaskusta</Link>.
              </p>
            </details>

            <details className="group py-5">
              <summary className="cursor-pointer list-none pr-8 text-[17px] font-medium text-forest after:float-right after:font-light after:text-green after:content-['+'] group-open:after:content-['−']">
                Voiko listatun yhtiön kerrointa käyttää listaamattomaan yritykseen?
              </summary>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-charcoal/75">
                Listattu yhtiö voi olla hyödyllinen verrokki, mutta sen kerroin ei siirry suoraan listaamattomaan yritykseen. Koko, kasvuvaihe, asiakasrakenne, kannattavuus, riskit ja käytettävissä olevan tiedon määrä voivat erota. Verrokit pitää valita ja tulkita yrityskohtaisesti; {` `}
                <a href="https://ivsc.org/standards-glossary/" target="_blank" rel="noreferrer" className="text-green-deep underline underline-offset-2 hover:text-green">IVSC:n sanasto kuvaa markkinamenetelmän perustuvan samanlaisten tai vertailukelpoisten kohteiden hintatietoon</a>.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Suuntaa-antavat haarukat
            </p>
            <h2 className="mt-3 text-balance text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-4xl">
              Laskurin käyttämät toimialahaarukat.
            </h2>
            <p className="mt-5 text-pretty text-[16px] font-light leading-relaxed text-charcoal-mid">
              Haarukat on tarkoituksella pidetty leveinä ja ne havainnollistavat vain laskurin
              käyttämää yksinkertaistusta. Ne ovat Valuatumin kiinteitä oletuksia, eivät ajantasaisia
              markkinakertoimia tai yrityskauppojen hintoja. Ne eivät päivity automaattisesti alla
              olevan listattujen yhtiöiden taulukon luvuista. Varsinainen raportti tarkastelee
              yritystä yksilöllisesti.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {SECTOR_RANGES.map((s, i) => (
              <Reveal key={s.key} delay={i * 100}>
                <article className="flex h-full flex-col rounded-3xl border border-mist bg-white p-6 transition-all duration-300 hover:border-green/40 hover:shadow-[0_20px_60px_rgba(26,36,32,0.08)]">
                  <h3 className="text-[15px] font-medium text-forest">{s.label}</h3>
                  <p className="mt-2 min-h-16 text-[13.5px] font-light leading-relaxed text-charcoal/70">
                    {s.description}
                  </p>
                  <div className="mt-auto border-t border-mist pt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">
                      EV/EBITDA
                    </p>
                    <p className="mt-2 text-3xl font-light tracking-tight text-charcoal">
                      {s.evEbitdaLow}x–{s.evEbitdaHigh}x
                    </p>
                    <p className="mt-3 text-xs text-steel">
                      EV/Liikevaihto: {s.revenueLow}x–{s.revenueHigh}x
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-mist bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="max-w-2xl">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Listatut verrokit
            </p>
            <h2 className="mt-3 text-balance text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-4xl">
              Esimerkkejä haarukoiden taustalla olevista yhtiöistä.
            </h2>
            <p className="mt-5 text-pretty text-[16px] font-light leading-relaxed text-charcoal-mid">
              Verrokkiotos perustuu Valuatum Wisdom -konsensusennusteisiin ja pörssikursseihin.
              Alla on kolme listattua esimerkkiyhtiötä, ei kattava toimialan markkinakeskiarvo.
              2026e-luvut ovat ennusteita; jokaisen rivin päivityspäivä näkyy taulukossa. Luvut
              miljoonina euroina, osakekurssit euroina.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="mt-10 overflow-x-auto rounded-3xl border border-mist bg-white">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-forest text-white">
                  <tr>
                    <Th>Yhtiö</Th>
                    <Th>Toimiala</Th>
                    <Th>Kurssi</Th>
                    <Th>Liikevaihto 2026e</Th>
                    <Th>EBITDA 2026e</Th>
                    <Th>EBITDA-%</Th>
                    <Th>Päivitetty</Th>
                  </tr>
                </thead>
                <tbody>
                  {WISDOM_PEERS.map((p) => (
                    <tr key={p.ticker} className="border-t border-mist">
                      <Td>
                        <span className="font-medium text-charcoal">{p.company}</span>
                        <span className="mt-1 block text-xs text-steel">{p.ticker}</span>
                      </Td>
                      <Td>{p.sector}</Td>
                      <Td>{p.price}</Td>
                      <Td>{p.sales2026.toLocaleString('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Td>
                      <Td>{p.ebitda2026.toLocaleString('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</Td>
                      <Td>{p.ebitdaMargin.toLocaleString('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</Td>
                      <Td>{p.updated}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-6 max-w-3xl text-[13px] font-light leading-relaxed text-charcoal/60">
              Listattu yhtiö voi poiketa listaamattomasta koon, likviditeetin, riskin ja
              raportoinnin osalta, joten kerroin ei siirry suoraan toiseen yhtiöön. Valuatumin
              yrityskohtainen raportti voi hylätä markkinakertoimet, jos vertailutietoa ei ole tai
              se ei sovi kohteeseen — näin käy myös {` `}
              <Link href="/samples/heeros-oyj.pdf" className="text-green-deep underline underline-offset-2 hover:text-green">
                julkisessa Heeros-esimerkissä
              </Link>
              . Lue lisää {` `}
              <Link href="/blogi/miten-yrityksen-arvo-maaritetaan" className="text-green-deep underline underline-offset-2 hover:text-green">
                arvonmääritysmenetelmistä
              </Link>
              . Tutustu myös {` `}
              <Link href="/blogi/yrityksen-arvonmaarityksen-hinta" className="text-green-deep underline underline-offset-2 hover:text-green">
                arvonmääritysraportin hintaan
              </Link>
              {` `}tai lue, mitä kannattaa huomioida, kun olet {` `}
              <Link href="/blogi/sain-ostotarjouksen-yrityksesta" className="text-green-deep underline underline-offset-2 hover:text-green">
                saanut ostotarjouksen yrityksestä
              </Link>
              . Kokeile myös {` `}
              <Link href="/laskuri" className="text-green-deep underline underline-offset-2 hover:text-green">
                laskuria
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center lg:px-10">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
              Ota haarukat käyttöön
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-[-0.02em] text-charcoal">
              Kokeile laskuria — ja tilaa sitten varsinainen raportti.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/laskuri"
                className="rounded-full bg-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-deep"
              >
                Avaa laskuri
              </Link>
              <Link
                href="/yritys"
                className="rounded-full border border-mist px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-green hover:text-green-deep"
              >
                Tilaa raportti
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 align-top text-charcoal/75">{children}</td>
}
