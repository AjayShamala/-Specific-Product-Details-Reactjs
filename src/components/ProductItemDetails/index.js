import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'
const apiCallStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isprogress: 'ISPROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    similarProducts: [],
    productsList: {},
    quantity: 1,
    apiStatus: apiCallStatus.initial,
  }
  componentDidMount() {
    this.getSimilarProducts()
  }
  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    description: data.description,
    price: data.price,
  })
  getSimilarProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiCallStatus.isprogress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarData = fetchedData.similar_products.map(each =>
        this.getFormattedData(each)
      )
      this.setState({
        productsList: updatedData,
        similarProducts: updatedSimilarData,
        apiStatus: apiCallStatus.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiCallStatus.failure})
    }
  }
  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )
  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="image-4"
      />
      <h1 className="headers">Product Not Found </h1>
      <Link to="/products">
        <button className="button-container">Continue Shopping</button>
      </Link>
    </div>
  )
  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(previous => ({quantity: previous.quantity - 1}))
    }
  }
  onIncrementQuantity = () => {
    this.setState(previous => ({quantity: previous.quantity + 1}))
  }
  renderProductsDetailedView = () => {
    const {productsList, similarProducts, quantity} = this.state
    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      description,
      price,
    } = productsList
    return (
      <div className="bg-container">
        <div className="contains">
          <img src={imageUrl} alt="product" className="image-6" />
          <div>
            <h1 className="main-heads">{title}</h1>
            <p className="parass">RS {price}/-</p>
            <div className="rowaaa">
              <div className="rowssss">
                <p className="pars">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="stars"
                  className="image-1"
                />
              </div>
              <p className="parssss">{totalReviews} Reviews </p>
            </div>
            <p className="params">{description}</p>
            <p className="stock-container">
              Availiable :{' '}
              <span className="span-container">{availability}</span>
            </p>
            <p className="stock-container">
              Brand : <span className="span-container">{brand}</span>
            </p>
            <hr className="horizontal-container" />
            <div className="rows">
              <button
                onClick={this.onDecrementQuantity}
                className="buttons"
                data-testid="minus"
              >
                <BsDashSquare className="dash-container" />
              </button>
              <p className="parses">{quantity}</p>
              <button
                onClick={this.onIncrementQuantity}
                className="buttons"
                data-testid="plus"
              >
                <BsPlusSquare className="dash-container" />
              </button>
            </div>
            <button className="buttons-contain">ADD TO CART</button>
          </div>
        </div>
        <h1 className="main-heaing">Similar Products</h1>
        <ul className="unorder-list">
          {similarProducts.map(each => (
            <SimilarProductItem productDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }
  renderAllProductsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiCallStatus.success:
        return this.renderProductsDetailedView()
      case apiCallStatus.failure:
        return this.renderFailureView()
      case apiCallStatus.isprogress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  render() {
    return (
      <div className="cons">
        <Header />
        {this.renderAllProductsView()}
      </div>
    )
  }
}
export default ProductItemDetails
