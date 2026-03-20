"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TabPills = ({
  logo,
  logoAlt = "Logo",
  tabs,
  activeKey,
  onTabChange,
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredTextColor = "#060010",
  pillTextColor,
}) => {
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;
        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          {
            scale: 1.2,
            xPercent: -50,
            duration: 0.3,
            ease: "power3.easeOut",
            overwrite: "auto",
          },
          0
        );
        if (label)
          tl.to(
            label,
            {
              y: -(h + 8),
              duration: 0.3,
              ease: "power3.easeOut",
              overwrite: "auto",
            },
            0
          );
        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            {
              y: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power3.easeOut",
              overwrite: "auto",
            },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [tabs]);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    if (!logoImgRef.current) return;
    logoTweenRef.current?.kill();
    gsap.set(logoImgRef.current, { rotate: 0 });
    logoTweenRef.current = gsap.to(logoImgRef.current, {
      rotate: 360,
      duration: 0.2,
      ease: "power3.easeOut",
      overwrite: "auto",
    });
  };

  const cssVars = {
    "--base": baseColor,
  };

  return (
    <div className="flex justify-center" style={cssVars}>
      {/* Wrapper with black background and rounded full */}
      <div className="flex flex-wrap gap-3 justify-center items-center md:bg-[var(--base)] rounded-full p-2">
        {/* Logo Pill */}
        {logo && (
          <button
            onMouseEnter={handleLogoEnter}
            className="relative md:inline-flex hidden  items-center justify-center w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ background: baseColor }}
          >
            <img
              src={logo}
              alt={logoAlt}
              ref={logoImgRef}
              className="w-full h-full object-cover rounded-full"
            />
          </button>
        )}

        {/* Tab Pills */}
        {tabs.map((tab, i) => {
          const isActive = activeKey === tab.key;

          const pillStyle = {
            background: pillColor,
            color: pillTextColor ?? baseColor,
            paddingLeft: "18px",
            paddingRight: "18px",
          };

          const PillContent = (
            <>
              <span
                className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                style={{ background: baseColor, willChange: "transform" }}
                ref={(el) => (circleRefs.current[i] = el)}
              />
              <span className="label-stack relative inline-block leading-[1] z-[2]">
                <span
                  className="pill-label relative z-[2] inline-block leading-[1]"
                  style={{ willChange: "transform" }}
                >
                  {tab.label}
                </span>
                <span
                  className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                  style={{
                    color: hoveredTextColor,
                    willChange: "transform, opacity",
                  }}
                  aria-hidden="true"
                >
                  {tab.label}
                </span>
              </span>
              {isActive && (
                <span
                  className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                  style={{ background: baseColor }}
                />
              )}
            </>
          );

          return (
            <button
              key={tab.key}
              className="relative overflow-hidden inline-flex items-center justify-center h-10 rounded-full font-semibold uppercase tracking-[0.2px] cursor-pointer"
              style={pillStyle}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => handleLeave(i)}
              onClick={() => onTabChange(tab.key)}
            >
              {PillContent}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabPills;
