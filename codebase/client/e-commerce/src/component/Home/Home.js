import React, { Fragment } from "react";
import { CgMouse } from "react-icons/cg";
import './Home.css';
import Product from './product.js';

const product = {
    name : "Blue Tshirt",
    images :[{url : "https://thefoomer.in/cdn/shop/files/jpeg-optimizer_PATP5180.jpg?v=1685610639"}],
    price:"300",
    _id:"revati",

}

const Home = () => {
  return (
    <Fragment>
      <div className='banner'>
        <p>Welcome to ECommerce</p>
        <h1>FIND AMAZAING PRODUCTS BELOW</h1>
        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>

      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
       <Product product={product}/>
      

      </div>
    </Fragment>
  );
};

export default Home;
