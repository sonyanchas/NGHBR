import React, { useState } from 'react';
import './NeighborSetup.css';

const CITIES = ['Nairobi', 'Mombasa'];
const CATEGORIES = [
    ['cleaning', 'Cleaning'],
    ['moving', 'Moving & Delivery'],
    ['handyman', 'Handyman'],
    ['furniture-assembly', 'Furniture Assembly'],
    ['gardening', 'Gardening'],
    ['tutoring', 'Tutoring'],
    ['errands', 'Errands'],
    ['tech-help', 'Tech Help'],
    ['other', 'Other'],
];

function NeighborSetup({ onContinue, onBack }) {
    const [city, setCity] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onContinue({ city, category });
    };

    return (
        <main className="neighbor-setup-page">
            <button className="neighbor-back" type="button" onClick={onBack}>Back</button>
            <section className="neighbor-setup-content">
                <p className="neighbor-eyebrow">Become a Neighbor</p>
                <h1>What do you help with?</h1>
                <p className="neighbor-intro">Choose where you work and the service you want to offer.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="neighbor-city">Your city</label>
                    <select id="neighbor-city" value={city} onChange={(event) => setCity(event.target.value)} required>
                        <option value="">Select a city</option>
                        {CITIES.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>

                    <label htmlFor="neighbor-category">Task category</label>
                    <select id="neighbor-category" value={category} onChange={(event) => setCategory(event.target.value)} required>
                        <option value="">Choose a category</option>
                        {CATEGORIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>

                    <button className="neighbor-continue" type="submit">Get started</button>
                </form>
            </section>
        </main>
    );
}

export default NeighborSetup;