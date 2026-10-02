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
    },
    {
      "slug": "sain-ostotarjouksen-yrityksesta",
      "seoTitle": "Sain ostotarjouksen yrityksestä – mitä ostajan ja myyjän kannattaa tarkistaa?",
      "metaDescription": "Tarkista yrityksen ostotarjouksesta kaupan kohde, nettovelka, normalisoitu tulos, kassavirta ja ehdollinen lisäkauppahinta ennen neuvottelua.",
      "h1": "Sain ostotarjouksen yrityksestä – mitä kannattaa tarkistaa?",
      "date": "2026-10-02",
      "excerpt": "Ostotarjouksen otsikkohinta ei yksin kerro, mitä ostaja maksaa heti tai mitä yrityksestä lopulta siirtyy. Näillä kysymyksillä saat tarjouksen luvut ja ehdot samaan kehykseen.",
      "sections": [
        {
          "heading": "Ostotarjouksen hinta ja yrityksen arvo ovat eri asioita",
          "paragraphs": [
            "Ostotarjous on ehdotus kaupasta. Siihen voi sisältyä käteishinta, velkoihin ja kassaan liittyviä oikaisuja, ehtoja ja myöhemmin maksettavaa lisäkauppahintaa. Siksi otsikossa näkyvä summa ei vielä kerro, paljonko myyjä saa kaupanteossa tai millä oletuksilla ostaja on hinnan muodostanut.",
            "Arvonmääritys puolestaan tuottaa arvion määritellyllä tarkoituksella, aineistolla ja oletuksilla. IVSC:n [sanastossa](https://ivsc.org/standards-glossary/) markkina-arvo kuvataan arvioksi, ei yksittäisen sopimuksen varmaksi hinnaksi. Ostajalle ja myyjälle hyödyllinen kysymys ei siis ole vain “onko hinta oikea?”, vaan “mitä tämän hinnan pitää olettaa toteutuvan?”"
          ]
        },
        {
          "heading": "Selvitä ensin, mitä tarjouksessa ostetaan",
          "paragraphs": [
            "Osakekaupassa omistaja myy osakeyhtiön osakkeet. Liiketoimintakaupassa sovitaan liiketoiminnan tai sen osan sekä siihen kuuluvan omaisuuden siirrosta. Kohteeseen, vastuisiin ja verokohteluun vaikuttavat kaupan rakenne ja sopimukset; nimike yksin ei ratkaise yksityiskohtia. Verohallinto kuvaa yrityksen omistajanvaihdoksen mahdollisuuksina sekä osakkeiden että liiketoiminnan varojen ja velkojen kokonaisuuden luovuttamisen [ohjeessaan](https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/60519/osakeyhtion-sukupolvenvaihdos-verotuksessa2/).",
            "Pyydä tarjous erittelemään kaupan kohde: osakkeet vai liiketoiminta, mukana olevat varat, sopimukset ja velat sekä mahdolliset kaupan ulkopuolelle jäävät erät. Ostajana näin näet, mitä olet hankkimassa. Myyjänä voit verrata tarjousta omiin odotuksiisi ilman, että eri rakenteiden summat näyttävät suoraan vertailukelpoisilta."
          ]
        },
        {
          "heading": "Vertaa yritysarvoa oman pääoman arvoon",
          "paragraphs": [
            "Tarjouksessa käytetty yritysarvo eli EV ja osakkeista maksettava hinta eivät ole sama luku. Yksinkertaistettuna oman pääoman arvo saadaan vähentämällä yritysarvosta nettovelka: korolliset velat vähennettynä kassalla. Esimerkiksi 1,2 miljoonan euron yritysarvosta ja 0,2 miljoonan nettovelasta saadaan 1,0 miljoonan euron oman pääoman arvo ennen käyttöpääomaa ja muita kauppakohtaisia oikaisuja. CFA Instituten [EV-kertoimia käsittelevä katsaus](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/market-based-valuation-price-enterprise-value-multiples) kuvaa EV:n velan, oman pääoman ja muiden pääomaerien kokonaisarvona vähennettynä kassavaroilla.",
            "Lue sopimuksesta, miten kassa, korolliset velat, käyttöpääoma, vuokravastuut ja mahdolliset velanluonteiset erät määritellään. Laskukaava on hyödyllinen lähtökohta, mutta se ei korvaa ostotarjouksen tai kauppakirjan tarkkojen määritelmien läpikäyntiä."
          ]
        },
        {
          "heading": "Tarkista, kuvaako tulos yhtiön jatkuvaa toimintaa",
          "paragraphs": [
            "Yhden tilikauden tulos voi antaa harhaanjohtavan kuvan, jos vuoteen sisältyy poikkeuksellinen kulu tai tuotto. Tarkastele myös omistajayrittäjän palkkaa: jos palkka poikkeaa siitä, mitä vastaavan työn tekijälle maksettaisiin, oikaisu voi muuttaa vertailukelpoista tulosta. Yksittäinen oikaisu ei silti ole automaattisesti hyväksyttävä; sen pitää perustua aineistoon ja perusteluun.",
            "Ostajan kannattaa katsoa tuloksen lisäksi kassavirtaa, investointitarpeita ja sitä, kuinka riippuvainen toiminta on yhdestä asiakkaasta tai avainhenkilöstä. Myyjän taas kannattaa varautua avaamaan tärkeimpien oletusten taustalla olevat luvut. CFA Instituten [yksityisten yritysten arvonmäärityksen katsaus](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/private-company-valuation) käsittelee muun muassa normalisoitua tulosta ja yksityisyritysten kassavirta-arvioiden erityiskysymyksiä."
          ]
        },
        {
          "heading": "Erota kaupanteossa maksettava raha lisäkauppahinnasta",
          "paragraphs": [
            "Tarjous voi sisältää earn-outin eli ehdollisen lisäkauppahinnan, joka maksetaan myöhemmin, jos sovitut tavoitteet täyttyvät. Se ei ole sama asia kuin kaupanteossa maksettava varma summa. Ehdot kannattaa lukea ainakin mittarin, mittauskauden, laskentatavan, raportoinnin ja sen kannalta, kuka voi vaikuttaa tulokseen. IFRS 3 käsittelee yritysjärjestelyn [ehdollista vastiketta](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-3-business-combinations/); sen kirjanpitokäsittely ei kuitenkaan kerro, mitä ostaja tai myyjä saa sopia.",
            "Kuvitteellinen esimerkki: tarjous lupaa osakkeista yhteensä enintään 1,0 miljoonaa euroa. Siitä 850 000 euroa maksetaan kaupanteossa ja enintään 150 000 euroa myöhemmin, jos sovitut tulostavoitteet toteutuvat. Jos tavoite ei täyty, myyjä saa esimerkissä 850 000 euroa. Otsikkohinta on siis enimmäismäärä, ei koko kauppahinnan varma käteisosuus."
          ]
        },
        {
          "heading": "Ostajan ja myyjän tarkistuslista tarjouksen lukemiseen",
          "paragraphs": [
            "Ennen vastaamista kannattaa saada samalle sivulle hinta, laskentaperusteet ja ehdot. Käy ainakin nämä kohdat läpi:"
          ],
          "listItems": [
            "Pyydä kirjallinen tarjous, josta käyvät ilmi kaupan kohde, hinta ja keskeiset ehdot.",
            "Mikä on kaupan kohde, ja mitkä varat, velat, sopimukset tai vastuut sisältyvät siihen?",
            "Onko tarjottu summa yritysarvo vai osakkeiden arvo, ja miten nettovelka sekä kassa lasketaan?",
            "Mitä tuloksen oikaisuja on tehty ja millä tositteilla ne perustellaan?",
            "Miten kassavirta kestää heikomman myynnin, suuremmat kulut tai välttämättömät investoinnit?",
            "Kuinka paljon maksetaan heti, ja mikä osa riippuu myöhemmistä tavoitteista?",
            "Millä aikataululla ostajan rahoitus, tarkastukset ja muut ehdot varmistuvat?",
            "Mitä tietoja ja asiantuntija-arvioita tarvitaan ennen sitovaa päätöstä?"
          ]
        },
        {
          "heading": "Mihin arvonmääritysraportti auttaa — ja mihin se ei riitä?",
          "paragraphs": [
            "Arvonmääritysraportti voi auttaa ostajaa ja myyjää tunnistamaan, miten tulos-, kassavirta- ja velkaoletukset vaikuttavat arvioon sekä mitä kysymyksiä kannattaa selvittää lisää. Valuatumin [arvonmäärityslaskurilla](/laskuri) voi tarkastella laskennan lähtökohtia, ja [yrityskertoimien oppaassa](/kertoimet) käsitellään kertoimien tulkintaa. Laajempi käytännön katsaus on [yrityskaupan oppaassa](/yrityskauppa); raportin hinnan ja rajauksen löydät artikkelista [Yrityksen arvonmäärityksen hinta](/blogi/yrityksen-arvonmaarityksen-hinta).",
            "Raportti auttaa jäsentämään oletuksia ja kysymyksiä. Se ei tarkasta sopimuksia tai kirjanpitoa, tee due diligence -tarkastusta eikä anna fairness opinionia tai oikeudellista lausuntoa. Se ei myöskään päätä, kannattaako tarjous hyväksyä tai hylätä. Kaupan ehdot ja päätös jäävät osapuolille sekä heidän neuvonantajilleen."
          ]
        },
        {
          "heading": "Lähteet ja rajaus",
          "paragraphs": [
            "Taloudellisten käsitteiden lähteinä ovat International Valuation Standards Councilin [sanasto](https://ivsc.org/standards-glossary/), CFA Instituten [EV-kertoimia](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/market-based-valuation-price-enterprise-value-multiples) ja [yksityisten yritysten arvonmääritystä](https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/private-company-valuation) käsittelevät aineistot sekä IFRS Foundationin [IFRS 3](https://www.ifrs.org/issued-standards/list-of-standards/ifrs-3-business-combinations/). Kaupparakenteen yleiskuvauksessa on käytetty Verohallinnon [osakeyhtiön omistajanvaihdosta koskevaa ohjetta](https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/60519/osakeyhtion-sukupolvenvaihdos-verotuksessa2/). Tämä artikkeli on yleistä taustatietoa, ei vero-, sijoitus- tai oikeudellista neuvontaa."
          ]
        }
      ]
    },
    {
      "slug": "yrityksen-arvonmaarityksen-hinta",
      "seoTitle": "Yrityksen arvonmäärityksen hinta: mitä 79 € sisältää?",
      "metaDescription": "Valuatumin yrityskohtainen AI-arvonmääritysraportti maksaa 79 € sisältäen 25,5 % ALV:n. Katso, mitä hinta sisältää ja milloin tarvitaan asiantuntijapalvelua.",
      "h1": "Yrityksen arvonmäärityksen hinta – mitä 79 € sisältää?",
      "date": "2026-10-02",
      "excerpt": "Valuatumin AI-arvonmääritysraportti maksaa 79 € sisältäen Suomen 25,5 %:n ALV:n. Tässä kerromme, mitä kertahintaan sisältyy, kauanko raportti tavallisesti kestää ja milloin laajempi asiantuntijatyö kannattaa pyytää erikseen tarjouksena.",
      "sections": [
        {
          "heading": "Mitä yrityksen arvonmääritys maksaa Valuatumilla?",
          "paragraphs": [
            "Valuatumin yrityskohtainen AI-arvonmääritysraportti maksaa 79 €. Hinta sisältää Suomen yleisen 25,5 %:n arvonlisäveron: veroton osuus on 62,95 € ja ALV 16,05 €. Verohallinnon [arvonlisäveroprosenttien sivulla](https://vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/arvonlisaverotus/arvonlisaveroprosentit/) yleiseksi verokannaksi ilmoitetaan 25,5 %.",
            "Kyseessä on kertamaksu yhdestä raportista. Siihen ei liity jatkuvaa tilausta, kuukausimaksua tai asiakastilin luomista. Voit ensin katsoa raportin rakenteen julkisesta [Heeros-esimerkkiraportista](/samples/heeros-oyj.pdf) ja päättää sen jälkeen, haluatko tilata raportin omasta yrityksestä tai tarkasteltavasta yhtiöstä."
          ]
        },
        {
          "heading": "Mitä raportin hinta sisältää?",
          "paragraphs": [
            "Raportti kokoaa arvonmäärityksen ja selittää, millaisiin taloustietoihin, menetelmiin ja oletuksiin arvio nojaa. Raportissa käsitellään myös arvioon vaikuttavia riskejä sekä käytettävissä olevan aineiston rajoitteita. Käytännössä voit käyttää sitä lähtökohtana, kun haluat ymmärtää, mitkä oletukset vaikuttavat arvioon tai mitä kannattaa kysyä yhtiön taloudesta ennen keskustelua.",
            "Arvonmäärityksen menetelmä valitaan yhtiöstä ja saatavilla olevista tiedoista riippuen. Valuatumin [Heeros-esimerkissä](/samples/heeros-oyj.pdf) näet, miltä menetelmien perustelut, oletukset ja rajoitteet voivat näyttää yhdessä raportissa. Esimerkkiraportti kertoo kyseisestä yhtiöstä; se ei takaa, että jokaisen muun yhtiön lähdeaineisto olisi yhtä kattava."
          ]
        },
        {
          "heading": "Kauanko raportin saaminen kestää?",
          "paragraphs": [
            "Kun yhtiön taloustiedot ovat Valuatumin aineistossa, raportin muodostaminen kestää tavallisesti noin 10–20 minuuttia siitä, kun mahdollinen liikevaihto- ja EBIT-ennusteen tarkistus on tehty ja raportin luonti käynnistetty. Ennusteen tarkistus on valinnainen vaihe. Jos tarkistat lukuja, raportti odottaa, että olet valmis etenemään.",
            "10–20 minuuttia on tyypillinen arvio, ei toimitusaikatakuu. Raportti perustuu käytettävissä olevaan aineistoon ja ilmoitettuihin oletuksiin; se ei itsenäisesti varmista kaikkea yhtiöstä annettua tietoa."
          ]
        },
        {
          "heading": "Milloin edullinen raportti voi olla sopiva lähtökohta?",
          "paragraphs": [
            "Yksittäinen raportti voi olla hyödyllinen, kun haluat alustavan näkymän yhtiön arvon ajureihin, vertailla omia oletuksia tai valmistella tarkempia kysymyksiä yrityskauppaa varten. Se voi sopia ostajan tai omistajan ensivaiheen selvitykseen ja antaa yhteisen keskustelupohjan ennen laajempaa toimeksiantoa.",
            "Jos haluat harjoitella oletusten vaikutusta itse, kokeile [arvonmäärityslaskuria](/laskuri). [Yrityskertoimien opas](/kertoimet) puolestaan auttaa ymmärtämään, mitä kertoimilla voidaan ja ei voida päätellä. Yleisempi yrityskaupan valmistelun katsaus löytyy [yrityskaupan oppaasta](/yrityskauppa)."
          ]
        },
        {
          "heading": "Mitä 79 € raportti ei ole?",
          "paragraphs": [
            "Raportti ei ole due diligence -tarkastus, tilintarkastus, fairness opinion, veroarvon määritys eikä oikeudellinen käyvän arvon lausunto. Se ei käy läpi yhtiön sopimuksia, varmista ilmoitettuja tietoja tai anna suositusta tarjouksen hyväksymisestä. Kaupassa tarvitaan usein myös sopimus-, vero- ja rahoituskysymysten selvittäminen, jotka eivät sisälly tähän automaattisesti muodostettavaan raporttiin.",
            "Jos tarvitset asiantuntijapalvelua, pyydä siitä erillinen tarjous. Tarjouksen sisältöön voi vaikuttaa esimerkiksi työn tarkoitus ja käyttäjät, arvonmäärityksen kohde ja omistusosuus, konserni- tai yhtiörakenteen monimutkaisuus, aineiston laajuus ja laatu, tarvittavat haastattelut tai lisäselvitykset sekä raportoinnin laajuus ja aikataulu. Nämä ovat työn rajaukseen vaikuttavia tekijöitä, eivät hintalupauksia."
          ]
        },
        {
          "heading": "Katso esimerkki tai etsi yritys",
          "paragraphs": [
            "Voit tutustua raportin rakenteeseen maksutta [Heeros-esimerkkiraportissa](/samples/heeros-oyj.pdf), lukea ensin [miten yrityksen arvo määritetään](/blogi/miten-yrityksen-arvo-maaritetaan) tai [tarkistaa hinnan ja tilausvaihtoehdot](/#hinnoittelu). Kun tiedät, minkä yhtiön tietoja haluat tarkastella, [hae yritys ja tilaa raportti](/yritys)."
          ]
        },
        {
          "heading": "Lähteet ja rajaus",
          "paragraphs": [
            "ALV-kannan lähde on Verohallinnon [arvonlisäveroprosenttien ohje](https://vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/arvonlisaverotus/arvonlisaveroprosentit/). Arvonmäärityksen ja toteutuneen kauppahinnan eroista voi lukea International Valuation Standards Councilin [sanastosta](https://ivsc.org/standards-glossary/). Tuotteen hinta, toimitustapa ja raportin rajaus kuvaavat Valuatumin palvelua tämän artikkelin päiväyksen tilanteessa."
          ]
        }
      ]
    }
  ]
}

export const blogIndexIntro: string = data.indexIntro
export const blogPosts: BlogPost[] = data.posts
