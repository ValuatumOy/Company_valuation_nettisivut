import type { ContentPageData } from '@/components/ContentPage'

export const yrityskauppaPage: ContentPageData = {
  "slug": "yrityskauppa",
  "seoTitle": "Yrityksen arvonmääritys yrityskaupassa – 79 € | Valuatum",
  "metaDescription": "Miten yrityksen arvo määritetään yrityskaupassa? Perusteltu arvostusväli DCF-, EVA- ja skenaarioanalyysillä antaa myyjälle ja ostajalle neuvotteluankkurin.",
  "h1": "Yrityksen arvonmääritys yrityskaupassa",
  "leadParagraph": "Yrityksen arvonmääritys yrityskaupassa tuottaa perustellun arvion, ei valmista kauppahintaa. Raportin päämenetelmä on DCF eli diskontattu kassavirta; EVA toimii saman ennusteen täsmäytyksenä. Skenaariot näyttävät, miten oletukset vaikuttavat oman pääoman arvoon.",
  "sections": [
    {
      "heading": "Miksi arvonmääritys kannattaa tehdä ennen hintaneuvotteluja?",
      "paragraphs": [
        "Perusteltu arvostusväli auttaa ostajaa ja myyjää vertaamaan odotuksia samoihin lähtötietoihin ja näkemään, mitkä oletukset selittävät eron. Se ei yksin määritä hintaa: kauppahinta syntyy osapuolten sopimuksesta ja kaupan ehdoista.",
        "Raportti maksaa 79 € (sis. Suomen alv:n). Se tukee keskustelua, mutta ei korvaa due diligence -tarkastusta tai kauppakohtaista neuvonantoa. Katso [esimerkkiraportti](/#esimerkit) tai [tilaa raportti](/yritys)."
      ],
      "listItems": [],
      "table": {
        "columns": [],
        "rows": []
      }
    },
    {
      "heading": "Mitä raportti antaa myyjälle ja ostajalle?",
      "paragraphs": [
        "Raportti kokoaa lähtöaineiston, oletukset, menetelmävalinnan ja tunnistetut riskit yhteen. Ostaja tai myyjä voi käyttää sitä kysymysten ja neuvottelun valmisteluun. Tilaaja voi antaa lisätietoja, joten raportti ei ole osapuolista riippumaton fairness opinion.",
        "Julkisessa Heeros-esimerkissä on 16 osiota, muun muassa tilinpäätösanalyysi, ennusteet, DCF-laskelma, EVA-täsmäytys, skenaariot, riskit, lähderekisteri ja metodologia. [Avaa esimerkkiraportti](/samples/heeros-oyj.pdf) ja [lue menetelmistä lisää](/blogi/miten-yrityksen-arvo-maaritetaan)."
      ],
      "listItems": [],
      "table": {
        "columns": [
          "Raportin osa",
          "Myyjälle",
          "Ostajalle"
        ],
        "rows": [
          [
            "Arvostusväli",
            "Perusteltu hintapyyntö neuvottelun avaukseksi",
            "Raja, jonka ylittävä hinta vaatii erityisperustelut"
          ],
          [
            "Skenaariot ja odotusarvo",
            "Näyttää, mitä optimistinen hinta edellyttää toteutuakseen",
            "Näyttää, mitä pessimistinen skenaario tarkoittaa tarjoukselle"
          ],
          [
            "Riskit",
            "Ennakoi ostajan kysymykset ja hinnanalennusperusteet",
            "Kysymyksiä jatkoselvitykseen ja due diligence -vaiheeseen"
          ],
          [
            "Arvon ajurit ja herkkyydet",
            "Mitä ennusteen toteutuminen edellyttää",
            "Mistä arvion oletukset ja herkkyydet muodostuvat"
          ],
          [
            "Käytetyt ja hylätyt menetelmät",
            "Vastaus, jos ostaja vetoaa itselleen edulliseen menetelmään",
            "Vastaus, jos hintapyyntö nojaa soveltumattomaan menetelmään"
          ]
        ]
      }
    },
    {
      "heading": "Millä menetelmillä yrityksen arvo lasketaan yrityskaupassa?",
      "paragraphs": [
        "Raportin päämenetelmä on DCF, joka diskonttaa ennustetut vapaat kassavirrat nykyhetkeen yrityskohtaisella tuottovaatimuksella (WACC). EVA näyttää saman ennusteen pohjalta, miten tuotto suhteutuu sitoutuneen pääoman kustannukseen. Julkisessa Heeros-esimerkissä DCF:n paino on 100 % ja EVA:n 0 %:n täsmäytys; P/E, EV/EBITDA ja tasearvo on hylätty kyseisen aineiston perusteella. Muissa raporteissa valinnat voivat riippua kohteen tiedoista.",
        "Kullekin skenaariolle annetaan todennäköisyys, ja niistä lasketaan arvon odotusarvo. Neuvottelussa tämä on käyttökelpoisempi työkalu kuin yksi piste-estimaatti: osapuolet voivat olla eri mieltä todennäköisyyksistä ja silti keskustella samoista luvuista.",
        "Raportti perustelee myös hylätyt menetelmät. Lähdeluettelo ja metodologia näyttävät, mitä tietoja käytettiin ja mitä jäi aineiston ulkopuolelle.",
        "Tarkista rajaukset itse [julkisesta esimerkkiraportista](/samples/heeros-oyj.pdf). Arvio ei korvaa kauppakohteen sopimusten, taloudellisen aseman tai oikeudellisten riskien due diligence -tarkastusta."
      ],
      "listItems": [
        "Pessimistinen skenaario: keskeiset riskit toteutuvat — mitä arvolle jää.",
        "Realistinen skenaario: perusura nykyisen kehityksen ja ennusteen varassa.",
        "Optimistinen skenaario: mitä arvon yläpää edellyttää toteutuakseen."
      ],
      "table": {
        "columns": [],
        "rows": []
      }
    },
    {
      "heading": "Mitä eroa on yritysarvolla ja oman pääoman arvolla?",
      "paragraphs": [
        "Yritysarvo (EV) kuvaa liiketoiminnan arvoa rahoitusrakenteesta riippumatta. Oman pääoman arvo on omistajille jäävä osuus: yksinkertaistetusti osakekannan arvo = yritysarvo − nettovelka, jossa nettovelka tarkoittaa korollisia velkoja miinus kassa. Esimerkiksi 6 M€:n yritysarvosta ja 1 M€:n nettovelasta seuraa 5 M€:n oman pääoman arvo ennen muita kauppakohtaisia oikaisuja.",
        "Siksi EV/EBITDA-kerrointa ei voi lukea suoraan osakkeiden kauppahintana. [Arvonmäärityslaskuri](/laskuri) näyttää yksinkertaisen EV–nettovelka-laskelman, ja [toimialakertoimien sivu](/kertoimet) selittää kertoimien rajaukset."
      ],
      "listItems": [],
      "table": {
        "columns": [],
        "rows": []
      }
    },
    {
      "heading": "Mikä on arvon ja kauppahinnan ero?",
      "paragraphs": [
        "Arvo on analyysin tulos: perusteltu arvio siitä, mitä yhtiön kassavirrat ja tase ovat sijoituskohteena arvoltaan. Kauppahinta on neuvottelun tulos. Siihen vaikuttavat tekijät, joita mikään laskelma ei ratkaise: kaupan rakenne (osake- vai liiketoimintakauppa), maksuehdot ja mahdollinen lisäkauppahinta, kilpailevien ostajien määrä, myyjän aikataulu ja yrittäjän rooli kaupan jälkeen.",
        "Siksi hyvä arvonmääritys antaa välin, ei yhtä lukua. Väli toimii neuvottelussa mittatikkuna: myyjä näkee, milloin tarjous on välin alapäähänkin nähden matala, ja ostaja näkee, milloin hintapyyntö edellyttää optimistisen skenaarion toteutumista täysimääräisenä. Ero arvon ja hinnan välillä ei ole virhe — se on neuvottelun tila, ja perusteltu väli kertoo, missä kohtaa sitä liikutaan."
      ],
      "listItems": [],
      "table": {
        "columns": [],
        "rows": []
      }
    },
    {
      "heading": "Miten omat tiedot ja saadut tarjoukset tarkentavat analyysiä?",
      "paragraphs": [
        "Julkinen tilinpäätösdata ei kerro kaikkea kaupan kannalta olennaista. Tilauksen yhteydessä voit antaa lisätietoja, kuten asiakassopimuksia, tarjouksia tai liiketoiminnan taustaa. Ne ovat tilaajan toimittamaa tietoa, eivät itsenäisesti varmennettuja tosiasioita.",
        "Voit myös valita liikevaihto- ja EBIT-ennusteiden tarkistuksen ennen raportin luontia. Raportissa käyttäjän vahvistamat ennusteet erotetaan lähdedatasta. Lisätiedot eivät automaattisesti muuta laskentaa; lopullinen tulkinta ja neuvottelupäätös jäävät osapuolille."
      ],
      "listItems": [],
      "table": {
        "columns": [],
        "rows": []
      }
    },
    {
      "heading": "Milloin tarvitaan lisäksi ihminen neuvonantajaksi?",
      "paragraphs": [
        "Raportti on analyysiraportti päätöksenteon tueksi. Se ei ole fairness opinion, tilintarkastus, sijoitusneuvonta, oikeudellinen lausunto eikä sellaisenaan verotukseen kelpaava käyvän arvon lausunto.",
        "Suurissa kaupoissa, riitatilanteissa ja monimutkaisissa omistusjärjestelyissä kannattaa käyttää lisäksi yrityskauppaneuvonantajaa ja juristia. Raportti on silloinkin hyödyllinen ensimmäinen askel: oletukset, menetelmät ja riskit ovat valmiiksi dokumentoituna, joten keskustelu neuvonantajan kanssa alkaa lukujen tulkinnasta, ei niiden keräämisestä. Moni käyttää raporttia myös toisena mielipiteenä neuvonantajan laatiman arvion rinnalla."
      ],
      "listItems": [],
      "table": {
        "columns": [],
        "rows": []
      }
    },
    {
      "heading": "Mitä arvonmääritys maksaa yrityskaupassa?",
      "paragraphs": [
        "Yksittäinen raportti maksaa 79 € (sis. Suomen alv:n) ja valmistuu tyypillisesti 10–20 minuutissa, kun tilinpäätöstiedot ovat jo aineistossa. Näet edistymisen selaimessa ja saat PDF:n sähköpostiisi. Raportit tilataan yrityskohtaisesti; useamman raportin pakettia ei ole tällä hetkellä tarjolla. Katso [hinnoittelu](/#hinnoittelu).",
        "Laadun voi arvioida ennen ostamista: [esimerkkiraportit](/#esimerkit) ovat avattavissa maksutta ilman rekisteröitymistä. Kun olet valmis, [tilaa raportti](/yritys) yrityksen nimellä tai Y-tunnuksella."
      ],
      "listItems": [],
      "table": {
        "columns": [],
        "rows": []
      }
    }
  ],
  "faq": [
    {
      "question": "Riittääkö 79 euron raportti yrityskaupan päätöksiin?",
      "answer": "Raportti antaa yhden analyysin lähtötiedoista: arvion, menetelmät perusteluineen, skenaariot ja riskit. Se voi auttaa valmistelussa, mutta ei yksin riitä kaupan due diligence -tarkastukseen tai kauppapäätökseksi. Suurissa kaupoissa ja riitatilanteissa käytä lisäksi omaa neuvonantajaa."
    },
    {
      "question": "Miksi laskettu arvo ja lopullinen kauppahinta eroavat toisistaan?",
      "answer": "Arvo on analyysin tulos, hinta neuvottelun. Hintaan vaikuttavat kaupan rakenne, maksuehdot, ostajakilpailu ja aikataulu. Raportin arvostusväli kertoo, millä alueella perusteltu hinta liikkuu ja mitä oletuksia välin ylä- tai alapää edellyttää."
    },
    {
      "question": "Sopiiko sama raportti sekä myyjälle että ostajalle?",
      "answer": "Raportti voi auttaa kumpaakin osapuolta vertaamaan oletuksia ja laatimaan jatkokysymyksiä. Sen tilaaja voi antaa lisätietoja, joten raportti ei ole osapuolista riippumaton fairness opinion eikä due diligence -tarkastus."
    },
    {
      "question": "Voinko antaa raporttiin omia tietoja, kuten saadun ostotarjouksen?",
      "answer": "Voit antaa tilauksen yhteydessä lisätietoja, jotka esitetään tilaajan toimittamina oletuksina, ei itsenäisesti varmennettuina tosiasioina. Voit myös valita liikevaihto- ja EBIT-ennusteiden tarkistuksen ennen raportin luontia."
    },
    {
      "question": "Miten raportti käsittelee tappiollista tai velkaista kohdeyhtiötä?",
      "answer": "Arvio riippuu käytettävissä olevista tiedoista ja ennusteista. Raportti kuvaa datan rajoitteet, skenaariot ja keskeiset riskit. Se ei takaa vähimmäisarvoa eikä korvaa maksukykyä, velkoja tai sopimuksia koskevaa erillistä selvitystä."
    },
    {
      "question": "Kuinka nopeasti saan raportin neuvotteluja varten?",
      "answer": "Kun yrityksen tilinpäätöstiedot ovat Valuatumin aineistossa, raportti alkaa syntyä maksun jälkeen ja valmistuu tyypillisesti 10–20 minuutissa. Näet edistymisen selaimessa ja saat PDF:n sähköpostiisi. Voit tutustua etukäteen [julkiseen Heeros-esimerkkiraporttiin](/samples/heeros-oyj.pdf)."
    }
  ],
  "ctaHeading": "Selvitä yrityksen arvo ennen neuvottelupöytää",
  "ctaText": "Tilaa yrityskohtainen AI-arvonmääritysraportti 79 € (sis. Suomen alv:n). Raportti näyttää lähtöaineiston, oletukset, valitut menetelmät ja datan rajoitteet. Tyypillinen valmistumisaika on 10–20 minuuttia; tutustu ensin [julkiseen Heeros-esimerkkiraporttiin](/samples/heeros-oyj.pdf)."
} as ContentPageData
