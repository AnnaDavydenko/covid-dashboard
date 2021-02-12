import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';
import { makeStyles } from '@material-ui/core/styles';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label: (tooltipItem) => numeral(tooltipItem.value).format('+0,0'),
        },
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: (value) => numeral(value).format('0a'),
                },
            },
        ],
    },
};

const Chart = (props) => {
    const { data, backgroundColor, borderColor, fullHeight, tabletView } = props;

    const classes = useStyles({ fullHeight, tabletView });

    return (
        <div className={fullHeight ? classes.chartFullScreen : classes.chart}>
            {data?.length && (
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor,
                                borderColor,
                                data,
                            },
                        ],
                    }}
                    options={options}
                />
            )}
        </div>
    );
};

Chart.propTypes = {
    data: PropTypes.array.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    borderColor: PropTypes.string.isRequired,
    fullHeight: PropTypes.bool.isRequired,
    tabletView: PropTypes.bool.isRequired,
};

const useStyles = makeStyles(() => ({
    chart: {
        height: '100px',
    },
    chartFullScreen: ({ tabletView }) => ({
        height: '66vh',
        display: tabletView ? 'flex' : 'flex',
        alignItems: tabletView ? 'center' : 'center',
    }),
}));

export default Chart;
