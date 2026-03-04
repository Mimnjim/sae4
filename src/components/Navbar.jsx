// export default function Navbar() {
//      return <div className="navbar">
//         <div className="elements-nav">
//             <a href="#">Réserver</a>
//             <a href="#">Expériences</a>
//             <a href="#">Infos pratiques</a>
//         </div>
        
//         <div className="language">
//             <a href="#">FR</a> /
//             <a href="#">EN</a>
//         </div>
//      </div>
// }

import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="navbar">
      <div className="elements-nav">
        {/* <Link to="/">Accueil</Link> */}
        {/* <Link to="/experiences">Expériences</Link> */}
        <Link to="/experiences">Expériences</Link>
        <Link to="#">Infos pratiques</Link>
      </div>
      
      <div className="language">
        <a href="#">FR</a> / <a href="#">EN</a>
      </div>
    </div>
  );
}