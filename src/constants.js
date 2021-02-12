export const CASE_TYPE = {
    TOTAL_CASES: 'cases',
    DEATHS: 'deaths',
    RECOVERED: 'recovered',
};

export const CASES_COLORS = {
    [CASE_TYPE.TOTAL_CASES]: { color: 'blue', borderColor: 'blue' },
    [CASE_TYPE.DEATHS]: { color: 'red', borderColor: 'red' },
    [CASE_TYPE.RECOVERED]: { color: 'green', borderColor: 'green' },
};

export const ZOOM_TYPE = {
    MAP: 'map',
    TABLE: 'table',
    CHART: 'chart',
};
