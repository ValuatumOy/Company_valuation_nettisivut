import Link from 'next/link'
import type { CompanyProfile } from '@/lib/companyProfiles'
import { eur, quote } from '@/lib/pricing'
import { CompanyProfileChart } from '@/components/CompanyProfileCharts'

function formatCompactEur(value: number) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatTableEur(value: number) {
  if (Math.abs(value) >= 1_000) {
    const formatted = new Intl.NumberFormat('fi-FI', { maximumFractionDigits: 0 }).format(value / 1_000)
    return `${formatted} k€`
  }
  return `${new Intl.NumberFormat('fi-FI', { maximumFractionDigits: 0 }).format(value)} €`
}

function formatPercent(value: number, withSign = false) {
  const number = new Intl.NumberFormat('fi-FI', {
    maximumFractionDigits: 1,
  }).format(Math.abs(value))
  const sign = value < 0 ? '−' : withSign && value > 0 ? '+' : ''
  return `${sign}${number} %`
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fi-FI', { dateStyle: 'medium' }).format(date)
}

function orderHref(profile: CompanyProfile) {
  return `/yritys/${encodeURIComponent(profile.orderId)}?fid=${encodeURIComponent(String(profile.fid))}`
}

function ModelLabel({ profile }: { profile: CompanyProfile }) {
  return <>{profile.isGroup ? 'Konserni' : 'Yhtiö'}</>
}

