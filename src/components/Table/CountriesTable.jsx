import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import { CASE_TYPE } from '../../constants';

export const getCasesInfo = (country, casesType, casesPerCondition) => {
    let result = 0;
    const { casesPerDay, casesPerHundred } = casesPerCondition;
    const { TOTAL_CASES, DEATHS, RECOVERED } = CASE_TYPE;

    if (casesType === TOTAL_CASES) {
        if (casesPerDay && casesPerHundred) {
            result = numeral((country.todayCases / country.population) * 100000).format('0,0');
        } else if (!casesPerDay && casesPerHundred) {
            result = numeral((country.cases / country.population) * 100000).format('0,0');
        } else if (casesPerDay && !casesPerHundred) {
            result = country.todayCases;
        } else {
            result = country.cases;
        }
    }
    if (casesType === DEATHS) {
        if (casesPerDay && casesPerHundred) {
            result = numeral((country.todayDeaths / country.population) * 100000).format('0,0');
        } else if (!casesPerDay && casesPerHundred) {
            result = numeral((country.deaths / country.population) * 100000).format('0,0');
        } else if (casesPerDay && !casesPerHundred) {
            result = country.todayDeaths;
        } else {
            result = country.deaths;
        }
    }
    if (casesType === RECOVERED) {
        if (casesPerDay && casesPerHundred) {
            result = numeral((country.todayRecovered / country.population) * 100000).format('0,0');
        } else if (!casesPerDay && casesPerHundred) {
            result = numeral((country.recovered / country.population) * 100000).format('0,0');
        } else if (casesPerDay && !casesPerHundred) {
            result = country.todayRecovered;
        } else {
            result = country.recovered;
        }
    }

    return result;
};

const CountriesTable = (props) => {
    const { countries, casesType, casesPerCondition } = props;
    const { selectedCountry, handleChangeCountry, fullHeight, tabletView } = props;
    const classes = useStyles({ fullHeight, tabletView });

    const handleChangeCountryList = useCallback(
        (country) => (e) => {
            handleChangeCountry(e, country);
        },
        [handleChangeCountry]
    );

    const iterable = selectedCountry ? [selectedCountry] : countries;
    const displayCountries = (iterable || []).map((countryItem) => {
        const statistics = getCasesInfo(countryItem, casesType, casesPerCondition);
        return {...countryItem, statistics};
    });

    return (
        <List className={fullHeight ? classes.rootFullHeight : classes.root}>
            {displayCountries.map((countryItem) => (
                <ListItem
                    button
                    key={`${countryItem.country}`}
                    onClick={handleChangeCountryList(countryItem)}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <img
                                src={countryItem.countryInfo.flag}
                                className="flag"
                                alt="flag"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <ListItemText primary={countryItem.country} />
                        </Grid>
                        <Grid item xs={4}>
                            <ListItemText primary={countryItem.statistics} />
                        </Grid>
                    </Grid>
                </ListItem>
            ))}
        </List>
    );
};

CountriesTable.propTypes = {
    countries: PropTypes.array.isRequired,
    casesType: PropTypes.string.isRequired,
    casesPerCondition: PropTypes.object.isRequired,
    selectedCountry: PropTypes.object,
    handleChangeCountry: PropTypes.func.isRequired,
    fullHeight: PropTypes.bool.isRequired,
    tabletView: PropTypes.bool.isRequired,
};

CountriesTable.defaultProps = {
    selectedCountry: null,
};

const useStyles = makeStyles({
    root: ({ tabletView }) => ({
        height: tabletView ? '76vh' : '33vh',
        overflowY: 'scroll',
        '& .MuiTypography-body1': {
            fontSize: '14px',
        },
        '& .flag': {
            width: tabletView ? '27%' : '80%',
            height: tabletView ? '23px' : '25px',
        },
    }),
    rootFullHeight: ({ tabletView }) => ({
        height: '57vh',
        overflowY: 'scroll',
        '& .MuiTypography-body1': {
            fontSize: '14px',
        },
        '& .flag': {
            width: tabletView ? '30%' : '15%',
            height: '31px',
        },
    }),
});

export default CountriesTable;
