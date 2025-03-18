import { Container, Stack } from 'react-bootstrap';
import bg from '../assets/bg_home.JPG';
//import '../App.css';

function HomePage() {
    return (
        <Container fluid className='bg'>
            <div className='welcome-box'>
                <h1>Welcome to the Begonia Database</h1>
                <p>"Welcome to the begonia hybridization database. Here you can track all existing hybrids resulting from registered species and their hybridization events, as well as track traits for species and hybrids. Select a page from the navigation bar to view all existing entries and add new ones."</p>
            </div>
        </Container>
    )
}

export default HomePage;
