import { MapControl, withLeaflet } from 'react-leaflet';
import L from 'leaflet';
import { CASE_TYPE, CASES_COLORS } from '../../constants';

class Legend extends MapControl {
    constructor(props) {
        super(props);
        this.leafletElement = this.createLeafletElement(this.props);
    }

    createLeafletElement () {
        const legend = L.control({ position: 'bottomleft' });
        legend.onAdd = () => {
            const div = L.DomUtil.create('div', 'info legend');
            const labels = ['<strong>Categories</strong>'];
            const categories = [
                { label: CASE_TYPE.TOTAL_CASES, color: CASES_COLORS[CASE_TYPE.TOTAL_CASES].color },
                { label: CASE_TYPE.DEATHS, color: CASES_COLORS[CASE_TYPE.DEATHS].color },
                { label: CASE_TYPE.RECOVERED, color: CASES_COLORS[CASE_TYPE.RECOVERED].color },
            ];

            for (let i = 0; i < categories.length; i += 1) {
                div.innerHTML += labels.push(
                    `<i class="circle" style="background:${categories[i].color}"></i> ${
                        categories[i].label ? categories[i].label : '+'
                    }`
                );
            }
            div.innerHTML = labels.join('<br>');
            div.classList.add('legend');
            return div;
        };
        return legend;
    }

    updateLeafletElement(fromProps, toProps) {
        if (toProps.position !== fromProps.position) {
            this.leafletElement.setPosition(toProps.position);
        }
    }

    componentDidMount() {
        this.leafletElement.addTo(this.props.leaflet.map);
    }

    componentDidUpdate(prevProps) {
        this.updateLeafletElement(prevProps, this.props);
    }

    componentWillUnmount() {
        this.leafletElement.remove();
    }
}

export default withLeaflet(Legend);
