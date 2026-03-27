import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet avec Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const Map = () => {
  // Position GPS du lieu
  const positionLat = 51.505;
  const positionLng = -0.09;
  const position = [positionLat, positionLng];

  // Style de la carte
  const mapHeight = '400px';
  const mapWidth = '100%';

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: mapHeight, width: mapWidth }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Lieu de l'exposition "Au-delà de l'humain".<br /> Venez nous rendre visite !
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
