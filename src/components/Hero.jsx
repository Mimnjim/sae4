const Hero = ({ title1, title2, subtitle }) => {
    return (
        <div className="hero-section">
            <div className="container-slogan">
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
    );
};

export default Hero;