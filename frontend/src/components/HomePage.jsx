import React, { useState, useEffect } from "react";

const HomePage = () => {
  const slides = [
    {
      url: "https://idsb.tmgrup.com.tr/ly/uploads/images/2020/04/03/28587.jpg",
    },
    {
      url: "https://etimg.etb2bimg.com/thumb/msid-89424315,imgsize-30500,width-1200,height=765,overlay-ethealth/health-it/web3an-evolution-of-the-internet-that-will-make-online-healthcare-safer.jpg",
    },
    {
      url: "https://media.istockphoto.com/id/1342134434/photo/caring-doctor-listens-to-patient.jpg?s=612x612&w=0&k=20&c=oTy-3urXPXBh_7oNGQS-mbleCsKpcxGz_-WLcL40EMk=",
    },
    {
      url: "https://www.velvetmag.co.uk/_media/img/5LWBY1OQFVPWFJ0HV4HW.jpg",
    },
    {
      url: "https://lifework.edu/hubfs/AI-Generated%20Media/Images/medical%20assistant-1.jpeg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Go to a specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Optional: Auto slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval); // Clear the interval when the component is unmounted
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="relative h-[600px] bg-cover bg-center transition-all duration-500 -mb-24 ">
        <div
          style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
          className="w-full h-[500px] duration-500 bg-center bg-cover"
        ></div>

        <div className="flex justify-center mt-4">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rounded-full mx-2 cursor-pointer ${
                currentIndex === index ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => goToSlide(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
