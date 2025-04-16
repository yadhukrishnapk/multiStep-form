import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';

const ThankYou = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Confetti for 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div>
              {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
          gravity={0.2}
          tweenDuration={5000}
        />
      )}
    <div className="thank-you-container">
      <div className="thank-you-content">
        <h1>Thank You!</h1>
        <p>Your registration has been successfully submitted.</p>
        <p>We appreciate your time and will get back to you soon.</p>
        <button className="return-btn" onClick={handleReturn}>
          Return to Form
        </button>
      </div>
    </div>
    </div>
  );
};

export default ThankYou;