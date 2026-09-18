export type BlogSection = {
  heading: string
  paragraphs: string[]
  listItems?: string[]
}

export type BlogPost = {
  slug: string
  seoTitle: string
  metaDescription: string
  h1: string
  date: string
  updatedDate?: string
  excerpt: string
  sections: BlogSection[]
}

const data = {
  "indexIntro": "Valuatumin blogi käsittelee yrityksen arvonmääritystä käytännönläheisesti ja selkokielellä: menetelmät ja niiden rajat, tyypilliset virheet omissa laskelmissa sekä tekoälyn todellinen rooli analyysissä. Kirjoitukset perustuvat Valuatumin yli 25 vuoden kokemukseen arvonmääritys- ja analyysijärjestelmistä pankeille ja analyysitaloille.",
  "posts": [
    {
      "slug": "miten-yrityksen-arvo-maaritetaan",
      "seoTitle": "Miten yrityksen arvo määritetään? Menetelmät selkokielellä",
      "metaDescription": "Substanssiarvo, DCF, EVA ja verrokkikertoimet selkokielellä: mitä kukin mittaa, milloin mikäkin sopii ja miksi yksi piste-estimaatti ei riitä yrityksen arvoksi.",
      "h1": "Miten yrityksen arvo määritetään? Menetelmät selkokielellä",
      "date": "2026-07-02",
      "updatedDate": "2026-09-18",
      "excerpt": "Substanssiarvo, DCF, EVA ja verrokkikertoimet selkokielellä: mitä kukin mittaa, milloin mikäkin sopii — ja miksi luotettava arvonmääritys hylkää osan menetelmistä ja antaa välin, ei yhtä lukua.",
      "sections": [
        {
          "heading": "Miten yrityksen arvo määritetään lyhyesti?",
          "paragraphs": [
            "Yrityksen arvoa voidaan arvioida tulevien kassavirtojen nykyarvolla (kuten DCF), markkinaverrokeilla (kuten P/E ja EV/EBITDA) tai omaisuuserien ja velkojen perusteella. Menetelmä valitaan arvonmäärityksen tarkoituksen, yhtiön ja käytettävissä olevan tiedon mukaan. Menetelmiä ei pidä laskea yhteen tai keskiarvoistaa vain siksi, että ne tuottavat eri lukuja.",
            "Menetelmät vastaavat eri kysymyksiin: DCF arvioi tulevan kassavirran arvoa tänään, verrokkikertoimet suhteuttavat tunnusluvun markkinahintaan ja substanssiarvo tarkastelee varoja ja velkoja. Valuatumin julkisessa Heeros-esimerkissä DCF on päämenetelmä 100 %:n painolla ja EVA 0 %:n painolla tehtävä täsmäytys; verrokkikertoimet ja tasearvo hylätään tämän yhtiön aineiston perusteella. Muiden yhtiöiden menetelmävalinta voi olla erilainen."
          ],
          "listItems": []
        },
        {
          "heading": "Mitä substanssiarvo kertoo yrityksen arvosta?",
          "paragraphs": [
            "Substanssiarvo kuvaa yhtiön varoja vähennettynä veloilla arvonmäärityksessä käytetyillä arvoilla. Se voi auttaa hahmottamaan, mitä taseeseen sisältyy, mutta kirjanpitoarvo ei välttämättä vastaa varan käypää arvoa. Arvioon voivat vaikuttaa myös esimerkiksi myyntikulut ja vastuut, joita tase ei yksin kuvaa.",
            "Substanssiarvo voi olla hyödyllinen omaisuusvaltaisessa yhtiössä tai silloin, kun tuottoja on vaikea ennustaa. Se ei automaattisesti ole markkina-arvon vähimmäistaso eikä sama asia kuin selvitystilan jako-osuus. Verohallinnon perintö- ja lahjaverotuksen ohje käyttää tuotto- ja substanssiarvoa tietyissä tilanteissa verotusarvon määrittämiseen; [ohje](https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/152995/yritysvarallisuuden-arvostaminen-perinto--ja-lahjaverotuksessa2/) koskee verotusta eikä kaikkia yrityskauppoja."
          ],
          "listItems": []
        },
        {
          "heading": "Miten tuottoarvo ja DCF-laskelma toimivat?",
          "paragraphs": [
            "DCF eli diskontattu kassavirta ennustaa yhtiön tulevat vapaat kassavirrat ja diskonttaa ne nykyhetkeen tuottovaatimuksella, joka heijastaa sijoituksen riskiä. Ennustejakson jälkeinen aika arvostetaan päätearvolla. Tulos on tuottoarvo: mitä yhtiön tuleva kassavirta on ostajalle arvoinen tänään.",
            "DCF:n vahvuus on oletusten näkyvyys: kasvu, kannattavuus, investoinnit ja tuottovaatimus kirjataan malliin. Samat oletukset ovat myös epävarmuuden lähde. Pitkän ennustejakson jälkeinen päätearvo voi muodostaa suuren osan arvosta, joten tulosta on hyvä tarkastella eri kasvun ja tuottovaatimuksen oletuksilla.",
            "DCF on käyttökelpoisempi silloin, kun kassavirralle voidaan muodostaa perusteltu ennuste. Jos yhtiön tulos vaihtelee voimakkaasti tai ennusteeseen liittyy suurta epävarmuutta, se pitää tuoda näkyviin skenaarioissa ja rajoitteissa."
          ],
          "listItems": []
        },
        {
          "heading": "Mitä EVA-menetelmä mittaa?",
          "paragraphs": [
            "EVA eli taloudellinen lisäarvo mittaa tulosta, joka ylittää pääoman kustannuksen. Yhtiön arvo on sitoutunut pääoma lisättynä tulevien lisäarvojen nykyarvolla. Jos yhtiö tuottaa pääomalleen vain sen kustannuksen verran, kasvu ei luo arvoa — EVA tekee tämän näkyväksi tavalla, jota pelkkä tuloslaskelma ei näytä.",
            "Yhteensopivilla ennusteilla ja tuottovaatimuksilla EVA ja DCF voivat toimia toisiaan täydentävinä näkökulmina. EVA auttaa tarkastelemaan pääoman tuoton suhdetta sen kustannukseen; DCF arvioi tulevien kassavirtojen nykyarvoa. Ne eivät ole toisistaan riippumattomia, jos laskelmat käyttävät samoja oletuksia."
          ],
          "listItems": []
        },
        {
          "heading": "Milloin verrokkikertoimet kuten P/E ja EV/EBITDA toimivat?",
          "paragraphs": [
            "Verrokkimenetelmä hinnoittelee yhtiön sen mukaan, mitä vastaavista yhtiöistä maksetaan: P/E suhteuttaa hinnan nettotulokseen, EV/EBITDA yritysarvon käyttökatteeseen. Menetelmä toimii, kun aidosti vertailukelpoisia yhtiöitä on olemassa ja tulos on normalisoitu kertaeristä.",
            "Verrokit menevät helposti pieleen: P/E on merkityksetön tappiolliselle yhtiölle, listattujen suuryhtiöiden kertoimet eivät sovellu pienelle listaamattomalle yhtiölle ilman koko- ja likviditeettialennuksia, ja yhden poikkeusvuoden tulos vääristää koko arvion. Tappiolliselle yhtiölle toimivampia ovat esimerkiksi kannattavuuden ja liikevaihtokertoimen suhteuttaminen toisiinsa (EBIT-% vs. P/S) tai substanssiarvo."
          ],
          "listItems": []
        },
        {
          "heading": "Mitä eroa on yritysarvolla (EV) ja oman pääoman arvolla?",
          "paragraphs": [
            "Yritysarvo (EV) kuvaa liiketoiminnan arvoa kaikille pääoman rahoittajille. Oman pääoman arvo kuvaa osakkeenomistajille kuuluvaa osuutta. Yksinkertaistettu laskukaava on oman pääoman arvo = yritysarvo − nettovelka, jossa nettovelka = korolliset velat − kassa. Esimerkiksi 6 M€:n yritysarvosta ja 1 M€:n nettovelasta seuraa 5 M€:n oman pääoman arvo ennen muita kauppakohtaisia oikaisuja.",
            "EV/EBITDA-kerrointa käytetään yritysarvon arviointiin, joten sitä ei pidä verrata sellaisenaan osakkeista maksettavaan hintaan. [Yrityskaupan opas](/yrityskauppa) ja [arvonmäärityslaskuri](/laskuri) havainnollistavat eroa."
          ],
          "listItems": []
        },
        {
          "heading": "Mitä eroa arvonmääritysmenetelmillä on?",
          "paragraphs": [
            "Menetelmien erot tiivistettynä:"
          ],
          "listItems": [
            "Substanssiarvo — mittaa: varat vähennettynä veloilla arvonmäärityksen oletuksin · sopii: omaisuusvaltaisen yhtiön taseen tarkasteluun · ei yksin kuvaa tulevia kassavirtoja",
            "DCF (tuottoarvo) — mittaa: tulevien kassavirtojen nykyarvo · sopii: ennustettava kassavirta · ei sovi: yhtiö, jonka ennusteelle ei ole uskottavaa pohjaa",
            "EVA — mittaa: pääoman kustannuksen ylittävä tulos · sopii: DCF:n ristitarkistus ja arvonluonnin erittely · ei sovi: käytettäväksi yksin ilman kassavirta-analyysiä",
            "Verrokkikertoimet (P/E, EV/EBITDA) — mittaa: markkinahinta suhteessa tulokseen · sopii: kun vertailukelpoisia yhtiöitä on ja tulos on normalisoitu · ei sovi: tappiollinen tai poikkeusvuoden varassa oleva yhtiö"
          ]
        },
        {
          "heading": "Miksi osa menetelmistä pitää hylätä?",
          "paragraphs": [
            "Jokainen menetelmä olettaa jotain yhtiöstä. Jos oletus ei päde — P/E tappiolliselle yhtiölle, substanssi kevyttaseiselle kasvuyhtiölle — menetelmän tuottama luku ei ole varovainen arvio vaan kohinaa. Kohinan keskiarvoistaminen mielekkäiden tulosten kanssa ei paranna arviota, se laimentaa sen.",
            "Siksi raportin pitäisi kertoa, mitä menetelmää käytettiin, mitä hylättiin ja miksi. Hylkäysperustelu auttaa lukijaa arvioimaan, sopiiko lähdeaineisto ja laskentatapa kyseiseen yhtiöön. Julkisessa Heeros-esimerkissä EV/EBITDA ja P/E hylättiin, koska vertailukertoimia ei ollut lähdeaineistossa."
          ],
          "listItems": []
        },
        {
          "heading": "Miksi yksi piste-estimaatti valehtelee?",
          "paragraphs": [
            "Yhtiön tuleva kehitys on epävarma, joten yksi tarkka euromäärä voi antaa liiallisen varman vaikutelman. Skenaarioissa kuvataan vaihtoehtoisia kehityspolkuja ja niiden oletuksia. Jos todennäköisyyksiä käytetään, odotusarvo on näillä todennäköisyyksillä painotettu summa — se ei ole varma ennuste.",
            "Kuvitteellinen esimerkki: pessimistinen skenaario 0,5 M€ (30 %), realistinen 2,0 M€ (55 %) ja optimistinen 3,5 M€ (15 %). Odotusarvo on 0,30 × 0,5 + 0,55 × 2,0 + 0,15 × 3,5 = 1,8 M€ — vähemmän kuin realistisen skenaarion 2,0 M€, koska riskit painavat alaspäin. Tämän eron näkeminen on skenaarioanalyysin ydin: se kertoo, kumpaan suuntaan epävarmuus kallistaa arvoa.",
            "Sekä ostaja että myyjä hyötyvät välistä enemmän kuin yhdestä luvusta: väli näyttää, mistä oletuksesta arvo riippuu ja mistä hintaneuvottelussa todellisuudessa keskustellaan."
          ],
          "listItems": []
        },
        {
          "heading": "Mitkä ovat tyypillisimmät virheet omissa arvonmäärityslaskelmissa?",
          "paragraphs": [
            "Omatoimisissa laskelmissa toistuvat tyypillisesti samat virheet:"
          ],
          "listItems": [
            "Tulosta ei normalisoida: yksittäinen hyvä tai huono vuosi ohjaa koko arviota, vaikka kertaerät ja poikkeusvuodet pitäisi oikaista.",
            "Omistajayrittäjän palkkakorjaus unohtuu: jos omistaja nostaa markkinatasoa pienempää palkkaa, tulos yliarvioi yhtiön todellisen kannattavuuden.",
            "Nettovelka jää vähentämättä: yritysarvo (EV) ja osakekannan arvo menevät sekaisin, jolloin velkaisen yhtiön hinta yliarvioidaan.",
            "Päätearvon kasvuoletus on suurempi kuin talouden pitkän aikavälin kasvu — jolloin yhtiön oletetaan kasvavan ikuisesti taloutta nopeammin.",
            "Kertoimet poimitaan listatuista suuryhtiöistä ilman koko-, likviditeetti- ja riskialennuksia.",
            "Herkkyystarkastelu puuttuu: ei tiedetä, mikä oletus ratkaisee lopputuloksen, joten arvion haurautta ei nähdä.",
            "Kaikki menetelmät keskiarvoistetaan hylkäämättä yhtiölle sopimattomia."
          ]
        },
        {
          "heading": "Missä näitä menetelmiä voi nähdä käytännössä?",
          "paragraphs": [
            "Valuatumin raportti näyttää yhtiökohtaisen arvion, skenaariot, käytetyt ja hylätyt menetelmät sekä datan rajoitteet. Julkisessa Heeros-esimerkissä DCF on päämenetelmä ja EVA täsmäytys; menetelmätaulukosta näet myös painot ja hylkäysperusteet. Avaa [Heeros-esimerkkiraportti](/samples/heeros-oyj.pdf), katso [hinta](/#hinnoittelu) tai [hae yritys](/yritys). Tekoälyn rajat käsittelemme kirjoituksessa [Tekoäly yrityksen arvonmäärityksessä](/blogi/tekoaly-yrityksen-arvonmaarityksessa)."
          ],
          "listItems": []
        },
        {
          "heading": "Usein kysytyt kysymykset yrityksen arvonmäärityksestä",
          "paragraphs": [
            "Lyhyet vastaukset yleisimpiin kysymyksiin:"
          ],
          "listItems": [
            "Mikä on yleisin menetelmä yrityksen arvonmäärityksessä? DCF eli diskontattu kassavirta on yleinen tapa arvioida tulevien kassavirtojen arvoa. Verrokkikertoimet voivat täydentää arviota, jos vertailuaineistoa on. Menetelmät valitaan tapauksen mukaan, eikä niitä pidä keskiarvoistaa automaattisesti.",
            "Voiko yrityksen arvon laskea liikevaihdosta? Liikevaihtokerroin yksin kertoo vähän, koska sama liikevaihto voi tuottaa hyvin erikokoisen tuloksen. Kerroin toimii lähinnä apuvälineenä, kun se suhteutetaan kannattavuuteen.",
            "Mikä menetelmä sopii tappiolliselle yritykselle? Menetelmä riippuu siitä, miksi yhtiö tekee tappiota ja ovatko tulevat kassavirrat ennustettavissa. Substanssiarvo, kassavirtaennusteet ja mahdollinen käänne pitää arvioida erikseen; substanssiarvo ei automaattisesti ole markkina-arvon alaraja.",
            "Miksi arvonmääritys antaa välin eikä yhtä lukua? Koska tulevaisuus on epävarma. Skenaarioiden todennäköisyyksillä painotettu odotusarvo ja arvostusväli kertovat enemmän kuin piste-estimaatti: ne näyttävät, mihin suuntaan riskit kallistavat arvoa.",
            "Riittääkö itse tehty laskelma yrityskauppaan? Se auttaa jäsentämään odotuksia, mutta ei korvaa sopimusten, taloudellisen aseman tai oikeudellisten riskien due diligence -tarkastusta. Isossa kaupassa kannattaa käyttää lisäksi talous- ja lakiasiantuntijaa."
          ]
        },
        {
          "heading": "Lähteet ja rajaus",
          "paragraphs": [
            "International Valuation Standards Councilin [sanasto](https://ivsc.org/standards-glossary/) kuvaa tuotto-, markkina- ja kustannuslähestymistapoja yleisinä arvonmäärityksen menetelmäperheinä. Suomen Verohallinnon [yritysvarallisuuden arvostamisohje](https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/152995/yritysvarallisuuden-arvostaminen-perinto--ja-lahjaverotuksessa2/) koskee perintö- ja lahjaverotuksen tilanteita. Verotusarvoa ei pidä tulkita suoraan yrityskaupan kauppahinnaksi. Tämä artikkeli ei väitä Valuatumin raportin olevan IVS-standardin mukainen lausunto."
          ]
        }
      ]
    },
    {
      "slug": "tekoaly-yrityksen-arvonmaarityksessa",
      "seoTitle": "Tekoäly yrityksen arvonmäärityksessä: mihin se pystyy ja mihin ei",
      "metaDescription": "Selvitä, miten tekoälyä käytetään yrityksen arvonmäärityksessä, mihin laskenta perustuu ja mitä raportti ei voi korvata.",
      "h1": "Tekoäly yrityksen arvonmäärityksessä — mihin se pystyy ja mihin ei",
      "date": "2026-07-02",
      "updatedDate": "2026-09-18",
      "excerpt": "Tekoäly voi auttaa aineiston tulkinnassa ja analyysin kirjoittamisessa, mutta arvio riippuu lähdetiedoista ja oletuksista. Tässä kerromme, mitä Valuatumin raportin laskentamoottori tekee, mihin tekoälyä käytetään ja mitä raportti ei voi korvata.",
      "sections": [
        {
          "heading": "Mitä tekoäly tekee yrityksen arvonmäärityksessä?",
          "paragraphs": [
            "Valuatumin raportissa laskentamoottori tuottaa arvonmäärityksen numerot käytettävissä olevasta yhtiödatasta ja ennusteista. Tekoäly tulkitsee tuloksia ja kirjoittaa analyysitekstin; se ei laske DCF:ää uudelleen. Arvio riippuu silti lähdetietojen kattavuudesta ja valituista oletuksista.",
            "Tässä käymme läpi, mikä osa raportista on laskentaa, mikä tekoälyn tuottamaa tulkintaa ja mitä raportti ei voi korvata."
          ],
          "listItems": []
        },
        {
          "heading": "Mihin tekoäly pystyy arvonmäärityksessä hyvin?",
          "paragraphs": [
            "Raportissa tekoälyn rooli on rajattu. Se auttaa selittämään laskennan tuloksia ja jäsentämään yrityksen taustatietoja; itse arvon laskenta tulee Valuatumin laskentamoottorista."
          ],
          "listItems": [
            "Nopeus: valmiiksi saatavilla olevaan tilinpäätösdataan perustuva raportti valmistuu tyypillisesti 10–20 minuutissa.",
            "Tulkinnan tuki: tekoäly muotoilee selityksiä laskentatuloksista ja tuo esiin niitä koskevia oletuksia.",
            "Dokumentointi: raportissa kuvataan käytetyt menetelmät, oletukset ja tunnistetut tietorajoitteet.",
            "Rajattu työnjako: laskentamoottori laskee; tekoäly tulkitsee ja kirjoittaa."
          ]
        },
        {
          "heading": "Mitä tekoälyn ei pidä antaa tehdä arvonmäärityksessä?",
          "paragraphs": [
            "Keksiä lukuja. Kielimalli on rakennettu tuottamaan uskottavan kuuloista tekstiä — ja se tuottaa yhtä sujuvasti myös uskottavan kuuloisia lukuja. Tavallisessa tekstissä tämä on harmi; arvonmäärityksessä se tekee koko raportista arvottoman, koska yksikin keksitty euromäärä vie pohjan kaikilta muilta.",
            "Arvonmäärityksessä kielimallin tekstiä ei pidä tulkita itsenäiseksi taloudelliseksi näytöksi. Siksi lukijan kannattaa tarkistaa raportin lähderekisteri, oletukset ja tiedon rajoitteet. Heeros-esimerkissä nämä näkyvät raportin omissa osioissa; esimerkki kertoo yhdestä yhtiöstä eikä takaa kaikkien yhtiöiden aineiston samanlaista kattavuutta."
          ],
          "listItems": []
        },
        {
          "heading": "Miten laskenta ja tekoälyn tulkinta erotetaan?",
          "paragraphs": [
            "Valuatumin raportin työnjako on seuraava:"
          ],
          "listItems": [
            "1. Raportti käyttää Valuatumin aineistossa olevia yrityksen tilinpäätös- ja taloustietoja.",
            "2. Laskentamoottori tuottaa ennusteet ja arvonmäärityslaskelmat.",
            "3. Tekoäly tulkitsee laskennan tuloksia ja kirjoittaa analyysitekstin.",
            "4. Raportti näyttää käytetyt menetelmät, oletukset, lähteet ja tunnistetut rajoitteet.",
            "5. Halutessaan tilaaja voi tarkistaa liikevaihto- ja EBIT-ennusteet ennen raportin luontia.",
            "6. Raportti ei korvaa tilintarkastusta, johdon haastattelua, due diligence -tarkastusta tai asiantuntijan arviota."
          ]
        },
        {
          "heading": "Miksi ChatGPT antaa eri tuloksen kuin validoitu arvonmääritys?",
          "paragraphs": [
            "Keskustelevan kielimallin vastaus riippuu sille annetusta aineistosta, tehtävästä ja käytettävistä työkaluista. Ilman erikseen tuotua lähdedataa ja mallia vastaus ei itsessään kerro, mitä oletuksia yhtiön arvolle käytettiin.",
            "Valuatumin raportin keskeinen ero on laskentamoottorin, yritysaineiston ja raportissa näkyvien oletusten yhdistelmä. Lähteet ja rajaukset voi tarkistaa raportista. Tämä tekee vastauksesta arvioitavamman, mutta ei takaa datan täydellisyyttä tai korvaa ihmisen tekemää tarkastusta."
          ],
          "listItems": []
        },
        {
          "heading": "Mikä arvonmäärityksessä jää ihmiselle?",
          "paragraphs": [
            "Kolme asiaa ei automatisoidu:"
          ],
          "listItems": [
            "Neuvottelu: hinta syntyy neuvottelupöydässä, ei raportissa. Raportti antaa perustellun välin ja arvon ajurit — argumentit, ei lopputulosta.",
            "Due diligence: sopimukset, asiakassuhteet, avainhenkilöriskit ja riidat eivät näy tilinpäätöksessä. Niiden tarkastaminen on ihmistyötä.",
            "Vastuu ja harkinta: isoon transaktioon kannattaa hankkia asiantuntija-arvio. AI-raportti on nopea ja edullinen ensimmäinen askel tai toinen mielipide — ei neuvonantajan korvaaja kaupan viimeistelyssä."
          ]
        },
        {
          "heading": "Voiko raportin oletuksiin vaikuttaa itse?",
          "paragraphs": [
            "Tilauksen yhteydessä voi antaa lisätietoja, jotka täydentävät julkista aineistoa. Niitä ei varmenneta itsenäisesti. Lisäksi tilaaja voi valita liikevaihto- ja EBIT-ennusteiden tarkistuksen ja muokata niitä ennen raportin luontia; raportti erottaa vahvistetut luvut lähdedatasta.",
            "Raportti on analyysi päätöksenteon tueksi — ei fairness opinion, tilintarkastus, sijoitusneuvonta tai oikeudellinen käyvän arvon lausunto."
          ],
          "listItems": []
        },
        {
          "heading": "Mitä AI-arvonmääritysraportti maksaa ja miten sen saa?",
          "paragraphs": [
            "Raportin rakennetta voi tarkastella maksuttomasta, julkisista tiedoista laaditusta [Heeros-esimerkkiraportista](/samples/heeros-oyj.pdf). Yksittäinen raportti maksaa [79 € (sis. Suomen alv:n)](/#hinnoittelu) ja valmistuu tyypillisesti 10–20 minuutissa, kun yhtiön tilinpäätöstiedot ovat aineistossa. [Hae yritys ja tilaa raportti](/yritys). Jos menetelmät ovat vieraita, aloita artikkelista [Miten yrityksen arvo määritetään?](/blogi/miten-yrityksen-arvo-maaritetaan)."
          ],
          "listItems": []
        },
        {
          "heading": "Usein kysytyt kysymykset tekoälystä arvonmäärityksessä",
          "paragraphs": [
            "Lyhyet vastaukset yleisimpiin kysymyksiin:"
          ],
          "listItems": [
            "Keksiikö tekoäly lukuja raporttiin? Valuatumin arvon laskenta tulee laskentamoottorista, ja tekoäly tulkitsee tuloksia sekä kirjoittaa analyysin. Tarkista raportista käytetyt tiedot, oletukset ja rajoitteet; raportti ei varmista kaikkea lähdeaineistoa.",
            "Onko tekoälyn tekemä arvonmääritys luotettava? Luotettavuus riippuu aineiston laadusta, oletuksista ja sovelletusta menetelmästä. Raportin lähteet, menetelmät ja rajoitteet auttavat lukijaa arvioimaan tulosta, mutta raportti ei takaa arvion oikeellisuutta.",
            "Miten AI-raportti eroaa siitä, että kysyn arvoa ChatGPT:ltä? Valuatumin raportti käyttää yrityksen tilinpäätösaineistoa ja arvonmäärityksen laskentamoottoria, ja näyttää käytetyt oletukset sekä menetelmät. Yleiskäyttöisen kielimallin vastaus riippuu sille annetusta aineistosta ja työkaluista; kumpaakaan ei pidä käyttää due diligence -tarkastuksen korvikkeena.",
            "Korvaako tekoäly arvonmäärityksen asiantuntijan? Ei. Raportti voi olla nopea lähtökohta tai toinen näkemys; neuvottelu, due diligence, verotus ja oikeudelliset kysymykset vaativat ihmisen harkintaa ja tarvittaessa asiantuntijaa.",
            "Onko raportti virallinen käyvän arvon lausunto? Ei. Se on analyysiraportti päätöksenteon tueksi — ei tilintarkastus, fairness opinion, sijoitusneuvonta tai oikeudellinen lausunto, eikä sellaisenaan verotukseen kelpaava arvo."
          ]
        }
      ]
    }
  ]
}

export const blogIndexIntro: string = data.indexIntro
export const blogPosts: BlogPost[] = data.posts
