"use client";

export default function GlobeLoader({
  size = 200,
  speed = 8,
  planeColor = "#0d47a1",
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, perspective: 800 }}
    >
      {/* 🌍 Globe Image */}
      <img
        src="/assets/globe.png"
        alt="Rotating Globe"
        className=" h-28 object-contain select-none pointer-events-none"
      />

      {/* ✈️ Orbit Container (tilted 3D) */}
      <div
        className="absolute inset-0 animate-orbit"
        style={{
          animationDuration: `${speed}s`,
          transformStyle: "preserve-3d",
          transform: "rotateX(55deg) rotateZ(-30deg)", // tilt orbit
        }}
      >
        {/* Orbit ring (optional visual guide) */}
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="60"
            fill="none"
            stroke={planeColor}
           strokeWidth="2"   
          />
        </svg>

        {/* ✈️ Plane Icon */}
        <div className="absolute left-1/2 top-8 transform -translate-x-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            className="drop-shadow-lg"
          >
            <path
              fill={planeColor}
              d="M20.56 3.91c.59.59.59 1.54 0 2.12l-3.89 3.89l2.12 9.19l-1.41 1.42l-3.88-7.43L9.6 17l.36 2.47l-1.07 1.06l-1.76-3.18l-3.19-1.77L5 14.5l2.5.37L11.37 11L3.94 7.09l1.42-1.41l9.19 2.12l3.89-3.89c.56-.58 1.56-.58 2.12 0"
            />
          </svg>
        </div>
      </div>

      {/* ⚙️ Animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotateX(55deg) rotateZ(-30deg) rotate(0deg);
          }
          to {
            transform: rotateX(55deg) rotateZ(-30deg) rotate(360deg);
          }
        }

        .animate-orbit {
          animation-name: orbit;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
}
