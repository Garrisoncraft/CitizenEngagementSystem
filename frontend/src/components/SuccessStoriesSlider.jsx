import React, { useState } from 'react';
import user1 from '../assets/user1.png';
import user2 from  '../assets/user1.png';
import user3 from '../assets/user1.png';

const mockStories = [
  {
    id: 1,
    story: `Working in the Parks Department, CitizenConnect has streamlined how we receive and respond to citizen requests. The categorization system ensures we see relevant issues immediately.`,
    name: "Garrison N Sayor III",
    role: "City Parks Department",
    avatar: user1,
  },
  {
    id: 2,
    story: `I reported a broken street light that had been out for months. Within a week of submitting through CitizenConnect, it was fixed! The ability to track the progress made all the difference.`,
    name: "George Kona Ware",
    role: "Resident, Busanza District",
    avatar: user2,
  },
  {
    id: 3,
    story: `As a small business owner, I needed to report accessibility issues on the sidewalk near my shop. The process was simple, and I appreciated getting updates directly from the public works department.`,
    name: "Christopher Leabon",
    role: "Business Owner, Chic",
    avatar: user3,
  },
];


const SuccessStoriesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? mockStories.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === mockStories.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const { story, name, role, avatar } = mockStories[currentIndex];

  return (
    <div style={{ maxWidth: '720px', margin: '40px auto', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
           <style>
        {`
          @media (max-width: 600px) {
            .slider-heading {
              font-size: 22px !important;
            }
            .slider-story {
              font-size: 16px !important;
            }
          }
        `}
      </style>
      <div style={{ marginBottom: '10px' }}>
        <span style={{
          backgroundColor: '#e0e7ff',
          color: '#4f46e5',
          fontWeight: '600',
          fontSize: '14px',
          padding: '6px 12px',
          borderRadius: '9999px',
          display: 'inline-block',
          marginBottom: '12px',
        }}>
          Success Stories
        </span>
        <h2 style={{ fontWeight: '900', fontSize: '36px', margin: '0 0 12px 0' }}>
          What Our Users Say
        </h2>
        <p style={{ color: '#4b5563', fontSize: '16px', maxWidth: '480px', margin: '0 auto' }}>
          Real feedback from citizens and government employees who use CitizenConnect to improve their communities.
        </p>
      </div>
      <div style={{
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderRadius: '16px',
        backgroundColor: '#fff',
        position: 'relative',
        minHeight: '220px',
        maxWidth: '720px',
        margin: '0 auto',
        textAlign: 'left',
      }}>
        <p className= 'slider-story' style={{ fontSize: '22px', lineHeight: '1.6', marginBottom: '40px', fontWeight: '500' }}>
          <span style={{ fontSize: '36px', verticalAlign: 'top', color: '#c7d2fe', marginRight: '8px' }}>&ldquo;</span>
          {story}
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={avatar}
            alt={name}
            style={{ width: '56px', height: '56px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>{name}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{role}</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={prevSlide}
          aria-label="Previous Story"
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: '1',
            color: '#374151',
          }}
        >
          &#8592;
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          {mockStories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to story ${index + 1}`}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: currentIndex === index ? '#4f46e5' : '#d1d5db',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          aria-label="Next Story"
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '20px',
            lineHeight: '1',
            color: '#374151',
          }}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default SuccessStoriesSlider;
