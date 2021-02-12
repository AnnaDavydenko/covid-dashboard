import React  from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import Grid from '@material-ui/core/Grid';

const TableHeader = (props) => {
    const { countries = [], selectedCountry = null, onChangeSort, handleChangeCountry } = props;
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item xs={10}>
                <Autocomplete
                    value={selectedCountry}
                    options={countries}
                    getOptionLabel={(option) => option.country}
                    onChange={handleChangeCountry}
                    renderInput={(params) => (
                        <TextField {...params} placeholder="Country" margin="normal" />
                    )}
                />
            </Grid>
            <Grid item xs={2}>
                <SwapVertIcon className={classes.sort} onClick={onChangeSort} />
            </Grid>
        </Grid>
    );
};

TableHeader.propTypes = {
    countries: PropTypes.array.isRequired,
    selectedCountry: PropTypes.object,
    onChangeSort: PropTypes.func.isRequired,
    handleChangeCountry: PropTypes.func.isRequired,
};

TableHeader.defaultProps = {
    selectedCountry: null,
};

const useStyles = makeStyles({
    root: {
        '& .MuiFormControl-marginNormal': {
            marginTop: 0,
        },
    },
    sort: {
        padding: '8px',
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
});

export default TableHeader;
