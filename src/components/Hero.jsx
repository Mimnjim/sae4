// const Hero = ({ title1, title2, subtitle }) => {
//     return (
//         <div className="hero-section">
//             <div className="akira">
//                 <h1 className="title">{title1}</h1>
//             </div>
//             <div className="container-hero">
//                 <div className="container-slogan">
//                     <div className="triangle"></div>

//                     <h1 className="slogan">{title1}</h1>
//                     <h1 className="slogan">{title2}</h1>

//                     <div className="under-slogan">
//                         <h2>{subtitle}</h2>
//                     </div>
//                 </div>
//                 <div className="scroll-down">
//                     <h3>Scroll pour en savoir plus</h3>
//                     <div className="arrow">
//                         <span className="arrow-down"></span>
//                     </div>
//                 </div>
//             </div>
//             <div className="gis">
//                 <h1 className="title">{title2}</h1>
//             </div>




            
//         </div>
//     );
// };

// export default Hero;

import Container3D from './Container3D';

const Hero = ({ title1, title2, subtitle }) => {
    return (
        <div className="hero-section">
            <div className="akira">
                <Container3D label={title1} />
            </div>
            <div className="container-hero">
                <div className="container-slogan">
                    <div className="triangle"></div>

                    <h1 className="slogan">{title1}</h1>
                    <h1 className="slogan">{title2}</h1>
                    
                    <div className="under-slogan">
                        <h2>{subtitle}</h2>
                    </div>
                </div>
                <div className="scroll-down">
                    <h3>Scroll pour en savoir plus</h3>
                    <div className="arrow">
                        <span className="arrow-down"></span>
                    </div>
                </div>
            </div>
            <div className="gis">
                <Container3D label={title2} />
            </div>
        </div>
    );
};

export default Hero;