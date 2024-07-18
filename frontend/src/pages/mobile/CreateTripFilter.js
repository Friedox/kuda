import '../../styles/mobile/style.css';
import LocationSelectSection from "../../components/mobile/LocationSelectSection";
import ProfileBlock from "../../components/mobile/ProfileBlock";
import profile_img from "../../assets/profile_example.png"
import plus from "../../assets/icon/plus_no_circle.svg"
import minus from "../../assets/icon/minus.svg"
import arrow from "../../assets/icon/arrow_right.svg"
import InputMask from 'react-input-mask';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';

function TripFilter() {
    const [value, setValue] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const sessionId = Cookies.get('session_id');
        if (!sessionId) {
            // Перенаправляем пользователя на главную страницу или другую страницу
            window.location.href = '/'; // Убедитесь, что этот путь существует в вашем приложении
        }
    }, []);

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

    return (
        <>
            <section className="mobile_section">
                <div className="filter_block mt90px">
                    <ProfileBlock profile_id="0" name="Andrey" profile_img={profile_img} grade="4.2" />
                    <InputMask
                        className="input"
                        mask="+7 (999) 99-99-999"
                        maskChar="_"
                        placeholder="+7 (___) __-__-___"
                        onChange={(e) => console.log(e.target.value)}
                    />
                    <input
                        className="input"
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder="@telegram_alias"
                        maxLength={31} // максимальная длина вводимой строки, включая @
                    />
                    <div className="flex_row">
                            <DatePicker
                                selected={selectedDate}
                                onChange={dataChange}
                                showTimeSelect
                                dateFormat="Pp"
                                placeholderText="Select time"
                                customInput={<CustomInput value={formattedDate} />}
                            />
                            <a className="input w50" >1 passenger</a>
                    </div>
                </div>

            </section>
            <div className="bottom_block">
                <h2>Number of reserved seats</h2>
                <div className="flex_row flex_center">
                    <div className="flex_input">
                        <a className="input_number_icon">
                            <img src={minus} />
                        </a>
                        <input className="no_border_input" type="number" placeholder="1" max="6"/>
                        <a className="input_number_icon">
                            <img src={plus} />
                        </a>
                    </div>
                    <a className="next_btn_circle" href="">
                        <img src={arrow} />
                    </a>
                </div>

            </div>
            {/*<div className='gray_bg'/>*/}
        </>
    );
}

export default TripFilter;