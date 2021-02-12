import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Grid from '@material-ui/core/Grid';
import CountriesTable, { getCasesInfo } from '../components/Table/CountriesTable';
import TableHeader from './TableHeader';
import { CASE_TYPE, ZOOM_TYPE } from '../constants';

const SORT_STATE = {
    DEFAULT: 0,
    ASC: 1,
    DESC: 2,
};

const getUpdatedSort = (sortState) => {
    let updatedSort = SORT_STATE.ASC;
    switch (sortState) {
        case SORT_STATE.DEFAULT:
            updatedSort = SORT_STATE.ASC;
            break;
        case SORT_STATE.ASC:
            updatedSort = SORT_STATE.DESC;
            break;
        case SORT_STATE.DESC:
            updatedSort = SORT_STATE.ASC;
            break;
        default:
            updatedSort = SORT_STATE.ASC;
            break;
    }
    return updatedSort;
};

const sortCountries = (countries, sortDirection, sortKey) => {
    if (sortDirection === SORT_STATE.ASC) {
        return countries.sort((a, b) =>
            a[sortKey] > b[sortKey] ? 1 : b[sortKey] > a[sortKey] ? -1 : 0
        );
    }
    return countries.sort((a, b) =>
        b[sortKey] > a[sortKey] ? 1 : a[sortKey] > b[sortKey] ? -1 : 0
    );
};

const CountriesTableContainer = (props) => {
    const {
        countries = [],
        casesType,
        casesPerCondition,
        onUpdateZoomType,
        fullHeight,
        tabletView,
        selectedCountry,
        onChangeCountry,
        worldData,
    } = props;
    const classes = useStyles({ tabletView, fullHeight });

    const [sortState, setSortState] = useState(SORT_STATE.DEFAULT);
    const [sortedCountries, setSortedCountries] = useState([]);
    const [zoomToggled, setZoomToggled] = useState(false);

    const handleChangeSort = useCallback(() => {
        // sort
        const updatedSort = getUpdatedSort(sortState);
        setSortState(updatedSort);
        const test = sortCountries(sortedCountries, sortState, CASE_TYPE.TOTAL_CASES);
        setSortedCountries(test);
    }, [sortedCountries, sortState]);

    useEffect(() => {
        setSortedCountries(countries);
    }, [countries]);

    const onChangeZoom = useCallback(() => {
        const isZoomToggled = !zoomToggled;
        setZoomToggled(isZoomToggled);
        if (isZoomToggled) {
            onUpdateZoomType(ZOOM_TYPE.TABLE);
        } else {
            onUpdateZoomType(null);
        }
    }, [zoomToggled, onUpdateZoomType]);
    const worldStats = casesPerCondition ?
      getCasesInfo(worldData, casesType, casesPerCondition) : worldData[casesType];
    return (
        <>
            <Card className={classes.countriesTableContainer} variant="outlined">
                <CardContent>
                    <Grid container className={classes.worldStats}>
                        <span className={classes.worldStatsTitle}>{`Total ${casesType}: `}</span>
                        <span> {worldStats} </span>
                    </Grid>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography gutterBottom variant="h6" component="h3">
                                Live cases by country
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ZoomOutMapIcon className={classes.zoom} onClick={onChangeZoom} />
                        </Grid>
                    </Grid>
                    <TableHeader
                        countries={countries}
                        selectedCountry={selectedCountry}
                        onChangeSort={handleChangeSort}
                        handleChangeCountry={onChangeCountry}
                    />
                    <CountriesTable
                        countries={sortedCountries}
                        tabletView={tabletView}
                        casesType={casesType}
                        casesPerCondition={casesPerCondition}
                        selectedCountry={selectedCountry}
                        handleChangeCountry={onChangeCountry}
                        fullHeight={fullHeight}
                    />
                </CardContent>
            </Card>
        </>
    );
};

CountriesTableContainer.propTypes = {
    casesType: PropTypes.string.isRequired,
    casesPerCondition: PropTypes.object.isRequired,
    onUpdateZoomType: PropTypes.func.isRequired,
    onChangeCountry: PropTypes.func.isRequired,
    fullHeight: PropTypes.bool.isRequired,
    tabletView: PropTypes.bool.isRequired,
    selectedCountry: PropTypes.object,
    countries: PropTypes.array.isRequired,
    worldData: PropTypes.array.isRequired,
};

CountriesTableContainer.defaultProps = {
    selectedCountry: null,
};


const useStyles = makeStyles({
    countriesTableContainer: ({ tabletView, fullHeight }) => ({
        margin: '5px',
        height: fullHeight ? '75vh' : '49vh',
        '& .MuiCardContent-root:last-child': {
            padding: tabletView ? '16px' : '10px',
        },
        '& .MuiTypography-gutterBottom': {
            marginBottom: '0px',
        },
        backgroundColor: '#fff7d6',
    }),
    zoom: {
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
    worldStats: {
        color: '#084624d9',
        fontWeight: 600,
    },
    worldStatsTitle: {
        marginRight: '5px',
        color: '#001c0d',
    }
});

export default CountriesTableContainer;
