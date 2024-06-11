import React from 'react';
import './Home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import recipeImage1 from '../../assets/Recipe-1.jpg';
import recipeImage2 from '../../assets/Recipe-2.jpg';
import recipeImage3 from '../../assets/Recipe-3.jpg';

function Home() {
  return (
    <main className='recipeHome'>
      <header>
        <h1>The Great Indian Kitchen</h1>
      </header>
      <section className="content">
        <Carousel 
          autoPlay 
          infiniteLoop 
          showThumbs={false} 
          showStatus={false} 
          className="recipeCarousel" 
          swipeable 
          showArrows 
          showIndicators
        >
          <div className="carouselItem">
            <img src={recipeImage1} alt="Indian Recipe 1" className="recipeImage" />
            <div className="carouselContent">
              <p>
                Indian cuisine consists of a variety of regional and traditional cuisines native to the Indian subcontinent. Given the diversity in soil, climate, culture, ethnic groups, and occupations, these cuisines vary substantially and use locally available spices, herbs, vegetables, and fruits.
              </p>
            </div>
          </div>
          <div className="carouselItem">
            <img src={recipeImage2} alt="Indian Recipe 2" className="recipeImage" />
            <div className="carouselContent">
              <p>
                Indian food is also heavily influenced by religion, in particular Hinduism and Islam, cultural choices and traditions.
              </p>
            </div>
          </div>
          <div className="carouselItem">
            <img src={recipeImage3} alt="Indian Recipe 3" className="recipeImage" />
            <div className="carouselContent">
              <p>
                Historical events such as invasions, trade relations, and colonialism have played a role in introducing certain foods to this country. The Columbian discovery of the New World brought a number of new vegetables and fruits to India. A number of these such as potatoes, tomatoes, chillies, peanuts, and guava have become staples in many regions of India.
              </p>
            </div>
          </div>
        </Carousel>
      </section>
    </main>
  );
}

export default Home;
