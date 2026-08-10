import Image from 'next/image'

const PRIMARY_STEPS = [
  {
    number: '01',
    title: 'Lisätiedot ja maksu',
    text: 'Kirjoita halutessasi tekoälylle lisätietoja ja siirry sen jälkeen turvalliseen Stripe-maksuun.',
    detail: (
      <>
        Lisätiedot annetaan <strong>ennen maksua</strong> ja ne ovat täysin vapaaehtoisia. Voit myös
        valita ennusteiden tarkistuksen; varsinaiset ennusteet näet maksun jälkeen ennen raportin
        luontia.
      </>
    ),
    icon: <CardIcon />,
  },
  {
    number: '02',
    title: 'Raportti laaditaan',
    text: 'Tekoäly analysoi taloustiedot, liiketoiminnan, arvonmääritysmenetelmät, skenaariot ja riskit.',
    detail: (
      <>
        Valmistuminen kestää yleensä <strong>10–20 minuuttia</strong>. Voit seurata etenemistä
        selaimessa tai sulkea sivun ja odottaa sähköpostia.
      </>
    ),
    icon: <AnalysisIcon />,
  },
  {
    number: '03',
    title: 'Vastaanota valmis raportti',
    text: 'Saat sähköpostiin PDF-raportin sekä henkilökohtaisen linkin raporttipalveluun.',
    detail: (
      <>
        Linkistä voit lukea raportin selaimessa, ladata PDF:n ja halutessasi tarkentaa analyysiä.
      </>
    ),
    icon: <ReportIcon />,
  },
]

