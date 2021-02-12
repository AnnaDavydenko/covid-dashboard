import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
import { makeStyles } from '@material-ui/core/styles';
import { CASE_TYPE, CASES_COLORS } from '../../constants';
import { getCasesInfo } from '../Table/CountriesTable';

// static styles that can not be used as classes. usually passed as params to some external components(libs)
const caseTypeColours = {
    cases: {
        hex: CASES_COLORS[CASE_TYPE.TOTAL_CASES].color,
        multiplier: 800,
    },
    recovered: {
        hex: CASES_COLORS[CASE_TYPE.RECOVERED].color,
        multiplier: 1200,
    },
    deaths: {
        hex: CASES_COLORS[CASE_TYPE.DEATHS].color,
        multiplier: 2000,
    },
};

const CasesCircle = (props) => {
    const { data, casesType, casesPerCondition } = props;

    const classes = useStyles();

    let statLabel = '';
    if (casesType === CASE_TYPE.TOTAL_CASES) {
        statLabel = 'Cases';
    } else if (casesType === CASE_TYPE.DEATHS) {
        statLabel = 'Deaths';
    } else {
        statLabel = 'Recovered';
    }

    return (
        <>
            {data.map((country) => (
                <Circle
                    key={`${country.country}`}
                    center={[country.countryInfo.lat, country.countryInfo.long]}
                    fillOpacity={0.4}
                    color={caseTypeColours[casesType].hex}
                    fillColor={caseTypeColours[casesType].hex}
                    radius={Math.sqrt(country[casesType]) * caseTypeColours[casesType].multiplier}
                >
                    <Popup>
                        <div className={classes.infoContainer}>
                            <div
                                className={classes.flag}
                                style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                            />
                            <div className={classes.name}>{country.country}</div>
                            <div className={classes.stats}>
                                {statLabel}:{' '}
                                {numeral(
                                    getCasesInfo(country, casesType, casesPerCondition)
                                ).format('0,0')}
                            </div>
                        </div>
                    </Popup>
                </Circle>
            ))}
        </>
    );
};

CasesCircle.propTypes = {
    data: PropTypes.array.isRequired,
    casesType: PropTypes.string.isRequired,
    casesPerCondition: PropTypes.object.isRequired,
};

const useStyles = makeStyles({
    infoContainer: {
        width: '150px',
    },
    flag: {
        height: '80px',
        width: '100%',
        backgroundSize: 'cover',
        borderRadius: '8px',
        // used for img tag inside element with class flag
        '& img': {
            width: '100px',
            borderRadius: '5px',
        },
    },
    name: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#555',
    },
    stats: {
        fontSize: '16px',
        marginTop: '5px',
    },
});

export default CasesCircle;
