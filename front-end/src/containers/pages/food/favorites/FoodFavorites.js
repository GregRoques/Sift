import React, { Component } from 'react';
import axios from 'axios';
import { connect } from "react-redux";
import {Link, Redirect} from 'react-router-dom';

import AddForm from '../../../Forms/AddForm';
import PlaceCards from '../../../../components/Lists/PlaceCards/PlaceCards'
import Button from '../../../../components/utility/button/Button'
import Filter from '../../../../components/utility/filterDropDown/Filter';
import '../../favorites.css'

class FoodFavorites extends Component {
        constructor() {
            super()
            this.state = {
                list: [],
                types: ['Restaurant','Cafe', 'Bar', 'Diner'],
                msg: "",
                showAlert: false,
            }
        }
    
        componentDidMount() {
            axios({
                method: 'POST',
                url: `${window.apiHost}/food/getFoodFaveList`,
                data: {
                    email: this.props.login.email
                }
            }).then((foodListFromDB) => {
                    this.setState({
                        list: foodListFromDB
                    })
                })
        }
    
        addNewPlace = (place, type, text) => {
            //api call will go here with autocomplete to add name, location to DB
            axios({
                method: 'POST',
                url: `${window.apiHost}/food/addFaveInFavorites`,
                data: {
                    placename: place,
                    type: type,
                    note: text,
                    email: this.props.login.email
                }
            }).then((backEndResponse) => {
                this.setState({
                    list: backEndResponse
                })
            })
        }
    
        removePlace = (placename) => {
            axios({
                method: "POST",
                url: `${window.apiHost}/food/deleteFavePlace/${placename}`,
                data: {
                    email: this.props.login.email
                }
            }).then((backEndResponse) => {
                this.setState({
                    list: backEndResponse
                })
            })
        }

        filterResults = (filter) => {
            axios({
                method: 'POST',
                url: `${window.apiHost}/food/faveFilter/${filter}`,
                data: {
                    type: filter,
                    email: this.props.login.email
                }
            }).then((backEndResponse) => {
                this.setState({
                    list: backEndResponse
                })
            })
        }

        clearFilter = () => {
            axios({
                method: 'POST',
                url: `${window.apiHost}/food/getFoodFaveList`,
                data: {
                    email: this.props.login.email
                }
            }).then((foodListFromDB) => {
                this.setState({
                    list: foodListFromDB
                })
            })
        }
       
        render() {
            let category = "food";
            let section = "favorites";
            if (this.state.list.data !== undefined) {
                var favorites = this.state.list.data.map((food, i) => {
                    return (
                        <div key={i} className="placeCard">
                            <div className="cardLeft">
                                <h4>{food.placename}</h4>
                                <p>{food.note}</p>
                            </div>
                            <div className="buttonContainer">
                                <Button className="reviewButton"><Link to={"/userHome/"+ category + "/reviews/" + section + "/" + food.placename} >Review</Link></Button>
                                <Button className="editButton"><Link to={"/userHome/"+ category + "/edit/" + section + "/" + food.placename} >Edit</Link></Button>
                                <Button clicked={() => this.removePlace(food.placename)} className="deleteButton">Remove</Button>
                            </div> 
                        </div>
                    )
                })
            }

            const typeArray = this.state.types.map((type, i) => {
                return (<option key={i} value={type}>{type}</option>)
            })
            const filterArray = this.state.types.map((filter, i)=>{
                return(<option key={i} value={filter}>{filter}</option>)
            })

            if(this.props.login.length === 0){
                return(
                <Redirect to="/login"/>
                )
            } else {
                return (
                    <div className="Favorites">
                        <h2>Favorites</h2>
                        <div className="faveBody">
                            <div className="faveLeft">
                                <AddForm
                                    addNewPlace={this.addNewPlace}
                                    placeholder="Add new..."
                                    textType="Add note..."
                                    defaultType="Restaurant"
                                    types={typeArray}
                                />
                            </div>
                            <div className="faveRight">
                                <Filter 
                                    defaultFilter="Filter by type"
                                    filters={filterArray}
                                    filterResults={this.filterResults}
                                    clearFilter={this.clearFilter}
                                />
                                <PlaceCards cards={favorites}/>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
    
    function mapStateToProps(state) {
        return {
            login: state.login
        }
    }
    
    export default connect(mapStateToProps, null)(FoodFavorites);