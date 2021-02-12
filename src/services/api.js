const BASE_URL = 'https://disease.sh/v3/covid-19';

const getCountries = async () => {
    try {
        const response = await fetch(`${BASE_URL}/countries`);
        return await response.json();
    } catch (err) {
        return [];
    }
};

const getCovidHistory = async (country = 'all', days = 120) => {
    try {
        const response = await fetch(`${BASE_URL}/historical/${country}?lastdays=${days}`);
        return await response.json();
    } catch (err) {
        return [];
    }
};

const getCovidInfo = async () => {
    try {
        const response = await fetch(`${BASE_URL}/all`);
        return await response.json();
    } catch (err) {
        return [];
    }
};

export { getCountries, getCovidHistory, getCovidInfo };
