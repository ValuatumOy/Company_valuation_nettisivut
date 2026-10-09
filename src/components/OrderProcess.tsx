const PRIMARY_STEPS = [
  {
    number: '1',
    title: 'Lisätiedot ja maksu',
    text: 'Kirjoita halutessasi tekoälylle lisätietoja ja siirry sen jälkeen turvalliseen Stripe-maksuun.',
    detail: (
      <>
        Lisätiedot annetaan <strong>ennen maksua</strong> ja ne ovat täysin vapaaehtoisia. Voit myös
        valita ennusteiden tarkistuksen; varsinaiset ennusteet näet maksun jälkeen ennen raportin
        luontia.
      </>
    ),
  },
  {
    number: '2',
    title: 'Raportti laaditaan',
    text: 'Tekoäly analysoi taloustiedot, liiketoiminnan, arvonmääritysmenetelmät, skenaariot ja riskit.',
    detail: (
      <>
        Valmistuminen kestää yleensä <strong>10–20 minuuttia raportin luonnin käynnistämisestä</strong>.
        Voit seurata etenemistä selaimessa tai sulkea sivun ja odottaa sähköpostia.
      </>
    ),
  },
  {
    number: '3',
    title: 'Vastaanota valmis raportti',
    text: 'Saat sähköpostiin PDF-raportin sekä henkilökohtaisen linkin raporttipalveluun.',
    detail: (
      <>
        Linkistä voit lukea raportin selaimessa, ladata PDF:n ja halutessasi tarkentaa analyysiä.
      </>
    ),
  },
]

export function OrderProcess() {
  return (
    <section aria-labelledby="order-process-title" className="mt-10 border-t border-mist pt-8">
      <h2
        id="order-process-title"
        className="text-2xl font-medium tracking-[-0.02em] text-charcoal sm:text-3xl"
      >
        Näin tilaus etenee
      </h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-charcoal-mid">
        Saat raportin myös ilman lisätietoja tai ennusteiden tarkistamista.
      </p>

      <ol className="mt-6 divide-y divide-mist border-y border-mist">
        {PRIMARY_STEPS.map((step) => (
          <li key={step.number} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 py-5 sm:gap-5">
            <span aria-hidden className="pt-0.5 text-sm font-medium tabular-nums text-green-deep">
              {step.number}
            </span>
            <div>
              <h3 className="text-base font-semibold tracking-[-0.01em] text-charcoal">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-charcoal-mid">{step.text}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-charcoal-mid">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 bg-green-faint p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-green-deep">Jos valitset ennusteiden tarkistuksen</h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-mid">
          Raportti odottaa sinua: paina ennustenäkymässä <strong className="font-semibold">Luo raportti</strong>
          {' '}myös silloin, kun jätät luvut ennalleen.
        </p>
      </div>

      <div className="mt-7">
        <h3 className="text-lg font-medium tracking-[-0.01em] text-charcoal">
          Tarkenna raporttia halutessasi
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-mid">
          Raporttinäkymä kertoo, montako tarkennuskierrosta hintaan sisältyy.
          Voit vastata tekoälyn esittämiin kysymyksiin tai antaa muita valinnaisia lisätietoja.
          Jos ensimmäinen raportti riittää, sinun ei tarvitse tehdä mitään.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-mid">
          Uusi versio valmistuu 10–20 minuutissa käynnistämisestä. Päivitetty raportti toimitetaan
          taas sähköpostiisi PDF-tiedostona ja avautuu samasta palvelulinkistä.
        </p>
      </div>

      <details className="group mt-5 border-y border-mist">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm font-medium text-green-deep marker:content-none hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep">
          Katso esimerkki tarkennuskierroksesta
          <ChevronIcon />
        </summary>
        <div className="border-t border-mist pb-5 pt-4">
          <h3 className="text-base font-semibold text-charcoal">Esimerkki: Heeros Oyj</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-charcoal-mid">
            Raportin valmistuttua tekoäly voi pyytää tarkennuksia kohtiin, joita se ei pystynyt
            varmentamaan julkisista lähteistä. Voit vastata, korjata ennusteita tai jättää kohdan tyhjäksi.
          </p>
          <p className="mt-5 text-sm font-medium text-charcoal">
            Tekoäly ei pystynyt varmentamaan näitä — 2 kysymystä
          </p>
          <ExampleQuestion
            question="Jatkaako Heeros toimintaansa itsenäisenä tytäryhtiönä omalla brändillään, vai sulautetaanko sen tuotteet osaksi Procountoria?"
            impact="Korkea: itsenäinen kasvu vs. konsernin sisäinen tuotekehitysyksikkö johtavat täysin erilaisiin kassavirtaprofiileihin."
          />
          <ExampleQuestion
            question="Huhtikuussa 2025 aloitetut muutosneuvottelut tähtäävät 1,0 M€ vuotuisiin säästöihin. Ovatko nämä säästöt pysyviä ja kohdistuvatko ne pääasiassa hallintoon vai tuotekehitykseen?"
            impact="Korkea: 1,0 M€ pysyvä säästö nostaa suoraan DCF-mallin vapaata kassavirtaa ja yrityksen arvoa."
          />
          <p className="mt-4 text-[13px] leading-relaxed text-charcoal-mid">
            Voit myös antaa muita yrityskohtaisia tietoja, joita julkisista lähteistä ei löydy.
            Vastaa haluamiisi kohtiin tai jätä tyhjäksi. Tarkennus sisältyy hintaan.
          </p>
        </div>
      </details>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-charcoal">Lisäkierros 5 €</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-charcoal-mid">
          Voit ostaa uuden kierroksen, antaa lisää ohjeita ja vastaanottaa jälleen päivitetyn
          raportin. Kierroksia voi jatkaa tarpeen mukaan.
        </p>
      </div>
    </section>
  )
}

function ExampleQuestion({ question, impact }: { question: string; impact: string }) {
  return (
    <div className="mt-4 border-t border-mist pt-4">
      <p className="text-[13px] font-medium leading-relaxed text-charcoal">{question}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-charcoal-mid">
        <span className="font-medium text-green-deep">Vaikutus arvoon:</span> {impact}
      </p>
    </div>
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
      className="shrink-0 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
    >
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
