import bg from '../assets/bg_home.JPG';
//import '../App.css';

function HomePage() {
  return (<div style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh'
  }}>
    </div>
    );
}

export default HomePage;
