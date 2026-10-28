import React, { useEffect, useState } from 'react';

function Eyes() {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      let mousex = e.clientX;
      let mousey = e.clientY;

      // Calculate distance from center
      let deltax = mousex - window.innerWidth / 2;
      let deltay = mousey - window.innerHeight / 2;

      // Calculate angle
      const angle = Math.atan2(deltay, deltax);
      const degree = (angle * 180) / Math.PI;

      setRotate(degree);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="eyes w-full h-screen overflow-hidden flex items-center justify-center">
      
      {/* Background with rounded corners */}
      <div data-scroll data-scroll-speed="-.7" className="relative w-full max-w-6xl h-[700px] mt-10 rounded-3xl overflow-hidden bg-cover bg-no-repeat bg-center bg-[url('https://ochi.design/wp-content/uploads/2022/05/Homepage-Photo-1326x939.jpg')]">
        
        {/* Eyes Container */}
        <div className="absolute flex gap-10 top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
          
          {/* Left Eye */}
          <div className="flex items-center justify-center w-[11vw] h-[11vw] rounded-full bg-zinc-100">
            <div className="relative w-2/3 h-2/3 rounded-full bg-black overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white absolute"
                  style={{
                    transform: `translate(-50%, -180%)`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Eye */}
          <div className="flex items-center justify-center w-[11vw] h-[11vw] rounded-full bg-zinc-100">
            <div className="relative w-2/3 h-2/3 rounded-full bg-black overflow-hidden">
              <div
                className="absolute top-1/2 left-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
                }}
              >
                <div
                  className="w-5 h-5 rounded-full bg-white absolute"
                  style={{
                    transform: `translate(-50%, -180%)`,
                  }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Eyes;
