import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logoGH from '../assets/icons/GitHub-logo.svg'; // Tell Webpack this JS file uses this image
import logoRS from '../assets/icons/rs_school_js.svg';

const Footer = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.author}>
                <span className={classes.created}>Created by</span>
                <a
                    className={classes.linkGithub}
                    target="_blank"
                    href="https://github.com/AnnaDavydenko"
                >
                    <span> Anna Davydenko </span>
                </a>
                <a
                    className={classes.linkGithub}
                    target="_blank"
                    href="https://github.com/AnnaDavydenko"
                >
                    <img src={logoGH} alt="github logo" />
                </a>
            </div>
            <span className={classes.year}>2020</span>
            <a className={classes.linkSchool} target="_blank" href="https://rs.school/js/">
                <img src={logoRS} alt="rs school logo" />
            </a>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        backgroundColor: '#012110d9',
        position: 'relative',
        bottom: 0,
        padding: '0 10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    author: {
        display: 'flex',
        alignItems: 'center',
    },
    linkGithub: {
        color: '#ffe88d',
        textDecoration: 'none',
        alignItems: 'center',
        marginRight: '5px',
        '& img': {
            width: '25px',
            height: '25px',
        },
    },
    linkSchool: {
        '& img': {
            width: '35px',
            height: '40px',
        },
    },
    year: {
        color: '#fc0',
    },
    created: {
        color: '#fc0',
        marginRight: '10px',
    },
});

export default Footer;
