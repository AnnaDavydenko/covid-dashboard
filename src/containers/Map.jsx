import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Grid from '@material-ui/core/Grid';
import MapComponent from '../components/Map/Map';
import { ZOOM_TYPE } from '../constants';

const MapContainer = (props) => {
    const { center, zoom, countries, casesType, casesPerCondition, onUpdateZoomType } = props;

    const classes = useStyles();
    const [zoomToggled, setZoomToggled] = useState(false);

    const onChangeZoom = useCallback(() => {
        const isZoomToggled = !zoomToggled;
        setZoomToggled(isZoomToggled);
        if (isZoomToggled) {
            onUpdateZoomType(ZOOM_TYPE.MAP);
        } else {
            onUpdateZoomType(null);
        }
    }, [zoomToggled]);

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography gutterBottom variant="h5" component="h1" className={classes.h1}>
                            COVID-19 Dashboard
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ZoomOutMapIcon className={classes.zoom} onClick={onChangeZoom} />
                    </Grid>
                </Grid>
                <MapComponent
                    center={center}
                    zoom={zoom}
                    countries={countries}
                    casesType={casesType}
                    casesPerCondition={casesPerCondition}
                />
            </CardContent>
        </Card>
    );
};

MapContainer.propTypes = {
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    countries: PropTypes.array.isRequired,
    casesType: PropTypes.string.isRequired,
    casesPerCondition: PropTypes.object.isRequired,
    onUpdateZoomType: PropTypes.func.isRequired,
};

const useStyles = makeStyles({
    root: {
        margin: '5px 5px 5px 0',
        height: '75.5vh',
        backgroundColor: '#fff7d6',
    },
    zoom: {
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
});

export default MapContainer;
