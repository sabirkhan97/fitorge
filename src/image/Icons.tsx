// export const FitOrge = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 500 100"
//     width="500"
//     height="100"
//   >
export const FitOrge = ({ height = 40 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 100"
        height={height}
    >
        <rect x="0" y="0" width="80" height="100" fill="#111111" rx="4" />
        <rect x="13" y="14" width="7" height="72" rx="2" fill="#C8F135" />
        <rect x="13" y="14" width="38" height="7" rx="2" fill="#C8F135" />
        <rect x="13" y="42" width="28" height="7" rx="2" fill="#C8F135" />
        <line
            x1="52"
            y1="13"
            x2="65"
            y2="87"
            stroke="#C8F135"
            strokeWidth="5"
            strokeLinecap="round"
        />
        <rect x="74" y="0" width="6" height="100" fill="#C8F135" />
        <text
            x="96"
            y="72"
            fontFamily="'Bebas Neue', 'Arial Narrow', sans-serif"
            fontSize="68"
            letterSpacing="3"
            fill="#FFFFFF"
        >
            FITORGE
        </text>
        <rect x="96" y="78" width="76" height="3" rx="1.5" fill="#C8F135" />
        <text
            x="97"
            y="93"
            fontFamily="'Space Mono', 'Courier New', monospace"
            fontSize="9"
            letterSpacing="3"
            fill="#555555"
        >
            AI-POWERED TRAINING
        </text>
    </svg>
);