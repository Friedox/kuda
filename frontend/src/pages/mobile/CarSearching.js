import React, { useEffect, useState, useRef } from 'react';
import map_point from "../../assets/icon/map_point.svg";
import user_location from "../../assets/icon/user_locatin.svg";
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import loadYandexMapScript from '../../utils/loadYandexMapScript';
import { format } from "date-fns";
import ProfileBlock from "../../components/mobile/ProfileBlock";
import profile_img from "../../assets/profile_example.png";
import InputMask from "react-input-mask";
import DatePicker from "react-datepicker";
import minus from "../../assets/icon/minus.svg";
import plus from "../../assets/icon/plus_no_circle.svg";
import arrow from "../../assets/icon/arrow_right.svg";

function CarSearching() {
    const [mapInitialized, setMapInitialized] = useState(false);
    const [lastGeocodeTime, setLastGeocodeTime] = useState(0);
    const [pointType, setPointType] = useState(false);
    const [startTripAddress, setStartTripAddressState] = useState('');
    const [endTripAddress, setEndTripAddressState] = useState('');
    const [startCoordinates, setStartCoordinates] = useState([0, 0]);
    const [endCoordinates, setEndCoordinates] = useState([0, 0]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const target = new URLSearchParams(location.search).get('target');
    const pointTypeRef = useRef(pointType);
    const [value, setValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');
    const [valueSeats, setValueSeats] = useState(1); // Начальное значение
    const [isFilterVisible, setIsFilterVisible] = useState(false); // Состояние для видимости фильтра
    const [isSeatsBlockVisible, setIsSeatsBlockVisible] = useState(false); // Состояние для видимости блока seats_number_block


    const [selectedType, setSelectedType] = useState(null);

    const handleTaxiSelect = (type) => {
        setSelectedType(type);
    };
    const handleDecrement = () => {
        setValueSeats((prevValue) => Math.max(prevValue - 1, 1)); // Уменьшаем значение, но не меньше 1
    };

    const handleIncrement = () => {
        setValueSeats((prevValue) => Math.min(prevValue + 1, 4)); // Увеличиваем значение, но не больше 4
    };

    const handleChangeSeats = (event) => {
        const newValue = Math.max(Math.min(Number(event.target.value), 4), 1); // Ограничиваем значение от 1 до 4
        setValueSeats(newValue);
    };

    const dataChange = (date) => {
        setSelectedDate(date);
        setFormattedDate(formatDate(date));
    };

    const formatDate = (date) => {
        if (!date) return '';
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            return `Today at ${format(date, 'HH:mm')}`;
        }
        return `${format(date, 'dd MMM')} at ${format(date, 'HH:mm')}`;
    };

    const CustomInput = ({ value, onClick }) => {
        value = formatDate(selectedDate);
        return (
            <input
                value={value}
                onClick={onClick}
                readOnly
                className="input"
                placeholder="Select time"
            />)
    };

    const handleChange = (e) => {
        let inputValue = e.target.value;

        // Удаляем пробелы
        inputValue = inputValue.replace(/\s/g, '');

        // Если ввод начинается без @, добавляем его автоматически
        if (!inputValue.startsWith('@')) {
            inputValue = `@${inputValue}`;
        }

        // Проверяем длину строки (не более 31 символа, включая @)
        if (/^@.{0,30}$/.test(inputValue)) {
            setValue(inputValue);
        }
    };

    useEffect(() => {
        pointTypeRef.current = pointType;
    }, [pointType]);

    useEffect(() => {
        let ymapsInstance;
        const initializeMap = (ymaps) => {
            ymapsInstance = ymaps;
            if (!mapInitialized && ymaps.ready) {
                ymaps.ready(() => {
                    if (!mapInitialized) {
                        const map = new ymaps.Map("map", {
                            center: [55.76, 37.64],
                            zoom: 10,
                            controls: []
                        });

                        const location = ymaps.geolocation;
                        location.get({ mapStateAutoApply: true }).then(
                            function (result) {
                                const userCoordinates = result.geoObjects.get(0).geometry.getCoordinates();
                                setStartCoordinates(userCoordinates);
                                map.setCenter(userCoordinates);

                                const userAddress = result.geoObjects.get(0).properties.get('text');
                                setStartTripAddressState(userAddress);

                                const marker = new ymaps.Placemark(userCoordinates, {}, {
                                    iconLayout: 'default#image',
                                    iconImageHref: user_location,
                                    iconImageSize: [40, 40],
                                    iconImageOffset: [-15, -42]
                                });
                                map.geoObjects.add(marker);
                            },
                            function (err) {
                                console.log('Ошибка: ' + err);
                            }
                        );

                        map.behaviors.enable('drag');
                        adjustMarkerSize();

                        window.addEventListener('resize', adjustMarkerSize);
                        map.events.add('boundschange', handleBoundsChange);

                        setMapInitialized(true);
                    }
                });
            }
        };

        const adjustMarkerSize = () => {
            const iconSizePercentage = 0.75;
            const iconWidth = window.innerWidth * iconSizePercentage;
            const iconHeight = window.innerHeight * iconSizePercentage;
            const marker = document.querySelector('.cursor-point');
            marker.style.width = `100%`;
            marker.style.height = `100vh`;
        };

        const handleBoundsChange = (event) => {
            const now = Date.now();
            if (now - lastGeocodeTime > 5000) {
                const center = event.get('newCenter');
                ymapsInstance.geocode(center).then(function (res) {
                    const firstGeoObject = res.geoObjects.get(0);
                    const address = firstGeoObject.getAddressLine();
                    const coordinates = firstGeoObject.geometry.getCoordinates();
                    if (!pointTypeRef.current) {
                        setStartTripAddressState(address);
                        setStartCoordinates(coordinates);
                    } else {
                        setEndTripAddressState(address);
                        setEndCoordinates(coordinates);
                    }
                    setLastGeocodeTime(now);
                });
            }
        };

        loadYandexMapScript()
            .then((ymaps) => {
                initializeMap(ymaps);
            })
            .catch((err) => {
                console.log(err);
            });


    }, [mapInitialized, lastGeocodeTime]);

    const handleClick = (newPointType) => {
        setPointType(newPointType);
    };

    const handlePassengerClick = (e) => {
        e.preventDefault();
        setIsSeatsBlockVisible(true);
    };

    const closeSeatsBlock = () => {
        setIsSeatsBlockVisible(false);
    };

    const handleCreateClick = async () => {
        console.log(123)
        const data = {
            pickup: {
                latitude: startCoordinates[0],
                longitude: startCoordinates[1]
            },
            dropoff: {
                latitude: endCoordinates[0],
                longitude: endCoordinates[1]
            },
            start_timestamp: selectedDate ? Math.floor(selectedDate.getTime() / 1000) : 0,
            end_timestamp: 0, // Здесь вы можете добавить логику для определения end_timestamp
            fare: valueSeats,
            tags: [] // Здесь вы можете добавить любые теги, которые вам нужны
        };


        // Cookies.set('session_id', '0f40d507963923c82b463462ec6c3ba4bcf6b2192ed2288d4e8bac1dc193b6ee', { expires: 7, path: '/' });

        async function post_trip() {
            const respose = await fetch('http://localhost:8000/trip/create', {
                method: 'POST',
                headers: {
                    // 'Cookie': 'session_id="0f40d507963923c82b463462ec6c3ba4bcf6b2192ed2288d4e8bac1dc193b6ee"',
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Включение cookies в запрос

                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => {
                            throw new Error(`Network response was not ok: ${response.statusText}. Response body: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('There was an error!', error);

                });
        }

        await post_trip();
    };

    return (
        <>
            <div id="map" className="yandex_map"></div>
            <div className="cursor-point" style={{
                background: `url(${map_point}) no-repeat center center`,
                width: '100px',
                height: '100px',
            }} />
            <div className="bottom_block h_none">
                <span className="searching_driver">We are looking for a driver...</span>
                <a className="cancel_trip">
                    <h2>Cancel</h2>
                </a>
            </div>
        </>
    );
}

export default CarSearching;