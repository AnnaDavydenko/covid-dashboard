import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet';
import { makeStyles } from '@material-ui/core/styles';
import CasesCircle from './CasesCircle';
import Legend from './Legend';

const MapComponent = (props) => {
    const { center, zoom, countries, casesType, casesPerCondition } = props;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Map center={center} zoom={zoom} scrollWheelZoom>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CasesCircle
                    data={countries}
                    casesType={casesType}
                    casesPerCondition={casesPerCondition}
                />
                <Legend />
            </Map>
        </div>
    );
};

MapComponent.propTypes = {
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    countries: PropTypes.array.isRequired,
    casesType: PropTypes.string.isRequired,
    casesPerCondition: PropTypes.object.isRequired,
};

const useStyles = makeStyles({
    root: {
        height: '65vh',
        '& .leaflet-container': {
            height: '100%',
        },
        '& .legend': {
            background: '#ffffff73',
        },
        '& .circle': {
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            display: 'inline-block',
        },
    },
});

export default MapComponent;