export function OrderProcess() {
  return (
    <section
      aria-labelledby="order-process-title"
      className="relative mt-8 overflow-hidden rounded-3xl border border-mist bg-white"
    >
      <Image
        src="/images/report-process-bg.png"
        alt=""
        fill
        loading="eager"
        sizes="(min-width: 1024px) 800px, 100vw"
        className="pointer-events-none object-cover object-center opacity-[0.16]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/75" />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
            Näin tilaus etenee
          </p>
          <h2
            id="order-process-title"
            className="mt-3 text-3xl font-light tracking-[-0.02em] text-charcoal lg:text-[2.45rem] lg:leading-[1.12]"
          >
            Maksusta valmiiseen raporttiin — ja tarvittaessa tarkempaan versioon
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-charcoal-mid">
            Prosessi toimii itsenäisesti, mutta antaa sinulle mahdollisuuden vaikuttaa silloin kun
            sinulla on tekoälyä tarkempaa tietoa yrityksestä.
          </p>
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-green/20 bg-green-faint/95 px-4 py-3.5 sm:px-5">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green text-white">
            <CheckIcon />
          </span>
          <p className="text-sm leading-relaxed text-green-deep">
            <strong className="font-semibold">Sinun ei tarvitse muokata mitään.</strong> Saat
            ensimmäisellä kierroksella valmiin ja käyttökelpoisen arvonmääritysraportin myös täysin
            ilman lisätietoja tai ennusteiden tarkistamista.
          </p>
        </div>

        <div className="relative mt-8">
          <div
            aria-hidden
            className="absolute left-[16.666%] right-[16.666%] top-7 hidden border-t border-dashed border-green/35 lg:block"
          />
          <ol className="relative grid gap-4 lg:grid-cols-3 lg:gap-5">
            {PRIMARY_STEPS.map((step) => (
              <li
                key={step.number}
                className="relative rounded-2xl border border-mist bg-white/95 p-5 shadow-[0_12px_36px_rgba(26,36,32,0.055)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest text-green-light shadow-[0_8px_24px_rgba(27,48,40,0.16)]">
                    {step.icon}
                  </span>
                  <span className="font-mono text-[12px] font-semibold tracking-[0.15em] text-green-deep/55">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-medium tracking-[-0.015em] text-charcoal">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-charcoal-mid">{step.text}</p>
                <p className="mt-4 border-t border-mist pt-3 text-[13px] leading-relaxed text-steel">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 grid overflow-hidden rounded-2xl border border-green/20 bg-forest text-white lg:grid-cols-[1fr_auto_1fr]">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green/20 text-green-light">
                <RefineIcon />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-green-light">
                  Hintaan sisältyy
                </p>
                <h3 className="mt-0.5 text-xl font-light">1 maksuton tarkennuskierros</h3>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/70">
              Voit vastata tekoälyn esittämiin kysymyksiin tai antaa muita valinnaisia lisätietoja.
              Jos ensimmäinen raportti riittää, sinun ei tarvitse tehdä mitään.
            </p>
          </div>

          <div className="flex items-center justify-center border-y border-white/10 px-5 py-3 text-green-light lg:border-x lg:border-y-0">
            <ArrowIcon />
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-green-light">
              Uusi versio 10–20 minuutissa
            </p>
            <h3 className="mt-1 text-xl font-light">Huomiosi mukana analyysissä</h3>
            <p className="mt-4 text-sm font-light leading-relaxed text-white/70">
              Päivitetty raportti toimitetaan taas sähköpostiisi PDF-tiedostona ja avautuu samasta
              palvelulinkistä.
            </p>
          </div>
        </div>

        <details className="group mt-4 overflow-hidden rounded-2xl border border-mist bg-white">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-green-deep marker:content-none sm:px-6">
            <span className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-green-faint text-green">
                <RefineIcon />
              </span>
              Katso esimerkki tarkennuskierroksesta
            </span>
            <ChevronIcon />
          </summary>

          <div className="border-t border-mist bg-off-white/60 px-5 py-6 sm:px-6 sm:py-7">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-green-deep">
                Esimerkki: Heeros Oyj
              </p>
              <h3 className="mt-2 text-xl font-light tracking-[-0.015em] text-charcoal">
                Haluatko tarkentaa raporttia?
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-charcoal-mid">
                Raportin valmistuttua tekoäly voi pyytää tarkennuksia kohtiin, joita se ei pystynyt
                varmentamaan julkisista lähteistä. Voit vastata, korjata ennusteita tai jättää kohdan tyhjäksi.
              </p>

              <div className="mt-6 rounded-xl border border-mist bg-white p-4 sm:p-5">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-semibold text-charcoal">Tekoäly ei pystynyt varmentamaan näitä</p>
                  <span className="text-[12px] text-steel">2 kysymystä</span>
                </div>

                <ExampleQuestion
                  question="Jatkaako Heeros toimintaansa itsenäisenä tytäryhtiönä omalla brändillään, vai sulautetaanko sen tuotteet osaksi Procountoria?"
                  impact="Korkea: itsenäinen kasvu vs. konsernin sisäinen tuotekehitysyksikkö johtavat täysin erilaisiin kassavirtaprofiileihin."
                />
                <ExampleQuestion
                  question="Huhtikuussa 2025 aloitetut muutosneuvottelut tähtäävät 1,0 M€ vuotuisiin säästöihin. Ovatko nämä säästöt pysyviä ja kohdistuvatko ne pääasiassa hallintoon vai tuotekehitykseen?"
                  impact="Korkea: 1,0 M€ pysyvä säästö nostaa suoraan DCF-mallin vapaata kassavirtaa ja yrityksen arvoa."
                />
              </div>

              <div className="mt-4 rounded-xl border border-mist bg-white p-4 sm:p-5">
                <p className="text-sm font-semibold text-charcoal">Muuta täydennettävää <span className="font-normal text-steel">(valinnainen)</span></p>
                <div className="mt-3 rounded-lg border border-mist bg-off-white px-4 py-3 text-[13px] text-steel/70">
                  Esim. yrityskohtaisia tietoja, joita julkisista lähteistä ei löydy.
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-green-faint px-4 py-2 text-[13px] font-medium text-green-deep">
                    Tarkennus sisältyy hintaan
                  </span>
                  <span className="text-[12px] text-steel">Vastaa haluamiisi kohtiin tai jätä tyhjäksi.</span>
                </div>
              </div>
            </div>
          </div>
        </details>

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-gold/30 bg-gold-faint/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-charcoal">Haluatko tarkentaa vielä lisää?</p>
            <p className="mt-1 text-[13px] leading-relaxed text-charcoal-mid">
              Voit ostaa uuden kierroksen, antaa lisää ohjeita ja vastaanottaa jälleen päivitetyn
              raportin. Kierroksia voi jatkaa tarpeen mukaan.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3 rounded-full border border-gold/30 bg-white px-4 py-2.5">
            <LoopIcon />
            <span className="text-sm font-medium text-charcoal">Lisäkierros 5 €</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExampleQuestion({ question, impact }: { question: string; impact: string }) {
  return (
    <div className="border-t border-mist pt-5 first:mt-5">
      <p className="text-[13px] font-medium leading-relaxed text-charcoal">{question}</p>
      <p className="mt-1 text-[11.5px] leading-relaxed text-steel">
        <span className="font-medium text-green-deep">Vaikutus arvoon:</span> {impact}
      </p>
      <div className="mt-3 rounded-lg border border-mist bg-off-white px-4 py-3 text-[13px] text-steel/70">
        Vastauksesi. Jätä tyhjäksi, jos et tiedä.
      </div>
    </div>
  )
}

function CardIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.75" y="5" width="18.5" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 9.5h18M7 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function AnalysisIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 19V9m5 10V5m5 14v-7m5 7V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m3 6 5-3 5 4 7-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ReportIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 2.75h8l4 4V21.25H6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 3v4h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function RefineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m13 7 4 4M4 16l4 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="30" height="18" viewBox="0 0 30 18" fill="none" aria-hidden className="rotate-90 lg:rotate-0">
      <path d="M1 9h26M20 2l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LoopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="text-gold">
      <path d="M20 7v5h-5M4 17v-5h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 12a7 7 0 0 0-12-4L4 10m16 4-2.5 2a7 7 0 0 1-12-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 transition-transform duration-200 group-open:rotate-180"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
