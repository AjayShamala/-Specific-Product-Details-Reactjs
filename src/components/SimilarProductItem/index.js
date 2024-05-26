import './index.css'
const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails
  return (
    <li className="container">
      <img src={imageUrl} alt="product" className="image-1" />
      <h1 className="main-heading">{title}</h1>
      <p className="para">by {brand}</p>
      <div className="row-container">
        <p className="paras">RS {price}/-</p>
        <p className="pars">{rating}</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
          className="image-2"
        />
      </div>
    </li>
  )
}
export default SimilarProductItem
