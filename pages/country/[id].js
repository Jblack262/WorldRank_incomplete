import Link from 'next/link';
import Head from "next/head";
import Layout from '../../components/Layout/Layout';
import styles from './CountryPage.module.css';

export default function Country({country, neighbors}) {

  const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });
  return (
		<Layout>
      <Head>
        <title>{country.name}</title>
      </Head>
      <div className={styles.countryContainer}>
        <div className={styles.countryCard}>
          <img src={country.flag} alt={`${country.name}'s flag`}/>
          <h1>{country.name}</h1>
          <p>{country.subregion}</p>
          <div className={styles.countryInfo}>
            <div>
              <p>{country.population.toLocaleString()}</p>
              <p>Population</p>
            </div>
            <div>
              {country.area ? <p>{country.area.toLocaleString()} km<sup>2</sup></p> : <p>N/A</p>}
              <p>Area</p>
            </div>
          </div>
        </div>
        <div className={styles.detailsCard}>
          <div className={styles.detail}>
            <p>Capital</p>
            <p>{country.capital}</p>
          </div>
          <div className={styles.detail}>
            <p>Languages</p>
            <p>{formatter.format(country.languages.map(language => language.name))}</p>
          </div>
          <div className={styles.detail}>
            <p>Currencies</p>
            <p>{formatter.format(country.currencies.map(currency => currency.name))}</p>
          </div>
          <div className={styles.detail}>
            <p>Native Name</p>
            <p>{country.nativeName}</p>
          </div>
          <div className={styles.detail}>
            <p>Gini</p>
            <p>{country.gini ? `${country.gini} %` : 'N/A'}</p>
          </div>

          <div className={styles.borderedCountries}>
            <p>Neighboring Countries</p>
            <div className={styles.countryFlags}>
              {neighbors.map((country, index) => {
                return (
                  <Link
                    href={`/country/${country.alpha3Code}`}
                    key={index}
                  >
                    <div className={styles.neighborCountry}>
                      <img src={country.flag} alt={country.name} />
                      <p>{country.name}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
		</Layout>
  )
}

export const getServerSideProps = async ({params}) => {
  const req = await fetch(`https://restcountries.com/v2/alpha/${params.id}`);
  const country = await req.json();
  const borders = country.borders || [];

  const neighbors = await Promise.all(borders.map(async border => { return (await (await fetch(`https://restcountries.com/v2/alpha?codes=${border}`)).json())[0] }));

  return {
    props: {country: country, neighbors},
  }
}