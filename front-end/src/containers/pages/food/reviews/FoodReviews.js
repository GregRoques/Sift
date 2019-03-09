import React, { Component } from 'react';
import axios from "axios";
import AddReviewForm from '../../../Forms/AddReviewForm';
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
import { connect } from "react-redux";
import {Link} from "react-router-dom";
import "./FoodReviews.css";
import PlaceCards from '../../../../components/Lists/PlaceCards/PlaceCards';
import Button from "../../../../components/utility/button/Button";

class FoodReviews extends Component {
    constructor() {
        super()
        this.state = {
            list : [],
            msg : "",
            types : ['Restaurant', 'Cafe', 'Bar', 'Diner'],
            showAlert: false,
        }
    }

    componentDidMount(){
        axios({
            method : "POST",
            url : `${window.apiHost}/food/getFoodReviews`,
            data : {
                email : this.props.login.email
            }
        }).then((reviewListFromDB)=>{
            console.log(reviewListFromDB)
            this.setState(({
                list : reviewListFromDB
            }))
        })
    }

    // need to finish add review
    addReview = (place, review, type, stars) =>{
        axios({
            method : "POST",
            url : `${window.apiHost}/food/addFoodReview/${place}`,
            data : {
                email : this.props.login.email,
                place,
                review,
                type,
                stars
            }
        }).then((responseFromDB)=>{
            // console.log(responseFromDB)
            this.setState({
                list : responseFromDB,
                msg : `Congrats! You've added a review for ${place}!`,
                showAlert: true,
            })
        })
    }


    removeReview = (place)=>{
        axios({
            method : "POST",
            url: `${window.apiHost}/food/deleteFoodReview/${place}`,
            data :{
                email : this.props.login.email
            }
        }).then((backEndResponse)=>{
            this.setState({
                list : backEndResponse
            })
        })
    }

    render() {
        let category = "food";
        let section = "reviews";
        if (this.state.list.data !== undefined) {
            var foodReviews = this.state.list.data.map((review, i) => {
                return (
                    <div key={i} className="placeCard">
                        <div className="cardLeft">
                            <h4>{review.placename} - {review.stars} Stars</h4>
                            <p>{review.review}</p>
                        </div>
                        <div className="cardRight">
                            <div className="buttonContainer">
                                <Button className="shareButton">Share</Button>
                                <Button className="editButton"><Link to={"/userHome/"+ category + "/edit/" + section + "/" + review.placename} >Edit</Link></Button>
                                <Button clicked={() => this.removeReview(review.placename)} className="deleteButton">Remove</Button>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        const typeArray = this.state.types.map((type, i)=>{
            return (<option key={i} value={type}>{type}</option>)
        });

        return (
            <div className="FoodReviews">
                <h2>Reviews</h2>
                <SweetAlert
                    show={this.state.showAlert}
                    title="Review Added"
                    text={this.state.msg}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => this.setState({ showAlert: false })}
                />
                <div className="reviewBody">
                    <div className="reviewLeft">
                        <AddReviewForm
                            placeholder="Add your food review here!"
                            defaultType= "Choose type!"
                            defaultStars = "How many stars?"
                            types={typeArray}
                            addReview={this.addReview}
                        />
                    </div>
                    <div className="reviewRight">
                        <PlaceCards cards={foodReviews}/>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        login: state.login
    }
}

export default connect(mapStateToProps,null)(FoodReviews);