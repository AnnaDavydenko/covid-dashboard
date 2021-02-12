import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Typography from '@material-ui/core/Typography';
import numeral from 'numeral';
import { CASES_COLORS, ZOOM_TYPE } from '../constants';
import { getCovidHistory } from '../services/api';
import Chart from '../components/Chart';

const ChartContainer = (props) => {
    const { casesType, casesPerCondition, onUpdateZoomType } = props;
    const { fullHeight, tabletView, selectedCountry, countries = [] } = props;

    const [chartData, setChartData] = useState([]);
    const [zoomToggled, setZoomToggled] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const classes = useStyles({ tabletView });

    const population = useMemo(
        () =>
            selectedCountry?.population
                ? selectedCountry.population
                : countries.reduce((sum, countryItem) => sum + countryItem.population, 0),
        [countries, selectedCountry]
    );

    useEffect(() => {
        const fetchCovidHistory = async () => {
            const timeInterval = casesPerCondition.casesPerDay ? 3 : 120;
            const data = await getChartData({
                timeInterval,
                casesType,
                selectedCountry: selectedCountry?.country,
                casesPerCondition,
                population,
            });
            setChartData(data);
        };
        fetchCovidHistory();
    }, [casesType, casesPerCondition, selectedCountry]);

    const onChangeZoom = useCallback(() => {
        const isZoomToggled = !zoomToggled;
        setZoomToggled(isZoomToggled);
        onUpdateZoomType(null);
        setIsUpdating(true);
        setTimeout(() => {
            if (isZoomToggled) {
                onUpdateZoomType(ZOOM_TYPE.CHART);
            } else {
                onUpdateZoomType(null);
            }
            setIsUpdating(false);
        });
    }, [zoomToggled]);

    return (
        <div className={classes.chartContainer}>
            <Card className={classes.card} variant="outlined">
                <CardContent>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <Typography
                                className={classes.title}
                                gutterBottom
                                variant="h6"
                                component="h3"
                            >
                                Worldwide {casesType}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ZoomOutMapIcon className={classes.zoom} onClick={onChangeZoom} />
                        </Grid>
                    </Grid>
                    {!isUpdating && (
                        <Chart
                            data={chartData}
                            backgroundColor={CASES_COLORS[casesType].color}
                            borderColor={CASES_COLORS[casesType].borderColor}
                            casesPerCondition={casesPerCondition}
                            fullHeight={fullHeight}
                            tabletView={tabletView}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

ChartContainer.propTypes = {
    casesType: PropTypes.string.isRequired,
    casesPerCondition: PropTypes.object.isRequired,
    onUpdateZoomType: PropTypes.func.isRequired,
    fullHeight: PropTypes.bool.isRequired,
    tabletView: PropTypes.bool.isRequired,
    selectedCountry: PropTypes.object,
    countries: PropTypes.array.isRequired,
};

ChartContainer.defaultProps = {
    selectedCountry: null,
};

// time interval in days
const getChartData = async (options) => {
    const {
        timeInterval,
        casesType,
        selectedCountry = 'all',
        casesPerCondition,
        population,
    } = options;
    let response = await getCovidHistory(selectedCountry, timeInterval);
    if (response.timeline) {
        response = response.timeline;
    }
    return buildChartData(response, casesType, casesPerCondition.casesPerHundred, population);
};

const buildChartData = (data, casesType, perHundred, population = 1) => {
    const chartData = [];
    let lastDataPoint;
    Object.keys(data[casesType]).forEach((date) => {
        if (lastDataPoint) {
            const y = data[casesType][date] - lastDataPoint;
            const newDataPoint = {
                x: date,
                y: perHundred ? numeral((y / population) * 100000).format('0,0') : y,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    });
    return chartData;
};

const useStyles = makeStyles({
    chartContainer: ({ tabletView }) => ({
        margin: '5px',
        '& .MuiCardContent-root:last-child': {
            padding: tabletView ? '16px' : '10px',
        },
    }),
    card: {
        backgroundColor: '#fff7d6',
    },
    title: {},
    zoom: {
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
});

export default ChartContainer;