export function CompanyProfilePage({ profile }: { profile: CompanyProfile }) {
  const years = [...profile.years].sort((a, b) => a.year - b.year)
  const latest = years.at(-1)
  const previous = years.at(-2)
  const revenueChange =
    latest && previous && previous.revenueEur > 0
      ? ((latest.revenueEur - previous.revenueEur) / previous.revenueEur) * 100
      : null
  const latestEbitMargin =
    latest && latest.revenueEur > 0 ? (latest.ebitEur / latest.revenueEur) * 100 : null
  const latestNetDebt = latest?.netDebtEur ?? null
  const hasNetDebt = years.some((year) => year.netDebtEur !== null)
  const firstYear = years[0]?.year
  const lastYear = latest?.year
  const reportPrice = eur(quote('existing', false).total)
  const purchaseHref = orderHref(profile)
  const metrics = latest
    ? [
        { label: `Liikevaihto ${latest.year}`, value: formatCompactEur(latest.revenueEur) },
        { label: `Liiketulos (EBIT) ${latest.year}`, value: formatCompactEur(latest.ebitEur) },
        ...(revenueChange === null
          ? []
          : [
              {
                label: 'Muutos edellisestä tilikaudesta',
                value: formatPercent(revenueChange, true),
              },
            ]),
      ]
    : []

  return (
    <>
      <section className="relative bg-forest text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-pattern absolute inset-0" />
          <div className="hero-glow absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-32 lg:px-10 lg:pb-10 lg:pt-36">
          <nav aria-label="Murupolku" className="text-sm text-white/55">
            <Link href="/yritykset" className="transition-colors hover:text-white">
              Yritysten taloustiedot
            </Link>
            <span className="px-2" aria-hidden="true">/</span>
            <span aria-current="page" className="text-white/85">{profile.name}</span>
          </nav>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.15em] text-green-light">
            Taloustiedot ja arvonmääritys
          </p>
          <h1 className="mt-3 max-w-4xl text-balance text-4xl font-light leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
            {profile.name}
          </h1>
          <p className="mt-4 text-sm font-light text-white/70">
            Y-tunnus {profile.businessId} <span className="px-2 text-white/35" aria-hidden="true">·</span>
            <ModelLabel profile={profile} />
            {profile.city && <><span className="px-2 text-white/35" aria-hidden="true">·</span>{profile.city}</>}
            {profile.industry && <><span className="px-2 text-white/35" aria-hidden="true">·</span>{profile.industry}</>}
          </p>
          <p className="mt-2 text-xs text-white/45">
            {firstYear && lastYear ? `Tilikaudet ${firstYear}–${lastYear}` : 'Tilikausittainen taloushistoria'}
          </p>
        </div>
      </section>

      <div className="bg-off-white pb-24 pt-8 md:pb-16 md:pt-10">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-10">
          <div className="min-w-0 space-y-8">
            {metrics.length > 0 && (
              <section aria-label="Talouden yhteenveto" className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">
                  Tilikauden {lastYear} yhteenveto
                </p>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="border-l-2 border-green/40 pl-4">
                      <dt className="text-xs text-steel">{metric.label}</dt>
                      <dd className="mt-1 text-2xl font-light tracking-tight text-charcoal">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 border-t border-mist pt-4 text-xs leading-relaxed text-steel">
                  Yhteenveto kuvaa ilmoitettua tilikautta. Se ei sisällä tulevaisuuden ennustetta tai euroarviota yrityksen arvosta.
                </p>
              </section>
            )}
            <section aria-labelledby="process-heading" className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">Näin saat raportin</p>
                  <h2 id="process-heading" className="mt-2 text-2xl font-light tracking-tight text-charcoal">
                    Kolme vaihetta yrityksen raporttiin
                  </h2>
                </div>
                <span className="rounded-full bg-green-mist px-3 py-1 text-xs font-medium text-green-deep">
                  {profile.name} valittu
                </span>
              </div>
              <ol className="mt-6 grid gap-5 md:grid-cols-3">
                <li className="border-t border-mist pt-4">
                  <span className="text-xs font-semibold tracking-[0.12em] text-green">01</span>
                  <h3 className="mt-2 text-sm font-medium text-charcoal">Lisätiedot ja maksu</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal-mid">
                    Anna sähköposti raportin toimitusta varten. Voit lisätä taustatietoja ja valita ennusteiden tarkistuksen.
                  </p>
                </li>
                <li className="border-t border-mist pt-4">
                  <span className="text-xs font-semibold tracking-[0.12em] text-green">02</span>
                  <h3 className="mt-2 text-sm font-medium text-charcoal">Raportti laaditaan</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal-mid">
                    Ilman ennusteiden tarkistusta generointi alkaa maksun jälkeen. Tarkistuksen valinneena vahvistat ennusteet ensin.
                  </p>
                </li>
                <li className="border-t border-mist pt-4">
                  <span className="text-xs font-semibold tracking-[0.12em] text-green">03</span>
                  <h3 className="mt-2 text-sm font-medium text-charcoal">PDF sähköpostiisi</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal-mid">
                    Raportin muodostus kestää tyypillisesti 10–20 minuuttia sen käynnistymisestä.
                  </p>
                </li>
              </ol>
              <p className="mt-5 border-t border-mist pt-4 text-xs leading-relaxed text-steel">
                Yksi raportti maksaa {reportPrice} (sisältää 25,5 % alv:n). Jos valitset ennusteiden tarkistuksen, aika-arvio alkaa vasta ennusteiden vahvistamisen jälkeen.
              </p>
            </section>

            <section aria-labelledby="history-heading" className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">Tilinpäätöshistoria</p>
                  <h2 id="history-heading" className="mt-2 text-2xl font-light tracking-tight text-charcoal">
                    Liikevaihto ja liiketulos tilikausittain
                  </h2>
                </div>
                {firstYear && lastYear && (
                  <span className="text-xs text-steel">{firstYear}–{lastYear}</span>
                )}
              </div>
              <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-charcoal-mid">
                Historialuvut näyttävät toteutuneen kehityksen. Ne eivät sisällä tulevaisuuden ennustetta tai maksutonta euroarviota yrityksen arvosta.
              </p>

              {years.length > 0 ? (
                <>
                  <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    <CompanyProfileChart years={years} slug={profile.slug} metric="revenueEur" />
                    <CompanyProfileChart years={years} slug={profile.slug} metric="ebitEur" />
                  </div>
                  <div className="mt-7">
                    <h3 className="text-sm font-medium text-charcoal">Tilikausittaiset luvut</h3>
                    <div className="mt-3 overflow-x-auto rounded-xl border border-mist">
                      <table className="min-w-full border-collapse text-left text-sm">
                        <caption className="sr-only">
                          {profile.name}: liikevaihto, liiketulos ja mahdollinen nettovelka tilikausittain.
                        </caption>
                        <thead className="bg-off-white text-[11px] font-semibold uppercase tracking-[0.08em] text-steel">
                          <tr>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Tilikausi</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Liikevaihto</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">Liiketulos (EBIT)</th>
                            <th scope="col" className="whitespace-nowrap px-4 py-3">EBIT-%</th>
                            {hasNetDebt && <th scope="col" className="whitespace-nowrap px-4 py-3">Nettovelka</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-mist text-charcoal-mid">
                          {years.map((year) => (
                            <tr key={year.year} className="bg-white">
                              <th scope="row" className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">{year.year}</th>
                              <td className="whitespace-nowrap px-4 py-3">{formatTableEur(year.revenueEur)}</td>
                              <td className="whitespace-nowrap px-4 py-3">{formatTableEur(year.ebitEur)}</td>
                              <td className="whitespace-nowrap px-4 py-3">
                                {year.revenueEur > 0 ? formatPercent((year.ebitEur / year.revenueEur) * 100) : '–'}
                              </td>
                              {hasNetDebt && (
                                <td className="whitespace-nowrap px-4 py-3">
                                  {year.netDebtEur === null ? '–' : formatTableEur(year.netDebtEur)}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-steel">
                      Muutos vertaa ilmoitettuja tilikausilukuja eikä huomioi mahdollista eroa tilikausien pituudessa. Liiketulos voi olla myös tappiollinen.
                    </p>
                  </div>
                </>
              ) : (
                <p className="mt-6 rounded-xl bg-off-white p-5 text-sm text-charcoal-mid">
                  Tilikausittaisia lukuja ei ole saatavilla.
                </p>
              )}
              <div className="mt-5 border-t border-mist pt-4 text-xs leading-relaxed text-steel">
                Lähde: <a href={profile.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-green-deep underline underline-offset-2 hover:text-green">{profile.sourceLabel}</a>
                <span aria-hidden="true"> · </span>
                Tiedot tarkistettu <time dateTime={profile.retrievedAt}>{formatDate(profile.retrievedAt)}</time>.
              </div>
            </section>

            <section aria-labelledby="drivers-heading" className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">Mitä luvuista voi päätellä?</p>
              <h2 id="drivers-heading" className="mt-2 text-2xl font-light tracking-tight text-charcoal">
                Taloushistoria kertoo menneestä
              </h2>
              <ol className="mt-6 divide-y divide-mist">
                {revenueChange !== null && latest && previous && (
                  <li className="grid gap-3 py-5 sm:grid-cols-[42px_1fr]">
                    <span className="text-xs font-semibold tracking-[0.12em] text-green">01</span>
                    <div>
                      <h3 className="font-medium text-charcoal">Liikevaihdon muutos</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-charcoal-mid">
                        Liikevaihto {revenueChange > 0 ? 'kasvoi' : revenueChange < 0 ? 'laski' : 'pysyi ennallaan'} {formatPercent(revenueChange)} edellisestä ilmoitetusta tilikaudesta. Vertailu perustuu kirjattuihin tilikausilukuihin.
                      </p>
                    </div>
                  </li>
                )}
                {latest && latestEbitMargin !== null && (
                  <li className="grid gap-3 py-5 sm:grid-cols-[42px_1fr]">
                    <span className="text-xs font-semibold tracking-[0.12em] text-green">02</span>
                    <div>
                      <h3 className="font-medium text-charcoal">Liiketuloksen osuus liikevaihdosta</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-charcoal-mid">
                        EBIT-marginaali oli {formatPercent(latestEbitMargin)} tilikaudella {latest.year}. Luku kuvaa tilikauden kannattavuutta, ei tulevaa kassavirtaa.
                      </p>
                    </div>
                  </li>
                )}
                {latest && latestNetDebt !== null && (
                  <li className="grid gap-3 py-5 sm:grid-cols-[42px_1fr]">
                    <span className="text-xs font-semibold tracking-[0.12em] text-green">03</span>
                    <div>
                      <h3 className="font-medium text-charcoal">Rahoitusasema näkyy erikseen</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-charcoal-mid">
                        {latestNetDebt < 0 ? 'Nettokassa' : 'Nettovelka'} oli {formatCompactEur(Math.abs(latestNetDebt))} tilikauden {latest.year} lopussa. Nettovelka tai nettokassa huomioidaan erikseen, kun yritysarvosta siirrytään oman pääoman arvoon.
                      </p>
                    </div>
                  </li>
                )}
              </ol>
              <p className="mt-2 border-t border-mist pt-4 text-xs leading-relaxed text-steel">
                Historialuvut eivät yksin ennusta tulevaa kehitystä. Arvonmääritysraportissa tulevat oletukset ja menetelmävalinnat käsitellään erikseen.
              </p>
            </section>

            <section aria-labelledby="difference-heading" className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">Maksuton historia ja tilausraportti</p>
              <h2 id="difference-heading" className="mt-2 text-2xl font-light tracking-tight text-charcoal">
                Historia kertoo menneestä. Raportti arvioi tulevaa.
              </h2>
              <p className="mt-3 text-sm font-light leading-relaxed text-charcoal-mid">
                Maksuton yrityssivu kokoaa toteutuneita tilinpäätöslukuja. Se ei ole valmis arvonmääritys: raportti edellyttää erillistä kassavirtaennustetta, menetelmien soveltuvuuden arviointia ja oletusten käsittelyä.
              </p>
              <div className="mt-6 overflow-x-auto rounded-xl border border-mist">
                <table className="min-w-full text-left text-sm">
                  <caption className="sr-only">Maksuttoman yrityssivun ja tilauksesta laadittavan raportin erot.</caption>
                  <thead className="bg-off-white text-[11px] font-semibold uppercase tracking-[0.08em] text-steel">
                    <tr>
                      <th scope="col" className="px-4 py-3">Sisältö</th>
                      <th scope="col" className="px-4 py-3">Yrityssivu</th>
                      <th scope="col" className="px-4 py-3">Raportti</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist text-charcoal-mid">
                    <tr><th scope="row" className="px-4 py-3 font-medium text-charcoal">Lähtökohta</th><td className="px-4 py-3">Tilinpäätöshistoria</td><td className="px-4 py-3">Yrityskohtaiset oletukset ja ennusteet</td></tr>
                    <tr><th scope="row" className="px-4 py-3 font-medium text-charcoal">Tuleva kehitys</th><td className="px-4 py-3">Ei ennustetta</td><td className="px-4 py-3">Kassavirtaennuste ja skenaariot</td></tr>
                    <tr><th scope="row" className="px-4 py-3 font-medium text-charcoal">Tulos</th><td className="px-4 py-3">Ei euroarviota yrityksen arvosta</td><td className="px-4 py-3">Perusteltu arvonmääritysraportti</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="faq-heading" className="rounded-2xl border border-mist bg-white p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">Usein kysyttyä</p>
              <h2 id="faq-heading" className="mt-2 text-2xl font-light tracking-tight text-charcoal">Ennen kuin tilaat</h2>
              <div className="mt-5 divide-y divide-mist">
                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                    Mitä tämä sivu kertoo?
                    <span aria-hidden="true" className="text-green-deep transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal-mid">
                    Sivulla näkyy lähteistettyä tilinpäätöshistoriaa ja siitä laskettuja tunnuslukuja. Sivulla ei näytetä yrityskohtaista arvonmääritystä tai tulevien kassavirtojen ennustetta.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                    Mistä luvut ovat peräisin?
                    <span aria-hidden="true" className="text-green-deep transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal-mid">
                    Lähde ja viimeisin tietojen tarkistuspäivä näkyvät taulukon yhteydessä. Vertailu koskee ilmoitettuja tilikausilukuja.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-charcoal">
                    Mitä tilausraportti lisää?
                    <span aria-hidden="true" className="text-green-deep transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal-mid">
                    Raportti arvioi tulevia kassavirtoja ja näyttää käytetyt menetelmät, oletukset, skenaariot ja tunnistetut riskit. Se laaditaan erikseen tilauksen jälkeen.
                  </p>
                </details>
                <details className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-charcoal">
                    Onko raportti virallinen käyvän arvon lausunto?
                    <span aria-hidden="true" className="text-green-deep transition-transform group-open:rotate-180">⌄</span>
                  </summary>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal-mid">
                    Ei. Raportti on analyysi päätöksenteon tueksi. Se ei ole tilintarkastus, fairness opinion, sijoitusneuvonta tai oikeudellinen lausunto.
                  </p>
                </details>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_18px_52px_rgba(18,35,27,0.12)]">
              <div className="bg-forest p-6 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-light">
                  AI-arvonmääritysraportti
                </p>
                <h2 className="mt-2 text-xl font-light leading-snug">{profile.name}</h2>
                <p className="mt-1 text-xs text-white/55">{profile.businessId} · <ModelLabel profile={profile} /></p>
                <p className="mt-5 text-4xl font-light tracking-tight">{reportPrice}</p>
                <p className="mt-1 text-xs text-white/55">Kertamaksu · sisältää 25,5 % alv:n</p>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-charcoal-mid">
                  Tilauksesta laadittava raportti arvioi tulevaa kassavirtaa ja perustelee, miten arvo muodostuu.
                </p>
                <a
                  href={purchaseHref}
                  className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-green-deep px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Jatka tilaamaan — {reportPrice}
                </a>
                <p className="mt-3 text-center text-xs leading-relaxed text-steel">
                  Seuraavaksi annat sähköpostin ja siirryt turvalliseen Stripe-maksuun.
                </p>
                <a
                  href="/samples/heeros-oyj.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 block border-t border-mist pt-4 text-center text-sm font-medium text-green-deep underline underline-offset-2 hover:text-green"
                >
                  Esimerkkiraportti: Heeros Oyj (PDF)
                </a>
                <p className="mt-4 text-[11px] leading-relaxed text-steel">
                  Raportti tukee päätöksentekoa. Se ei ole virallinen käyvän arvon lausunto.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(18,35,27,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-charcoal">{reportPrice} <span className="text-xs font-normal text-steel">sis. alv</span></p>
            <p className="truncate text-[11px] text-steel">Raportti laaditaan tilauksesta</p>
          </div>
          <a href={purchaseHref} className="flex min-h-11 shrink-0 items-center rounded-full bg-green-deep px-4 py-2.5 text-sm font-medium text-white hover:bg-forest">
            Jatka tilaamaan
          </a>
        </div>
      </div>
    </>
  )
}
