import React from 'react'

const Homepagedots = () => {
  return (
    
       <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={
              current % slides.length === index
                ? "dot active-dot"
                : "dot"
            }
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    
  )
}

export default Homepagedots
