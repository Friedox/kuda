import '../../styles/mobile/style.css';
import divided_line from "../../assets/icon/divided_line.svg";
import bag from "../../assets/icon/bag.svg";
import child from "../../assets/icon/child.svg";
import people2 from "../../assets/icon/2people.svg";
import smoke from "../../assets/icon/smoke.svg";
import pet from "../../assets/icon/pet.svg";
import arrow from "../../assets/icon/arrow.svg";
import Header from "../../components/mobile/Header";
import Driver from "../../components/mobile/Driver";
import driver_photo1 from "../../assets/driver_photo1.svg";
import Car from "../../components/mobile/Car";
import profile_example from '../../assets/profile_example.png';
import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TripCard() {
    const { tripId } = useParams();
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        async function fetchTripDetails() {
            try {
                const response = await axios.get(`https://kuda-trip.ru/fellow_travel_cards/api/v1/trips/${tripId}`);
                if (response.data.status === 'ok') {
                    setTripDetails(response.data.detail);
                }
            } catch (error) {
                console.error('Error fetching trip details:', error);
            }
        }
        fetchTripDetails();
    }, [tripId]);

    if (!tripDetails) {
        return <div>Loading...</div>;
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            <div className="gray_bg" />
            <section className="mobile_section">
                <Header header_text="Details of the trip"/>
                <a href="#" className="trip_card_full">
                    <div className="trip_card_section">
                        <div className="trip_time_section">
                            <span className="trip_time">{formatTimestamp(tripDetails.start_timestamp)}</span>
                            <div className="trip_time_line">
                                <img src={divided_line} />
                                <div className="travel_time">
                                    <span>1 h</span>
                                </div>
                            </div>
                            <span className="trip_time">{tripDetails.end_timestamp ? formatTimestamp(tripDetails.end_timestamp) : 'N/A'}</span>
                        </div>
                    </div>
                    <div className="trip_card_section">
                        <div className="trip_location_section">
                            <div className="trip_location">
                                <span className="city_header gray_color">{tripDetails.pickup.address.city}</span>
                                <span className="address_span gray_color">{tripDetails.pickup.address.road} {tripDetails.pickup.address.house_number}</span>
                            </div>
                            <div className="trip_location right_align">
                                <span className="city_header gray_color">{tripDetails.dropoff.address.city}</span>
                                <span className="address_span gray_color">{tripDetails.dropoff.address.road} {tripDetails.dropoff.address.house_number}</span>
                            </div>
                        </div>
                    </div>
                    <div className="trip_card_section trip_mini_info">
                        <span className="available_seats">{tripDetails.available_sits} places</span>
                        <div className="filters">
                            {tripDetails.tags.includes('bag') && <img src={bag} alt="Bag" />}
                            {tripDetails.tags.includes('child') && <img src={child} alt="Child" />}
                            {tripDetails.tags.includes('people2') && <img src={people2} alt="People2" />}
                            {tripDetails.tags.includes('smoke') && <img src={smoke} alt="Smoke" />}
                            {tripDetails.tags.includes('pet') && <img src={pet} alt="Pet" />}
                        </div>
                    </div>
                </a>
                <div className="map_section">
                    <div className="map_header">
                        <h2>View on the map</h2>
                        <button className="map_arrow">
                            <img src={arrow}/>
                        </button>
                    </div>
                    <div className="map"> ТУТ КАРТА БУДЕТ </div>
                </div>
                <div className="driver_card">
                    <h2>Driver</h2>
                    <Driver
                        profile_photo={driver_photo1}
                        driver_name="Dmitry Zvidrin"
                        grade="4.9"
                        trips="120"
                    />
                </div>
                <div className="car_card">
                    <Car car_name={tripDetails.car_type}
                         car_color="Black"
                         number={tripDetails.car_number}
                         region="116"
                    />
                </div>

                <div className="passengers">
                    <h2>Passengers</h2>
                    <Driver profile_photo={profile_example}
                            driver_name="Andrey"
                            trips="120"
                            grade="4.9"
                    ></Driver>
                    <Driver profile_photo={profile_example}
                            driver_name="Andrey"
                            trips="120"
                            grade="4.9"
                    ></Driver>
                </div>

                <button className="order_btn">
                    <div className="order_price">
                        <h2>{tripDetails.fare ? `${tripDetails.fare}₽` : 'FREE'}</h2>
                        <span>per person</span>
                    </div>
                    <div className="btn_separator"/>
                    <h2>Book</h2>
                </button>
            </section>
        </>
    );
}

export default TripCard;
