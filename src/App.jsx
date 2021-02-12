import React, { useCallback, useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { CASE_TYPE, ZOOM_TYPE } from './constants';
import MapContainer from './containers/Map';
import { getCountries, getCovidInfo } from './services/api';
import { sortData, isTablet } from './services/util';
import 'leaflet/dist/leaflet.css';
import ChartContainer from './containers/Chart';
import CountriesTableContainer from './containers/CountriesTable';
import Header from './containers/Header';
import Footer from './containers/Footer';
import virus from './assets/images/tenor.gif';

const defaulMapPosition = {
    lat: 34.80746,
    lng: -40.4796,
    zoom: 3,
}

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [worldData, setWorldData] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCountries, setMapCountries] = useState([]);
    const [mapData] = useState(defaulMapPosition);
    const [casesType, setCasesType] = useState(CASE_TYPE.TOTAL_CASES);
    const [casesPerCondition, setCasesPerCondition] = useState({
        casesPerDay: false,
        casesPerHundred: false,
    });
    const [zoomType, setZoomType] = useState(null);
    const [tabletView, setTabletView] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState();

    const handleUpdateZoomType = useCallback((updatedZoomType) => setZoomType(updatedZoomType), []);

    useEffect(() => {
        const getCountriesList = async () => {
            const response = await getCountries();

            const countryList = response.map((country) => ({
                name: country.country,
                value: country.countryInfo.iso3,
            }));

            countryList.unshift({ name: 'Woldwide', value: 'worldWide' });

            const sortedData = sortData(response);
            setTableData(sortedData);
            setMapCountries(response);
            setIsLoading(false);
        };
        const getWorldData = async () => {
            const response = await getCovidInfo();
            setWorldData(response);
        };
        getCountriesList();
        getWorldData();
        handleWindowResize();
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
    }, [tableData]);

    const handleChangeCountry = useCallback(
        (event, newValue) => {
            const selectedCountryItem = newValue
                ? tableData.find(
                      (countryItem) => countryItem.countryInfo._id === newValue.countryInfo._id
                  )
                : null;
            setSelectedCountry(selectedCountryItem);
        },
        [tableData]
    );

    const handleWindowResize = useCallback(() => {
        setTabletView(isTablet(window.innerWidth));
    }, [tabletView]);

    const handleTabChange = useCallback((updatedCasesType) => {
        setCasesType(updatedCasesType);
    }, []);

    const handleCasesChange = useCallback((casesData) => {
        setCasesPerCondition({
            casesPerDay: casesData.casesPerDay,
            casesPerHundred: casesData.casesPerHundred,
        });
    }, []);

   const classes = useStyles();

    return (
        <>
            {!isLoading && (
                <div className={classes.root}>
                    <Header
                        onTabChange={handleTabChange}
                        onCasesChange={handleCasesChange}
                        casesType={casesType}
                    />
                    <Grid container direction={`${tabletView ? 'column-reverse' : 'row'}`}>
                        <Grid item xs={!tabletView && zoomType === null ? 3 : 12}>
                            {(zoomType === null || zoomType === ZOOM_TYPE.TABLE) && (
                                <Grid item>
                                    <CountriesTableContainer
                                        tabletView={tabletView}
                                        selectedCountry={selectedCountry}
                                        onChangeCountry={handleChangeCountry}
                                        onUpdateZoomType={handleUpdateZoomType}
                                        countries={tableData}
                                        worldData={worldData}
                                        casesType={casesType}
                                        casesPerCondition={casesPerCondition}
                                        fullHeight={zoomType === ZOOM_TYPE.TABLE}
                                    />
                                </Grid>
                            )}
                            {(zoomType === null || zoomType === ZOOM_TYPE.CHART) && (
                                <Grid item>
                                    <ChartContainer
                                        fullHeight={zoomType === ZOOM_TYPE.CHART}
                                        selectedCountry={selectedCountry}
                                        casesType={casesType}
                                        casesPerCondition={casesPerCondition}
                                        onUpdateZoomType={handleUpdateZoomType}
                                        tabletView={tabletView}
                                        countries={tableData}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        {(zoomType === null || zoomType === ZOOM_TYPE.MAP) && (
                            <Grid item xs={!tabletView && zoomType === null ? 9 : 12}>
                                <MapContainer
                                    onUpdateZoomType={handleUpdateZoomType}
                                    center={[mapData.lat, mapData.lng]}
                                    zoom={mapData.zoom}
                                    countries={mapCountries}
                                    casesType={casesType}
                                    casesPerCondition={casesPerCondition}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Footer />
                </div>
            )}
            {isLoading && (
                <div className={classes.loader}>
                    <img src={virus} alt="virus logo" className={classes.virus} />
                    <div className={classes.loading}>Loading...</div>
                </div>
            )}
        </>
    );
}

const useStyles = makeStyles({
    root: {
        background: '#000000',
    },
    loader: {
        height: '98vh',
        background: '#040204',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        color: '#73c22e',
        fontSize: '20px',
    },
    virus: {
        width: '20%',
    },
});

export default App;
