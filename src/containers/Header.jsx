import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme, withStyles } from '@material-ui/core/styles';
import TabContext from '@material-ui/lab/TabContext/TabContext';
import AppBar from '@material-ui/core/AppBar/AppBar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { ThemeProvider } from '@material-ui/styles';
import { CASE_TYPE } from '../constants';

const theme = createMuiTheme({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: '#012110d9',
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#fc0',
        },
    },
});

const ColoredCheckbox = withStyles({
    root: {
        color: '#fc0',
        '&$checked': {
            color: '#fc0',
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

const Header = (props) => {
    const { onTabChange, onCasesChange, casesType } = props;

    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);
    const [casesPerDay, setCasesPerDay] = useState(false);
    const [casesPerHundred, setCasesPerHundred] = useState(false);
    let tabLabel = '';
    if (casesType === CASE_TYPE.TOTAL_CASES) {
        tabLabel = 'Cases';
    } else if (casesType === CASE_TYPE.DEATHS) {
        tabLabel = 'Deaths';
    } else {
        tabLabel = 'Recovered';
    }
    const tabs = [
        { label: 'Total Cases', tabIndex: 0, caseType: CASE_TYPE.TOTAL_CASES },
        { label: 'Total Deaths', tabIndex: 1, caseType: CASE_TYPE.DEATHS },
        { label: 'Total Recovered', tabIndex: 2, caseType: CASE_TYPE.RECOVERED },
    ];

    const handleChange = useCallback((event, newValue) => {
        setTabValue(newValue);
        onTabChange(tabs[newValue].caseType);
    }, []);

    const handlePerDayChange = useCallback(() => {
        const updatedVal = !casesPerDay;
        setCasesPerDay(updatedVal);
        onCasesChange({
            casesPerDay: updatedVal,
            casesPerHundred,
        });
    }, [casesPerDay, casesPerHundred]);

    const handlePerHundredChange = useCallback(() => {
        const updatedVal = !casesPerHundred;
        setCasesPerHundred(updatedVal);
        onCasesChange({
            casesPerDay,
            casesPerHundred: updatedVal,
        });
    }, [casesPerDay, casesPerHundred]);

    return (
        <div className={classes.root}>
            <ThemeProvider theme={theme}>
                <TabContext value={`${tabValue}`}>
                    <AppBar position="static" className={classes.tabContainer}>
                        <Tabs
                            value={tabValue}
                            centered
                            indicatorColor="secondary"
                            className={classes.tabs}
                            onChange={handleChange}
                            aria-label="simple tabs example"
                        >
                            {tabs.map((tab) => (
                                <Tab key={tab.caseType} label={tab.label} />
                            ))}
                        </Tabs>
                    </AppBar>
                </TabContext>
            </ThemeProvider>
            <div className={classes.subHeader}>
                <FormGroup row>
                    <Grid container justify="space-between">
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <ColoredCheckbox
                                        checked={casesPerDay}
                                        onChange={handlePerDayChange}
                                    />
                                }
                                label={`${tabLabel} per day`}
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control={
                                    <ColoredCheckbox
                                        checked={casesPerHundred}
                                        onChange={handlePerHundredChange}
                                    />
                                }
                                label={`${tabLabel} per hundred`}
                                labelPlacement="start"
                            />
                        </Grid>
                    </Grid>
                </FormGroup>
            </div>
        </div>
    );
};

Header.propTypes = {
    casesType: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    onCasesChange: PropTypes.func.isRequired,
};

const useStyles = makeStyles({
    root: {},
    tabContainer: {
        // background: "#084624d9",
        // height: "40px",
    },
    subHeader: {
        background: '#084624d9',
        color: '#ffffff',
        padding: '0 10px',
        height: '38px',
    },
});

export default Header;
